"""
ElevenLabs service for text-to-speech audio generation.
Handles communication with ElevenLabs API with optimization for podcast content.
"""
import asyncio
import os
import time
from typing import Dict, Any, Optional, Tuple
import structlog
import json

import httpx

from app.config import get_settings, ElevenLabsConfig
from app.schemas import AudioGenerationRequest, AudioGenerationResponse

logger = structlog.get_logger(__name__)
settings = get_settings()


class ElevenLabsService:
    """Service for handling ElevenLabs TTS API interactions."""
    
    def __init__(self):
        self.api_key = settings.elevenlabs_api_key
        self.base_url = "https://api.elevenlabs.io/v1"
        self.voice_id = settings.elevenlabs_voice_id
        self.model_id = settings.elevenlabs_model_id
        self.audio_dir = "generated_audio"
        
        # Ensure audio directory exists
        os.makedirs(self.audio_dir, exist_ok=True)
    
    async def generate_podcast_audio(
        self, 
        request: AudioGenerationRequest
    ) -> AudioGenerationResponse:
        """
        Generate audio from enhanced podcast script.
        
        Args:
            request: Audio generation request with script and settings
            
        Returns:
            Audio file information and metadata
        """
        start_time = time.time()
        
        try:
            # Get voice settings optimized for podcast type
            voice_settings = request.voice_settings or ElevenLabsConfig.get_voice_settings(
                request.podcast_type.value
            )
            
            # Use provided voice or default
            voice_id = request.voice_id or self.voice_id
            
            logger.info(
                "Generating audio with ElevenLabs",
                voice_id=voice_id,
                script_length=len(request.script),
                podcast_type=request.podcast_type.value
            )
            
            # Optimize script for TTS
            optimized_script = self._optimize_script_for_tts(request.script)
            
            # Generate audio with retry logic
            audio_data = await self._generate_audio_with_retry(
                text=optimized_script,
                voice_id=voice_id,
                voice_settings=voice_settings
            )
            
            # Save audio file
            file_path, file_url = await self._save_audio_file(audio_data)
            
            processing_time = time.time() - start_time
            
            # Get audio metadata
            file_size = len(audio_data)
            audio_duration = self._estimate_audio_duration(optimized_script)
            characters_used = len(optimized_script)
            
            logger.info(
                "Audio generation completed",
                processing_time=processing_time,
                file_size=file_size,
                audio_duration=audio_duration,
                characters_used=characters_used
            )
            
            return AudioGenerationResponse(
                audio_file_path=file_path,
                audio_file_url=file_url,
                audio_duration=audio_duration,
                file_size=file_size,
                processing_time=processing_time,
                characters_used=characters_used,
                cost_estimate=self._calculate_cost(characters_used)
            )
            
        except Exception as e:
            logger.error(
                "ElevenLabs audio generation failed",
                error=str(e),
                processing_time=time.time() - start_time
            )
            raise
    
    async def _generate_audio_with_retry(
        self,
        text: str,
        voice_id: str,
        voice_settings: dict,
        max_retries: int = 3
    ) -> bytes:
        """Generate audio with retry logic for rate limits and failures."""
        
        for attempt in range(max_retries):
            try:
                # Prepare request payload with conversational AI optimizations
                payload = {
                    "text": text,
                    "model_id": self.model_id,
                    "voice_settings": {
                        "stability": voice_settings.get("stability", 0.65),
                        "similarity_boost": voice_settings.get("similarity_boost", 0.80),
                        "style": voice_settings.get("style", 0.30),
                        "use_speaker_boost": voice_settings.get("use_speaker_boost", True)
                    }
                }
                
                # Add advanced settings for conversational AI models
                if "v3_preview" in self.model_id:
                    # Conversational AI model supports multi-speaker dialogue
                    payload["voice_settings"]["optimize_streaming_latency"] = 0
                    payload["voice_settings"]["output_format"] = "mp3_44100_128"
                    # Enable multi-speaker understanding
                    payload["enable_dialogue_parsing"] = True
                elif "turbo_v2" in self.model_id:
                    payload["voice_settings"]["optimize_streaming_latency"] = 0
                    payload["voice_settings"]["output_format"] = "mp3_44100_128"
                
                headers = {
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": self.api_key
                }
                
                # Make API request
                async with httpx.AsyncClient(timeout=300.0) as client:
                    response = await client.post(
                        f"{self.base_url}/text-to-speech/{voice_id}",
                        json=payload,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        return response.content
                    else:
                        error_msg = f"ElevenLabs API error: {response.status_code} - {response.text}"
                        logger.error("ElevenLabs API request failed", 
                                   status_code=response.status_code,
                                   response_text=response.text)
                        raise Exception(error_msg)
                
            except Exception as e:
                if "rate_limit" in str(e).lower() and attempt < max_retries - 1:
                    wait_time = (2 ** attempt) * 2  # Longer wait for ElevenLabs
                    logger.warning(
                        "ElevenLabs rate limit hit, retrying",
                        attempt=attempt + 1,
                        wait_time=wait_time
                    )
                    await asyncio.sleep(wait_time)
                    continue
                
                logger.error(
                    "ElevenLabs audio generation failed",
                    error=str(e),
                    attempt=attempt + 1
                )
                
                if attempt == max_retries - 1:
                    raise
                
                await asyncio.sleep(1)
    
    def _optimize_script_for_tts(self, script: str) -> str:
        """
        Optimize script for better TTS output with multi-speaker dialogue support.
        
        This function processes the script to:
        - Handle multi-speaker dialogue (Host1:, Host2:, etc.)
        - Add appropriate pauses and breathing
        - Handle abbreviations and pronunciation
        - Improve natural speech patterns for conversational AI
        """
        # Replace common abbreviations for better pronunciation
        replacements = {
            "Dr.": "Doctor",
            "Mr.": "Mister", 
            "Mrs.": "Misses",
            "Ms.": "Miss",
            "Prof.": "Professor",
            "vs.": "versus",
            "etc.": "etcetera",
            "i.e.": "that is",
            "e.g.": "for example",
            "&": "and",
            "CEO": "C E O",
            "AI": "A I",
            "API": "A P I",
            "URL": "U R L",
            "FAQ": "F A Q",
            "NYC": "New York City",
            "USA": "United States",
            "UK": "United Kingdom",
        }
        
        optimized = script
        for abbrev, full in replacements.items():
            optimized = optimized.replace(abbrev, full)
        
        # Handle multi-speaker dialogue format for conversational AI
        if "v3_preview" in self.model_id:
            # Ensure proper speaker format for multi-speaker model
            optimized = optimized.replace("Narrator:", "Host1:")
            optimized = optimized.replace("Host:", "Host1:")
            
            # Add natural dialogue transitions
            optimized = optimized.replace("Host1:", "\n\nHost1:")
            optimized = optimized.replace("Host2:", "\n\nHost2:")
            optimized = optimized.replace("Guest:", "\n\nGuest:")
            
            # Add natural pauses between speakers
            optimized = optimized.replace("\n\nHost1:", " ... Host1:")
            optimized = optimized.replace("\n\nHost2:", " ... Host2:")
            optimized = optimized.replace("\n\nGuest:", " ... Guest:")
        
        # Add natural conversational pauses and breathing
        optimized = optimized.replace(".", "... ")  # Longer pause for sentences
        optimized = optimized.replace("!", "! ")
        optimized = optimized.replace("?", "? ")
        optimized = optimized.replace(";", ", ")    # Softer pause for semicolons
        optimized = optimized.replace(":", ": ")
        optimized = optimized.replace(",", ", ")    # Ensure comma pauses
        
        # Add breathing spaces for natural flow
        optimized = optimized.replace("However,", "However... ")
        optimized = optimized.replace("Moreover,", "Moreover... ")
        optimized = optimized.replace("Furthermore,", "Furthermore... ")
        optimized = optimized.replace("In addition,", "In addition... ")
        optimized = optimized.replace("On the other hand,", "On the other hand... ")
        
        # Handle segment transitions with longer pauses
        optimized = optimized.replace("[Segment", "... [Segment")
        optimized = optimized.replace("]", "] ... ")
        optimized = optimized.replace("[Opening Music]", "")
        optimized = optimized.replace("[Closing Music]", "")
        
        # Add natural paragraph breaks with breathing room
        optimized = optimized.replace("\n\n", " ... ... ")
        optimized = optimized.replace("\n", " ... ")
        
        # Improve number pronunciation
        optimized = optimized.replace(" 2024", " twenty twenty four")
        optimized = optimized.replace(" 2025", " twenty twenty five")
        optimized = optimized.replace(" 25%", " twenty five percent")
        optimized = optimized.replace("%", " percent")
        
        # Clean up excessive spaces while preserving intentional pauses
        while "......." in optimized:
            optimized = optimized.replace(".......", "...")
        while "   " in optimized:
            optimized = optimized.replace("   ", " ")
        
        return optimized.strip()
    
    async def _save_audio_file(self, audio_data: bytes) -> Tuple[str, str]:
        """Save audio data to file and return file path and URL."""
        timestamp = int(time.time())
        filename = f"podcast_{timestamp}.mp3"
        file_path = os.path.join(self.audio_dir, filename)
        
        # Save file synchronously for now
        with open(file_path, "wb") as f:
            f.write(audio_data)
        
        # Generate public URL (this would be your CDN or static file URL)
        file_url = f"/audio/{filename}"
        
        return file_path, file_url
    
    def _estimate_audio_duration(self, text: str) -> float:
        """Estimate audio duration based on text length and speech rate."""
        # Average speaking rate: 150-160 words per minute for podcasts
        words = len(text.split())
        words_per_minute = 155
        duration_minutes = words / words_per_minute
        return duration_minutes * 60  # Convert to seconds
    
    def _calculate_cost(self, characters_used: int) -> float:
        """Calculate estimated cost based on characters used."""
        # ElevenLabs pricing (as of 2024)
        cost_per_1k_chars = 0.30  # $0.30 per 1K characters for standard voices
        
        estimated_cost = (characters_used / 1000) * cost_per_1k_chars
        return round(estimated_cost, 4)
    
    async def get_available_voices(self) -> Dict[str, Any]:
        """Get list of available voices from ElevenLabs."""
        try:
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/voices",
                    headers=headers
                )
                
                if response.status_code == 200:
                    voices_data = response.json()
                    return {
                        voice["voice_id"]: {
                            "name": voice["name"],
                            "description": voice.get("description", ""),
                            "category": voice.get("category", "general"),
                            "labels": voice.get("labels", {}),
                        }
                        for voice in voices_data.get("voices", [])
                    }
                else:
                    logger.error("Failed to fetch voices", status_code=response.status_code)
                    return {}
        except Exception as e:
            logger.error("Failed to fetch ElevenLabs voices", error=str(e))
            return {}
    
    async def health_check(self) -> bool:
        """Check if ElevenLabs service is healthy."""
        try:
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/voices",
                    headers=headers
                )
                return response.status_code == 200
        except Exception as e:
            logger.error("ElevenLabs health check failed", error=str(e))
            return False
    
    async def get_voice_settings_for_type(self, podcast_type: str) -> dict:
        """Get optimized voice settings for specific podcast type."""
        return ElevenLabsConfig.get_voice_settings(podcast_type)
    
    async def clone_voice(self, name: str, audio_files: list) -> str:
        """Clone a voice using provided audio samples (premium feature)."""
        try:
            # This would implement voice cloning functionality
            # For now, returning placeholder
            logger.info("Voice cloning requested", name=name, files_count=len(audio_files))
            return "cloned_voice_id_placeholder"
        except Exception as e:
            logger.error("Voice cloning failed", error=str(e))
            raise


# Create singleton instance
elevenlabs_service = ElevenLabsService()
