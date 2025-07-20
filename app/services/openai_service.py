"""
OpenAI service for script enhancement and content generation.
Handles communication with OpenAI's API with retry logic and optimization.
"""
import asyncio
import time
from typing import Dict, Any, Optional, Tuple
import structlog

import openai
from openai import AsyncOpenAI

from app.config import get_settings, SystemPrompts
from app.schemas import ScriptEnhancementRequest, ScriptEnhancementResponse

logger = structlog.get_logger(__name__)
settings = get_settings()


class OpenAIService:
    """Service for handling OpenAI API interactions."""
    
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.max_tokens = settings.openai_max_tokens
        self.temperature = settings.openai_temperature
        
    async def enhance_podcast_script(
        self, 
        request: ScriptEnhancementRequest
    ) -> ScriptEnhancementResponse:
        """
        Enhance a basic topic/storyline into a comprehensive podcast script.
        
        Args:
            request: Script enhancement request with topic and parameters
            
        Returns:
            Enhanced script with metadata
        """
        start_time = time.time()
        
        try:
            # Get appropriate system prompt based on podcast type
            system_prompt = SystemPrompts.get_prompt_by_type(request.podcast_type.value)
            
            # Format the prompt with user data
            formatted_prompt = system_prompt.format(
                user_input=request.topic,
                podcast_type=request.podcast_type.value,
                target_duration=request.target_duration,
                target_audience=request.target_audience,
                focus_area=request.focus_area or request.target_audience,  # Use focus_area if provided, otherwise target_audience
                audience_level="intermediate"  # Default audience level for educational
            )
            
            # Add additional context if provided
            if request.additional_context:
                formatted_prompt += f"\n\nAdditional context: {request.additional_context}"
            
            logger.info(
                "Sending request to OpenAI",
                model=self.model,
                podcast_type=request.podcast_type.value,
                target_duration=request.target_duration
            )
            
            # Make API call with retry logic
            response = await self._make_api_call_with_retry(
                messages=[
                    {"role": "system", "content": formatted_prompt},
                    {"role": "user", "content": f"Create an enhanced podcast narrative for: {request.topic}"}
                ],
                max_tokens=self._calculate_max_tokens(request.target_duration),
                temperature=self._get_temperature_for_type(request.podcast_type.value)
            )
            
            processing_time = time.time() - start_time
            
            enhanced_script = response.choices[0].message.content.strip()
            tokens_used = response.usage.total_tokens
            
            logger.info(
                "OpenAI request completed",
                processing_time=processing_time,
                tokens_used=tokens_used,
                script_length=len(enhanced_script)
            )
            
            return ScriptEnhancementResponse(
                enhanced_script=enhanced_script,
                processing_time=processing_time,
                tokens_used=tokens_used,
                ai_model_used=self.model,
                cost_estimate=self._calculate_cost(tokens_used)
            )
            
        except Exception as e:
            logger.error(
                "OpenAI script enhancement failed",
                error=str(e),
                processing_time=time.time() - start_time
            )
            raise
    
    async def _make_api_call_with_retry(
        self, 
        messages: list, 
        max_tokens: int, 
        temperature: float,
        max_retries: int = 3
    ) -> Any:
        """Make OpenAI API call with exponential backoff retry logic."""
        
        for attempt in range(max_retries):
            try:
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=1.0,
                    frequency_penalty=0.0,
                    presence_penalty=0.0
                )
                return response
                
            except openai.RateLimitError as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = (2 ** attempt) + 1
                logger.warning(
                    "OpenAI rate limit hit, retrying",
                    attempt=attempt + 1,
                    wait_time=wait_time
                )
                await asyncio.sleep(wait_time)
                
            except openai.APIConnectionError as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = (2 ** attempt) + 1
                logger.warning(
                    "OpenAI connection error, retrying",
                    attempt=attempt + 1,
                    wait_time=wait_time
                )
                await asyncio.sleep(wait_time)
                
            except Exception as e:
                logger.error("OpenAI API call failed", error=str(e), attempt=attempt + 1)
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(1)
    
    def _calculate_max_tokens(self, target_duration: int) -> int:
        """Calculate appropriate max tokens based on target duration."""
        # Rough estimation: 150-200 words per minute of audio
        # 1 token ≈ 0.75 words for English
        base_tokens = target_duration * 200 * 1.33  # Convert words to tokens
        
        # Add buffer for detailed storytelling
        buffer_tokens = base_tokens * 0.3
        
        # Ensure within model limits
        calculated_tokens = int(base_tokens + buffer_tokens)
        return min(calculated_tokens, self.max_tokens)
    
    def _get_temperature_for_type(self, podcast_type: str) -> float:
        """Get optimal temperature setting based on podcast type."""
        temperature_map = {
            "crime": 0.6,       # More focused and factual
            "educational": 0.5,  # Balanced creativity and accuracy
            "business": 0.4,     # Professional and structured
            "general": 0.7       # Creative and engaging
        }
        return temperature_map.get(podcast_type, self.temperature)
    
    def _calculate_cost(self, tokens_used: int) -> float:
        """Calculate estimated cost based on tokens used."""
        # GPT-4 Turbo pricing (as of 2024)
        input_cost_per_1k = 0.01   # $0.01 per 1K input tokens
        output_cost_per_1k = 0.03  # $0.03 per 1K output tokens
        
        # Rough estimation (assuming 70% output, 30% input)
        estimated_cost = (
            (tokens_used * 0.3 * input_cost_per_1k / 1000) +
            (tokens_used * 0.7 * output_cost_per_1k / 1000)
        )
        return round(estimated_cost, 4)
    
    async def health_check(self) -> bool:
        """Check if OpenAI service is healthy."""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5
            )
            return True
        except Exception as e:
            logger.error("OpenAI health check failed", error=str(e))
            return False
    
    async def get_available_models(self) -> list:
        """Get list of available OpenAI models."""
        try:
            models = await self.client.models.list()
            return [model.id for model in models.data if "gpt" in model.id]
        except Exception as e:
            logger.error("Failed to fetch OpenAI models", error=str(e))
            return []


# Create singleton instance
openai_service = OpenAIService()
