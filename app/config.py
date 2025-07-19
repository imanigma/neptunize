"""
Configuration management for Neptunize backend.
Handles environment variables and application settings.
"""
import os
from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    elevenlabs_api_key: str = Field(..., env="ELEVENLABS_API_KEY")
    
    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    database_url_test: Optional[str] = Field(None, env="DATABASE_URL_TEST")
    
    # Redis
    redis_url: str = Field("redis://localhost:6379/0", env="REDIS_URL")
    
    # Security
    secret_key: str = Field(..., env="SECRET_KEY")
    algorithm: str = Field("HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Server
    host: str = Field("0.0.0.0", env="HOST")
    port: int = Field(8000, env="PORT")
    workers: int = Field(4, env="WORKERS")
    reload: bool = Field(True, env="RELOAD")
    
    # OpenAI Configuration
    openai_model: str = Field("gpt-4-turbo-preview", env="OPENAI_MODEL")
    openai_max_tokens: int = Field(4096, env="OPENAI_MAX_TOKENS")
    openai_temperature: float = Field(0.7, env="OPENAI_TEMPERATURE")
    
    # ElevenLabs Configuration
    elevenlabs_voice_id: str = Field("21m00Tcm4TlvDq8ikWAM", env="ELEVENLABS_VOICE_ID")
    elevenlabs_model_id: str = Field("eleven_turbo_v2_5", env="ELEVENLABS_MODEL_ID")  # High-quality conversational model (widely available)
    elevenlabs_stability: float = Field(0.5, env="ELEVENLABS_STABILITY")
    elevenlabs_similarity_boost: float = Field(0.8, env="ELEVENLABS_SIMILARITY_BOOST")
    elevenlabs_style: float = Field(0.0, env="ELEVENLABS_STYLE")
    elevenlabs_use_speaker_boost: bool = Field(True, env="ELEVENLABS_USE_SPEAKER_BOOST")
    
    # Logging
    log_level: str = Field("INFO", env="LOG_LEVEL")
    log_format: str = Field("json", env="LOG_FORMAT")
    
    # Rate Limiting
    rate_limit_per_minute: int = Field(10, env="RATE_LIMIT_PER_MINUTE")
    rate_limit_burst: int = Field(20, env="RATE_LIMIT_BURST")
    
    # Development
    debug: bool = Field(True, env="DEBUG")
    testing: bool = Field(False, env="TESTING")
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()


# System Prompts - Easily modifiable
class SystemPrompts:
    """System prompts for different podcast types and stages."""
    
    BASE_PODCAST_ENHANCER = """You are an expert podcast narrator and storyteller. Your task is to take a user's basic topic or storyline and transform it into an engaging, well-structured narrative that can be delivered naturally by a single speaker.

Key requirements:
1. Create a natural flowing narrative suitable for single-speaker delivery
2. Use engaging storytelling techniques and natural speech patterns
3. Include compelling details, character development, and narrative structure
4. Create natural flow and pacing suitable for audio storytelling
5. Include engaging hooks, transitions, and memorable moments
6. Ensure the content is informative, entertaining, and authentic
7. Write as a complete story that flows when spoken by one narrator
8. Avoid any special keywords, tags, or formatting markers
9. Focus on narrative storytelling rather than conversational dialogue

The output should be a complete narrative story that feels natural when delivered by a single speaker, like a skilled storyteller sharing an engaging tale.

Example approach:
"There's a story that needs to be told. It begins in an ordinary place, but what unfolds next is anything but ordinary. Let me take you on this journey..."

Original topic/storyline: {user_input}
Podcast type: {podcast_type}
Target duration: {target_duration} minutes
Target audience: {target_audience}

Generate an engaging single-narrator podcast story:"""

    CRIME_PODCAST_ENHANCER = """You are a master crime podcast narrator, specializing in true crime storytelling. Create an engaging, suspenseful narrative that can be delivered by a single speaker as a compelling story.

Focus on:
- Building tension and mystery through narrative storytelling
- Creating vivid scene descriptions and atmospheric details
- Developing compelling character backgrounds through storytelling
- Including investigative details and evidence revelations
- Adding unexpected twists and revelations in the narrative flow
- Maintaining ethical sensitivity to real events
- Using engaging narrator voice: "What happened next would shock everyone..."
- Creating smooth transitions between scenes and time periods
- Building suspense through pacing and revelation timing

The narrative should be written as a complete story that flows naturally when spoken by a single narrator, like a documentary storyteller guiding the audience through the case.

Original crime topic: {user_input}
Target duration: {target_duration} minutes

Create a compelling single-narrator crime podcast story:"""

    EDUCATIONAL_PODCAST_ENHANCER = """You are an expert educational storyteller who makes complex topics accessible through engaging narrative. Transform the user's educational topic into an informative yet entertaining story that can be delivered by a single narrator.

Focus on:
- Breaking down complex concepts through storytelling and examples
- Using analogies and real-world scenarios in narrative form
- Creating engaging case studies and learning stories
- Building knowledge progressively through story structure
- Including fascinating facts and insights woven into the narrative
- Making learning enjoyable through compelling storytelling
- Using clear, natural speech patterns suitable for single-speaker delivery
- Creating smooth transitions between educational concepts
- Building understanding through narrative examples and stories

The narrative should educate while entertaining, told like a skilled teacher sharing fascinating stories that teach important lessons.

Example approach:
"Today I want to tell you a story about discovery. It's a story that will change how you think about this topic forever. It begins with a simple question that led to extraordinary answers..."

Educational topic: {user_input}
Target duration: {target_duration} minutes
Audience level: {audience_level}

Create an engaging educational narrative story:"""

    BUSINESS_PODCAST_ENHANCER = """You are a seasoned business podcast narrator who creates compelling stories about entrepreneurship, innovation, and business success. Create an engaging narrative that can be delivered by a single speaker as an inspiring business story.

Focus on:
- Creating a flowing narrative that tells business stories naturally
- Building compelling case studies and success stories through storytelling
- Highlighting key business insights through engaging examples
- Adding market analysis and trends through narrative storytelling
- Creating actionable takeaways through clear, direct explanation
- Building narrative around business challenges and solutions
- Making complex business concepts accessible through story examples
- Using engaging narrator voice: "Here's what every entrepreneur needs to understand..."
- Creating smooth transitions between different business concepts
- Building inspiration through real-world success and failure stories

The narrative should inspire and educate business professionals through engaging single-speaker storytelling that flows naturally when spoken.

Example approach:
"In the world of business, there are stories that change everything. Today, I want to tell you about one such story... When Sarah Chen started her company, she had no idea that her biggest mistake would become her greatest strength..."

Business topic: {user_input}
Target duration: {target_duration} minutes
Focus area: {focus_area}

Create an inspiring single-narrator business podcast story:"""

    @classmethod
    def get_prompt_by_type(cls, podcast_type: str) -> str:
        """Get the appropriate system prompt based on podcast type."""
        prompt_map = {
            "crime": cls.CRIME_PODCAST_ENHANCER,
            "educational": cls.EDUCATIONAL_PODCAST_ENHANCER,
            "business": cls.BUSINESS_PODCAST_ENHANCER,
            "general": cls.BASE_PODCAST_ENHANCER
        }
        return prompt_map.get(podcast_type.lower(), cls.BASE_PODCAST_ENHANCER)


# ElevenLabs Configuration
class ElevenLabsConfig:
    """Configuration for ElevenLabs TTS settings."""
    
    # Voice settings for different podcast types - Optimized for dynamic conversational quality
    VOICE_SETTINGS = {
        "crime": {
            "stability": 0.60,          # Moderate stability for dramatic variation
            "similarity_boost": 0.85,   # High similarity for character consistency
            "style": 0.45,              # High expressiveness for storytelling
            "use_speaker_boost": True
        },
        "educational": {
            "stability": 0.70,          # Higher stability for clear teaching
            "similarity_boost": 0.80,   # Good similarity
            "style": 0.35,              # Moderate expressiveness for engagement
            "use_speaker_boost": True
        },
        "business": {
            "stability": 0.65,          # Professional but dynamic
            "similarity_boost": 0.85,   # Consistent professional tone
            "style": 0.40,              # Professional but conversational expressiveness
            "use_speaker_boost": True
        },
        "general": {
            "stability": 0.60,          # Dynamic for general conversation
            "similarity_boost": 0.80,   # Good similarity
            "style": 0.50,              # High conversational and natural expressiveness
            "use_speaker_boost": True
        }
    }
    
    # Available voices with descriptions - Updated for better podcast quality
    AVAILABLE_VOICES = {
        "rachel": "21m00Tcm4TlvDq8ikWAM",  # Calm, professional female voice (recommended)
        "drew": "29vD33N1CtxCmqQRPOHJ",     # Young male voice (conversational)
        "bella": "EXAVITQu4vr4xnSDxMaL",    # Pleasant female voice (warm)
        "antoni": "ErXwobaYiN019PkySvjV",   # Well-rounded male voice (natural)
        "elli": "MF3mGyEYCl7XYWbV9V6O",     # Emotional female voice (expressive)
        "josh": "TxGEqnHWrfWFTfGW9XjX",     # Deep male voice (authoritative)
        "adam": "pNInz6obpgDQGcFmaJgB",     # Professional male narrator
        "nicole": "piTKgcLEGmPE4e6mEKli",   # Conversational female voice
    }
    
    # Available models with quality descriptions
    AVAILABLE_MODELS = {
        "eleven_turbo_v2_5": "Highest quality single-speaker model, natural conversational (recommended)",
        "eleven_v3_preview_2025_06_03": "Latest conversational AI with multi-speaker support (requires premium access)",
        "eleven_multilingual_v2": "Good quality, supports multiple languages",
        "eleven_monolingual_v1": "Fast generation, basic quality",
        "eleven_turbo_v2": "Balanced quality and speed"
    }
    
    @classmethod
    def get_voice_settings(cls, podcast_type: str) -> dict:
        """Get voice settings optimized for podcast type."""
        return cls.VOICE_SETTINGS.get(podcast_type.lower(), cls.VOICE_SETTINGS["general"])
