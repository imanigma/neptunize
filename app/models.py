"""
Database models for the Neptunize podcast generation platform.
"""
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import (
    Boolean, Column, DateTime, Enum as SQLEnum, Float, Integer, 
    String, Text, ForeignKey, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

Base = declarative_base()


class PodcastStatus(str, Enum):
    """Status of podcast generation process."""
    PENDING = "pending"
    PROCESSING_SCRIPT = "processing_script"
    PROCESSING_AUDIO = "processing_audio"
    COMPLETED = "completed"
    FAILED = "failed"


class PodcastType(str, Enum):
    """Type of podcast content."""
    CRIME = "crime"
    EDUCATIONAL = "educational"
    BUSINESS = "business"
    GENERAL = "general"


class User(Base):
    """User model for authentication and tracking."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Usage tracking
    total_podcasts_generated = Column(Integer, default=0)
    total_minutes_generated = Column(Float, default=0.0)
    
    # Relationships
    podcast_requests = relationship("PodcastRequest", back_populates="user")


class PodcastRequest(Base):
    """Main podcast generation request model."""
    __tablename__ = "podcast_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Input data
    original_topic = Column(Text, nullable=False)
    podcast_type = Column(SQLEnum(PodcastType), default=PodcastType.GENERAL)
    target_duration = Column(Integer, default=10)  # minutes
    target_audience = Column(String(100), default="general")
    
    # Processing data
    enhanced_script = Column(Text)
    audio_file_path = Column(String(500))
    audio_file_url = Column(String(500))
    
    # Status and metadata
    status = Column(SQLEnum(PodcastStatus), default=PodcastStatus.PENDING)
    error_message = Column(Text)
    processing_time_script = Column(Float)  # seconds
    processing_time_audio = Column(Float)  # seconds
    total_processing_time = Column(Float)  # seconds
    
    # Audio metadata
    audio_duration = Column(Float)  # seconds
    audio_file_size = Column(Integer)  # bytes
    
    # OpenAI metadata
    openai_model_used = Column(String(100))
    openai_tokens_used = Column(Integer)
    openai_cost = Column(Float)
    
    # ElevenLabs metadata
    elevenlabs_voice_id = Column(String(100))
    elevenlabs_model_used = Column(String(100))
    elevenlabs_characters_used = Column(Integer)
    elevenlabs_cost = Column(Float)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="podcast_requests")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_user_created', 'user_id', 'created_at'),
        Index('idx_status', 'status'),
        Index('idx_podcast_type', 'podcast_type'),
    )


class APIKey(Base):
    """API key management for external services."""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(50), nullable=False)  # openai, elevenlabs
    key_name = Column(String(100), nullable=False)
    encrypted_key = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    last_used = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('idx_service_active', 'service_name', 'is_active'),
    )


class SystemPrompt(Base):
    """Configurable system prompts for different podcast types."""
    __tablename__ = "system_prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    podcast_type = Column(SQLEnum(PodcastType), nullable=False)
    prompt_template = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    version = Column(String(20), default="1.0")
    created_by = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        Index('idx_type_active', 'podcast_type', 'is_active'),
    )


class UsageMetrics(Base):
    """Track usage metrics for monitoring and billing."""
    __tablename__ = "usage_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    request_id = Column(Integer, ForeignKey("podcast_requests.id"))
    
    # Metrics
    endpoint = Column(String(100))
    method = Column(String(10))
    status_code = Column(Integer)
    response_time = Column(Float)  # milliseconds
    
    # Resource usage
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    
    # Costs
    openai_cost = Column(Float)
    elevenlabs_cost = Column(Float)
    total_cost = Column(Float)
    
    # Timestamps
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index('idx_user_timestamp', 'user_id', 'timestamp'),
        Index('idx_endpoint_timestamp', 'endpoint', 'timestamp'),
    )
