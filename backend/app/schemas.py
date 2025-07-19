"""
Pydantic schemas for request/response models.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr

from app.models import PodcastStatus, PodcastType


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_premium: bool
    total_podcasts_generated: int
    total_minutes_generated: float
    created_at: datetime
    
    class Config:
        from_attributes = True


# Podcast request schemas
class PodcastRequestCreate(BaseModel):
    original_topic: str = Field(..., min_length=10, max_length=5000, description="The topic or storyline for the podcast")
    podcast_type: PodcastType = Field(PodcastType.GENERAL, description="Type of podcast content")
    target_duration: int = Field(10, ge=1, le=60, description="Target duration in minutes")
    target_audience: str = Field("general", max_length=100, description="Target audience description")


class PodcastRequestUpdate(BaseModel):
    status: Optional[PodcastStatus] = None
    enhanced_script: Optional[str] = None
    audio_file_path: Optional[str] = None
    audio_file_url: Optional[str] = None
    error_message: Optional[str] = None


class PodcastRequestResponse(BaseModel):
    id: int
    user_id: int
    original_topic: str
    podcast_type: PodcastType
    target_duration: int
    target_audience: str
    enhanced_script: Optional[str] = None
    audio_file_url: Optional[str] = None
    status: PodcastStatus
    error_message: Optional[str] = None
    processing_time_script: Optional[float] = None
    processing_time_audio: Optional[float] = None
    total_processing_time: Optional[float] = None
    audio_duration: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PodcastRequestSummary(BaseModel):
    id: int
    original_topic: str
    podcast_type: PodcastType
    status: PodcastStatus
    target_duration: int
    audio_duration: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Processing schemas
class ScriptEnhancementRequest(BaseModel):
    topic: str
    podcast_type: PodcastType = PodcastType.GENERAL
    target_duration: int = 10
    target_audience: str = "general"
    additional_context: Optional[str] = None
    focus_area: Optional[str] = None  # For business podcasts and specific focus areas


class ScriptEnhancementResponse(BaseModel):
    enhanced_script: str
    processing_time: float
    tokens_used: int
    ai_model_used: str  # Changed from model_used to avoid protected namespace
    cost_estimate: Optional[float] = None


class AudioGenerationRequest(BaseModel):
    script: str
    voice_id: Optional[str] = None
    podcast_type: PodcastType = PodcastType.GENERAL
    voice_settings: Optional[dict] = None


class AudioGenerationResponse(BaseModel):
    audio_file_path: str
    audio_file_url: str
    audio_duration: float
    file_size: int
    processing_time: float
    characters_used: int
    cost_estimate: Optional[float] = None


# Status and monitoring schemas
class PodcastStatusResponse(BaseModel):
    id: int
    status: PodcastStatus
    progress_percentage: int
    current_stage: str
    estimated_completion: Optional[datetime] = None
    error_message: Optional[str] = None


class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: dict


class UsageStats(BaseModel):
    total_requests: int
    completed_requests: int
    failed_requests: int
    average_processing_time: float
    total_audio_minutes: float
    total_cost: float


# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# Configuration schemas
class VoiceSettings(BaseModel):
    stability: float = Field(0.5, ge=0.0, le=1.0)
    similarity_boost: float = Field(0.8, ge=0.0, le=1.0)
    style: float = Field(0.0, ge=0.0, le=1.0)
    use_speaker_boost: bool = True


class OpenAISettings(BaseModel):
    model: str = "gpt-4-turbo-preview"
    max_tokens: int = Field(4096, ge=100, le=8192)
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    top_p: float = Field(1.0, ge=0.0, le=1.0)


class PodcastGenerationSettings(BaseModel):
    openai_settings: OpenAISettings
    voice_settings: VoiceSettings
    voice_id: str
    enable_processing_optimization: bool = True
    enable_cost_optimization: bool = True


# Error schemas
class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    error_code: Optional[str] = None
    timestamp: datetime
