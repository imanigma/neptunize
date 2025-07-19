"""
FastAPI application main module.
"""
import time
from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import structlog

from app.config import get_settings
from app.database import get_db, engine
from app.models import Base
from app.schemas import (
    PodcastRequestCreate, PodcastRequestResponse, PodcastRequestSummary,
    HealthCheck, UsageStats, ErrorResponse,
    UserCreate, UserResponse, Token
)
from app.services import podcast_service, openai_service, elevenlabs_service
from app.auth import (
    authenticate_user, create_access_token, get_current_user, 
    get_password_hash, verify_token
)

# Configure logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)
settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Neptunize Podcast Generation API",
    description="AI-powered podcast generation platform using OpenAI and ElevenLabs",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security
security = HTTPBearer()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Static files for audio
app.mount("/audio", StaticFiles(directory="generated_audio"), name="audio")


# Middleware for request logging and timing
@app.middleware("http")
async def log_requests(request, call_next):
    start_time = time.time()
    
    # Log request
    logger.info(
        "Request started",
        method=request.method,
        url=str(request.url),
        client_ip=request.client.host if request.client else None
    )
    
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(
        "Request completed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time=process_time
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Exception handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error("Unhandled exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal server error",
            detail="An unexpected error occurred",
            timestamp=datetime.utcnow()
        ).dict()
    )


# Health check endpoint
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Check the health of the API and dependent services."""
    service_health = await podcast_service.health_check()
    
    return HealthCheck(
        status=service_health["status"],
        timestamp=datetime.utcnow(),
        version="1.0.0",
        services=service_health["services"]
    )


# Authentication endpoints
@app.post("/auth/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    from app.models import User
    
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    logger.info("User registered", user_id=db_user.id, username=db_user.username)
    
    return UserResponse.model_validate(db_user)


@app.post("/auth/login", response_model=Token)
async def login_user(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    """Authenticate user and return access token."""
    user = authenticate_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    
    logger.info("User logged in", user_id=user.id, username=user.username)
    
    return Token(access_token=access_token, token_type="bearer")


# Podcast generation endpoints
@app.post("/podcasts", response_model=PodcastRequestResponse)
async def create_podcast(
    request_data: PodcastRequestCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new podcast generation request.
    
    This endpoint starts the AI-powered podcast generation pipeline:
    1. Enhances the provided topic/storyline using OpenAI
    2. Converts the enhanced script to audio using ElevenLabs
    3. Returns the request ID for tracking progress
    """
    try:
        podcast_request = await podcast_service.create_podcast_request(
            user_id=current_user.id,
            request_data=request_data,
            db=db
        )
        
        logger.info(
            "Podcast creation started",
            request_id=podcast_request.id,
            user_id=current_user.id,
            podcast_type=request_data.podcast_type.value
        )
        
        return podcast_request
        
    except Exception as e:
        logger.error("Podcast creation failed", error=str(e), user_id=current_user.id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create podcast: {str(e)}"
        )


@app.get("/podcasts/{request_id}", response_model=PodcastRequestResponse)
async def get_podcast(
    request_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get details of a specific podcast generation request."""
    podcast_request = podcast_service.get_request_by_id(request_id, current_user.id, db)
    
    if not podcast_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Podcast request not found"
        )
    
    return podcast_request


@app.get("/podcasts", response_model=List[PodcastRequestSummary])
async def get_user_podcasts(
    limit: int = 50,
    offset: int = 0,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all podcast requests for the current user."""
    requests = podcast_service.get_user_requests(current_user.id, db, limit, offset)
    return [PodcastRequestSummary.model_validate(req) for req in requests]


@app.get("/podcasts/{request_id}/status")
async def get_podcast_status(
    request_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed processing status for a podcast request."""
    status_info = await podcast_service.get_processing_status(request_id, current_user.id, db)
    
    if "error" in status_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=status_info["error"]
        )
    
    return status_info


# Configuration and management endpoints
@app.get("/voices")
async def get_available_voices(current_user = Depends(get_current_user)):
    """Get list of available voices from ElevenLabs."""
    try:
        voices = await elevenlabs_service.get_available_voices()
        return voices
    except Exception as e:
        logger.error("Failed to fetch voices", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch available voices"
        )


@app.get("/models")
async def get_available_models(current_user = Depends(get_current_user)):
    """Get list of available OpenAI models."""
    try:
        models = await openai_service.get_available_models()
        return {"models": models}
    except Exception as e:
        logger.error("Failed to fetch models", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch available models"
        )


@app.get("/user/stats", response_model=UsageStats)
async def get_user_stats(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage statistics for the current user."""
    from app.models import PodcastRequest, PodcastStatus
    
    # Get user's podcast requests
    user_requests = db.query(PodcastRequest).filter(
        PodcastRequest.user_id == current_user.id
    ).all()
    
    total_requests = len(user_requests)
    completed_requests = len([r for r in user_requests if r.status == PodcastStatus.COMPLETED])
    failed_requests = len([r for r in user_requests if r.status == PodcastStatus.FAILED])
    
    # Calculate average processing time
    completed_with_time = [r for r in user_requests if r.total_processing_time]
    avg_processing_time = (
        sum(r.total_processing_time for r in completed_with_time) / len(completed_with_time)
        if completed_with_time else 0
    )
    
    # Calculate total costs
    total_cost = sum(
        (r.openai_cost or 0) + (r.elevenlabs_cost or 0) 
        for r in user_requests
    )
    
    return UsageStats(
        total_requests=total_requests,
        completed_requests=completed_requests,
        failed_requests=failed_requests,
        average_processing_time=avg_processing_time,
        total_audio_minutes=current_user.total_minutes_generated,
        total_cost=total_cost
    )


# Admin endpoints (with basic protection)
@app.get("/admin/stats")
async def get_admin_stats(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get system-wide statistics (admin only)."""
    # TODO: Add proper admin role checking
    if not current_user.username.startswith("admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    from app.models import PodcastRequest, User, PodcastStatus
    
    total_users = db.query(User).count()
    total_requests = db.query(PodcastRequest).count()
    completed_requests = db.query(PodcastRequest).filter(
        PodcastRequest.status == PodcastStatus.COMPLETED
    ).count()
    
    return {
        "total_users": total_users,
        "total_requests": total_requests,
        "completed_requests": completed_requests,
        "success_rate": completed_requests / total_requests if total_requests > 0 else 0
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        workers=1 if settings.reload else settings.workers
    )
