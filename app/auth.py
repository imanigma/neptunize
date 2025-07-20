"""
Authentication and authorization utilities.
"""
from datetime import datetime, timedelta
from typing import Optional
import structlog
import hashlib
import secrets
import base64

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User
from app.schemas import TokenData

logger = structlog.get_logger(__name__)
settings = get_settings()

# Security
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    # Simple implementation - use proper bcrypt in production
    return get_password_hash(plain_password) == hashed_password


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    # Simple implementation - use proper bcrypt in production
    salt = "neptunize_salt"  # Use proper random salt in production
    return hashlib.sha256((password + salt).encode()).hexdigest()


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """Authenticate user with username/email and password."""
    user = db.query(User).filter(
        (User.username == username) | (User.email == username)
    ).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create simple access token."""
    # Simplified token creation - use proper JWT in production
    username = data.get("sub")
    timestamp = datetime.utcnow().isoformat()
    # Use a separator that won't conflict with username or timestamp
    token_data = f"{username}|{timestamp}|{settings.secret_key}"
    token = base64.b64encode(token_data.encode()).decode()
    return token


def verify_token(token: str) -> TokenData:
    """Verify token and return token data."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        decoded = base64.b64decode(token).decode()
        parts = decoded.split("|")
        if len(parts) >= 3 and parts[2] == settings.secret_key:
            username = parts[0]
            return TokenData(username=username)
        else:
            logger.warning(f"Invalid token format: parts={len(parts)}, expected_key={settings.secret_key}")
            raise credentials_exception
    except Exception as e:
        logger.warning(f"Token verification failed: {str(e)}")
        raise credentials_exception


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    token = credentials.credentials
    token_data = verify_token(token)
    
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user (additional check)."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def require_premium_user(current_user: User = Depends(get_current_user)) -> User:
    """Require premium user for certain endpoints."""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required"
        )
    return current_user


# Rate limiting decorator (basic implementation)
def rate_limit(max_requests: int = 10, window_minutes: int = 1):
    """Basic rate limiting decorator."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # TODO: Implement proper rate limiting with Redis
            # For now, just pass through
            return await func(*args, **kwargs)
        return wrapper
    return decorator
