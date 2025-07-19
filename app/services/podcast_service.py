"""
Main podcast generation service that orchestrates the entire pipeline.
Handles the complete flow from topic to final audio file.
"""
import asyncio
import time
from typing import Optional, Dict, Any
from datetime import datetime
import structlog

from sqlalchemy.orm import Session

from app.models import PodcastRequest, PodcastStatus, User
from app.schemas import (
    PodcastRequestCreate, 
    PodcastRequestResponse,
    ScriptEnhancementRequest,
    AudioGenerationRequest
)
from app.services.openai_service import openai_service
from app.services.elevenlabs_service import elevenlabs_service
from app.services.single_speaker_service import single_speaker_service
from app.database import get_db

logger = structlog.get_logger(__name__)


class PodcastService:
    """Main service for podcast generation pipeline."""
    
    def __init__(self):
        self.openai_service = openai_service
        self.elevenlabs_service = elevenlabs_service
        self.single_speaker_service = single_speaker_service
    
    async def create_podcast_request(
        self,
        user_id: int,
        request_data: PodcastRequestCreate,
        db: Session
    ) -> PodcastRequestResponse:
        """
        Create a new podcast generation request and start processing.
        
        Args:
            user_id: ID of the requesting user
            request_data: Podcast creation request data
            db: Database session
            
        Returns:
            Created podcast request with initial status
        """
        # Create database record
        db_request = PodcastRequest(
            user_id=user_id,
            original_topic=request_data.original_topic,
            podcast_type=request_data.podcast_type,
            target_duration=request_data.target_duration,
            target_audience=request_data.target_audience,
            status=PodcastStatus.PENDING,
            started_at=datetime.utcnow()
        )
        
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        
        logger.info(
            "Created podcast request",
            request_id=db_request.id,
            user_id=user_id,
            podcast_type=request_data.podcast_type.value
        )
        
        # Start processing asynchronously
        asyncio.create_task(self._process_podcast_async(db_request.id, request_data))
        
        return PodcastRequestResponse.model_validate(db_request)
    
    async def _process_podcast_async(
        self,
        request_id: int,
        request_data: PodcastRequestCreate
    ) -> None:
        """
        Process podcast generation asynchronously.
        
        Args:
            request_id: Database ID of the request
            request_data: Original request data
        """
        start_time = time.time()
        
        # Get a new database session for this async task
        db = next(get_db())
        
        try:
            # Update status to processing script
            self._update_request_status(db, request_id, PodcastStatus.PROCESSING_SCRIPT)
            
            # Step 1: Enhance script with OpenAI
            script_result = await self._enhance_script(request_data)
            
            # Update database with script
            self._update_request_with_script(db, request_id, script_result)
            
            # Update status to processing audio
            self._update_request_status(db, request_id, PodcastStatus.PROCESSING_AUDIO)
            
            # Step 2: Generate audio with ElevenLabs
            audio_result = await self._generate_audio(script_result.enhanced_script, request_data)
            
            # Update database with audio info
            self._update_request_with_audio(db, request_id, audio_result)
            
            # Calculate total processing time
            total_time = time.time() - start_time
            
            # Mark as completed
            self._complete_request(db, request_id, total_time, script_result, audio_result)
            
            logger.info(
                "Podcast generation completed successfully",
                request_id=request_id,
                total_processing_time=total_time
            )
            
        except Exception as e:
            logger.error(
                "Podcast generation failed",
                request_id=request_id,
                error=str(e),
                processing_time=time.time() - start_time
            )
            self._mark_request_failed(db, request_id, str(e))
        
        finally:
            db.close()
    
    async def _enhance_script(self, request_data: PodcastRequestCreate):
        """Enhance the original topic into a full script."""
        enhancement_request = ScriptEnhancementRequest(
            topic=request_data.original_topic,
            podcast_type=request_data.podcast_type,
            target_duration=request_data.target_duration,
            target_audience=request_data.target_audience
        )
        
        return await self.openai_service.enhance_podcast_script(enhancement_request)
    
    async def enhance_script_direct(self, user_input: str, podcast_type: str, target_duration: int, target_audience: str, focus_area: str = None):
        """Direct script enhancement method for testing and standalone use."""
        enhancement_request = ScriptEnhancementRequest(
            topic=user_input,
            podcast_type=podcast_type,
            target_duration=target_duration,
            target_audience=target_audience,
            focus_area=focus_area
        )
        result = await self.openai_service.enhance_podcast_script(enhancement_request)
        return result.enhanced_script
    
    async def generate_single_speaker_script(self, topic: str, storyline: str, podcast_type: str, target_duration: int, target_audience: str, focus_area: str = None):
        """Generate clean single-speaker narrative optimized for TTS."""
        return await self.single_speaker_service.generate_clean_narrative(
            topic=topic,
            storyline=storyline,
            podcast_type=podcast_type,
            target_duration=target_duration,
            target_audience=target_audience,
            focus_area=focus_area
        )
    
    async def generate_podcast(self, request_data: dict, single_speaker: bool = True):
        """Generate podcast without database for testing purposes."""
        start_time = time.time()
        
        # Step 1: Generate script based on mode
        if single_speaker:
            enhanced_script = await self.generate_single_speaker_script(
                topic=request_data.get('topic', ''),
                storyline=request_data.get('storyline', ''),
                podcast_type=request_data.get('podcast_type', 'general'),
                target_duration=request_data.get('target_duration', 5),
                target_audience=request_data.get('target_audience', 'general'),
                focus_area=request_data.get('focus_area')
            )
        else:
            enhanced_script = await self.enhance_script_direct(
                user_input=request_data.get('storyline', ''),
                podcast_type=request_data.get('podcast_type', 'general'),
                target_duration=request_data.get('target_duration', 5),
                target_audience=request_data.get('target_audience', 'general'),
                focus_area=request_data.get('focus_area')
            )
        
        # Step 2: Generate audio
        audio_request = AudioGenerationRequest(
            script=enhanced_script,
            podcast_type=request_data.get('podcast_type', 'general')
        )
        
        audio_result = await self.elevenlabs_service.generate_podcast_audio(audio_request)
        
        processing_time = time.time() - start_time
        
        return {
            'enhanced_script': enhanced_script,
            'audio_file_path': audio_result.audio_file_path,
            'duration_minutes': audio_result.audio_duration / 60,
            'processing_time_seconds': round(processing_time, 1),
            'file_size_bytes': audio_result.file_size,
            'single_speaker_mode': single_speaker
        }
    
    async def _generate_audio(self, script: str, request_data: PodcastRequestCreate):
        """Generate audio from the enhanced script."""
        audio_request = AudioGenerationRequest(
            script=script,
            podcast_type=request_data.podcast_type
        )
        
        return await self.elevenlabs_service.generate_podcast_audio(audio_request)
    
    def _update_request_status(self, db: Session, request_id: int, status: PodcastStatus):
        """Update request status in database."""
        db_request = db.query(PodcastRequest).filter(PodcastRequest.id == request_id).first()
        if db_request:
            db_request.status = status
            db_request.updated_at = datetime.utcnow()
            db.commit()
    
    def _update_request_with_script(self, db: Session, request_id: int, script_result):
        """Update request with script generation results."""
        db_request = db.query(PodcastRequest).filter(PodcastRequest.id == request_id).first()
        if db_request:
            db_request.enhanced_script = script_result.enhanced_script
            db_request.processing_time_script = script_result.processing_time
            db_request.openai_model_used = script_result.ai_model_used
            db_request.openai_tokens_used = script_result.tokens_used
            db_request.openai_cost = script_result.cost_estimate
            db_request.updated_at = datetime.utcnow()
            db.commit()
    
    def _update_request_with_audio(self, db: Session, request_id: int, audio_result):
        """Update request with audio generation results."""
        db_request = db.query(PodcastRequest).filter(PodcastRequest.id == request_id).first()
        if db_request:
            db_request.audio_file_path = audio_result.audio_file_path
            db_request.audio_file_url = audio_result.audio_file_url
            db_request.processing_time_audio = audio_result.processing_time
            db_request.audio_duration = audio_result.audio_duration
            db_request.audio_file_size = audio_result.file_size
            db_request.elevenlabs_characters_used = audio_result.characters_used
            db_request.elevenlabs_cost = audio_result.cost_estimate
            db_request.updated_at = datetime.utcnow()
            db.commit()
    
    def _complete_request(self, db: Session, request_id: int, total_time: float, script_result, audio_result):
        """Mark request as completed with final metadata."""
        db_request = db.query(PodcastRequest).filter(PodcastRequest.id == request_id).first()
        if db_request:
            db_request.status = PodcastStatus.COMPLETED
            db_request.total_processing_time = total_time
            db_request.completed_at = datetime.utcnow()
            db_request.updated_at = datetime.utcnow()
            db.commit()
            
            # Update user statistics
            user = db.query(User).filter(User.id == db_request.user_id).first()
            if user:
                user.total_podcasts_generated += 1
                user.total_minutes_generated += (audio_result.audio_duration / 60)
                db.commit()
    
    def _mark_request_failed(self, db: Session, request_id: int, error_message: str):
        """Mark request as failed with error message."""
        db_request = db.query(PodcastRequest).filter(PodcastRequest.id == request_id).first()
        if db_request:
            db_request.status = PodcastStatus.FAILED
            db_request.error_message = error_message
            db_request.updated_at = datetime.utcnow()
            db.commit()
    
    def get_request_by_id(self, request_id: int, user_id: int, db: Session) -> Optional[PodcastRequestResponse]:
        """Get podcast request by ID (with user verification)."""
        db_request = db.query(PodcastRequest).filter(
            PodcastRequest.id == request_id,
            PodcastRequest.user_id == user_id
        ).first()
        
        if db_request:
            return PodcastRequestResponse.model_validate(db_request)
        return None
    
    def get_user_requests(self, user_id: int, db: Session, limit: int = 50, offset: int = 0):
        """Get all podcast requests for a user."""
        requests = db.query(PodcastRequest).filter(
            PodcastRequest.user_id == user_id
        ).order_by(
            PodcastRequest.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return [PodcastRequestResponse.model_validate(req) for req in requests]
    
    async def get_processing_status(self, request_id: int, user_id: int, db: Session) -> Dict[str, Any]:
        """Get detailed processing status for a request."""
        db_request = db.query(PodcastRequest).filter(
            PodcastRequest.id == request_id,
            PodcastRequest.user_id == user_id
        ).first()
        
        if not db_request:
            return {"error": "Request not found"}
        
        # Calculate progress percentage
        progress = self._calculate_progress(db_request.status)
        
        # Estimate completion time
        estimated_completion = None
        if db_request.status in [PodcastStatus.PROCESSING_SCRIPT, PodcastStatus.PROCESSING_AUDIO]:
            estimated_completion = self._estimate_completion_time(db_request)
        
        return {
            "id": db_request.id,
            "status": db_request.status.value,
            "progress_percentage": progress,
            "current_stage": self._get_current_stage_description(db_request.status),
            "estimated_completion": estimated_completion,
            "error_message": db_request.error_message,
            "processing_time_so_far": self._calculate_current_processing_time(db_request),
            "created_at": db_request.created_at,
            "started_at": db_request.started_at
        }
    
    def _calculate_progress(self, status: PodcastStatus) -> int:
        """Calculate progress percentage based on current status."""
        progress_map = {
            PodcastStatus.PENDING: 0,
            PodcastStatus.PROCESSING_SCRIPT: 25,
            PodcastStatus.PROCESSING_AUDIO: 65,
            PodcastStatus.COMPLETED: 100,
            PodcastStatus.FAILED: 0
        }
        return progress_map.get(status, 0)
    
    def _get_current_stage_description(self, status: PodcastStatus) -> str:
        """Get human-readable description of current processing stage."""
        stage_map = {
            PodcastStatus.PENDING: "Initializing podcast generation",
            PodcastStatus.PROCESSING_SCRIPT: "Enhancing script with AI storytelling",
            PodcastStatus.PROCESSING_AUDIO: "Converting script to natural speech",
            PodcastStatus.COMPLETED: "Podcast generation completed",
            PodcastStatus.FAILED: "Generation failed"
        }
        return stage_map.get(status, "Unknown stage")
    
    def _estimate_completion_time(self, db_request: PodcastRequest) -> Optional[datetime]:
        """Estimate completion time based on current progress and typical processing times."""
        if not db_request.started_at:
            return None
        
        current_time = datetime.utcnow()
        elapsed = (current_time - db_request.started_at).total_seconds()
        
        # Rough estimates based on typical processing times
        if db_request.status == PodcastStatus.PROCESSING_SCRIPT:
            # Script processing typically takes 30-60 seconds
            remaining_script_time = max(0, 45 - elapsed)
            # Audio processing typically takes 60-120 seconds
            audio_time = 90
            total_remaining = remaining_script_time + audio_time
        elif db_request.status == PodcastStatus.PROCESSING_AUDIO:
            # Audio processing typically takes 60-120 seconds
            # Estimate based on script length if available
            if db_request.enhanced_script:
                estimated_audio_time = len(db_request.enhanced_script) / 50  # rough estimate
                total_remaining = max(estimated_audio_time, 30)
            else:
                total_remaining = 90
        else:
            return None
        
        from datetime import timedelta
        return current_time + timedelta(seconds=total_remaining)
    
    def _calculate_current_processing_time(self, db_request: PodcastRequest) -> Optional[float]:
        """Calculate current processing time in seconds."""
        if not db_request.started_at:
            return None
        
        current_time = datetime.utcnow()
        return (current_time - db_request.started_at).total_seconds()
    
    async def health_check(self) -> Dict[str, Any]:
        """Check health of all services in the pipeline."""
        openai_healthy = await self.openai_service.health_check()
        elevenlabs_healthy = await self.elevenlabs_service.health_check()
        
        return {
            "status": "healthy" if (openai_healthy and elevenlabs_healthy) else "degraded",
            "services": {
                "openai": "healthy" if openai_healthy else "unhealthy",
                "elevenlabs": "healthy" if elevenlabs_healthy else "unhealthy"
            },
            "timestamp": datetime.utcnow()
        }


# Create singleton instance
podcast_service = PodcastService()
