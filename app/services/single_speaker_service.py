"""
Single Speaker Narrative Service for clean TTS-optimized text generation.
Generates narrative text without any formatting, stage directions, or special markers.
"""
import asyncio
from typing import Optional
import structlog

from app.config import get_settings
from app.services.openai_service import OpenAIService

logger = structlog.get_logger(__name__)


class SingleSpeakerService:
    """Service for generating clean single-speaker narratives optimized for TTS."""
    
    def __init__(self):
        self.settings = get_settings()
        self.openai_service = OpenAIService()
    
    async def generate_clean_narrative(
        self, 
        topic: str, 
        storyline: str, 
        podcast_type: str = "general", 
        target_duration: int = 5,
        target_audience: str = "general",
        focus_area: Optional[str] = None
    ) -> str:
        """
        Generate a clean narrative text optimized for single-speaker TTS.
        
        Args:
            topic: Main topic of the podcast
            storyline: User's storyline description
            podcast_type: Type of podcast (crime, business, educational, general)
            target_duration: Target duration in minutes
            target_audience: Target audience description
            focus_area: Specific focus area (for business podcasts)
            
        Returns:
            Clean narrative text without formatting, ready for TTS
        """
        
        # Get the appropriate prompt based on podcast type
        system_prompt = self._get_single_speaker_prompt(podcast_type)
        
        # Calculate approximate word count for target duration
        # Average speech rate: 150-160 words per minute
        target_word_count = target_duration * 155
        
        # Format the prompt with user data
        formatted_prompt = system_prompt.format(
            topic=topic,
            storyline=storyline,
            podcast_type=podcast_type,
            target_duration=target_duration,
            target_audience=target_audience,
            focus_area=focus_area or target_audience,
            target_word_count=target_word_count
        )
        
        logger.info(
            "Generating single-speaker narrative",
            podcast_type=podcast_type,
            target_duration=target_duration,
            target_word_count=target_word_count
        )
        
        try:
            # Make API call to OpenAI
            response = await self.openai_service._make_api_call_with_retry(
                messages=[
                    {"role": "system", "content": formatted_prompt},
                    {"role": "user", "content": f"Generate a clean single-speaker narrative about: {storyline}"}
                ],
                max_tokens=self.settings.openai_max_tokens,
                temperature=self.settings.openai_temperature
            )
            
            narrative_text = response.choices[0].message.content.strip()
            
            # Clean any remaining formatting that might have slipped through
            clean_narrative = self._clean_narrative_text(narrative_text)
            
            logger.info(
                "Single-speaker narrative generated successfully",
                text_length=len(clean_narrative),
                word_count=len(clean_narrative.split())
            )
            
            return clean_narrative
            
        except Exception as e:
            logger.error("Failed to generate single-speaker narrative", error=str(e))
            raise
    
    def _get_single_speaker_prompt(self, podcast_type: str) -> str:
        """Get the appropriate system prompt for single-speaker narratives."""
        
        base_instructions = """You are a professional storyteller creating content for text-to-speech conversion. Your task is to write a compelling narrative that will be spoken by a single voice.

CRITICAL REQUIREMENTS:
1. Write ONLY the narrative text that should be spoken
2. NO stage directions, sound effects, or formatting markers
3. NO speaker labels like "Narrator:" or character names
4. NO brackets, parentheses, or special formatting like [Sound Effect: ...]
5. Write as one continuous flowing narrative
6. Use natural speech patterns and pacing
7. Target approximately {target_word_count} words for {target_duration} minutes
8. Make it engaging and suitable for audio consumption

The output should be clean prose that flows naturally when read by text-to-speech, like someone telling a captivating story."""

        type_specific_prompts = {
            "crime": base_instructions + """

Focus on:
- Building suspense and mystery through narrative flow
- Creating vivid scene descriptions
- Developing compelling character backgrounds
- Including investigative details and revelations
- Adding unexpected twists in the story progression
- Maintaining ethical sensitivity to real events
- Using engaging storytelling voice and pacing

Topic: {topic}
Storyline: {storyline}
Target Duration: {target_duration} minutes
Target Word Count: {target_word_count} words

Create a compelling crime narrative that flows as one continuous story:""",

            "business": base_instructions + """

Focus on:
- Creating inspiring business stories and case studies
- Highlighting key business insights through examples
- Including market analysis and trends through storytelling
- Building compelling success and failure narratives
- Making complex business concepts accessible
- Creating actionable insights through story examples
- Building inspiration through real-world examples

Topic: {topic}
Storyline: {storyline}
Focus Area: {focus_area}
Target Duration: {target_duration} minutes
Target Word Count: {target_word_count} words

Create an inspiring business narrative that flows as one continuous story:""",

            "educational": base_instructions + """

Focus on:
- Breaking down complex concepts through storytelling
- Using analogies and real-world scenarios
- Creating engaging learning narratives
- Building knowledge progressively through story structure
- Including fascinating facts woven into the narrative
- Making learning enjoyable through compelling storytelling
- Using clear, accessible language

Topic: {topic}
Storyline: {storyline}
Target Audience: {target_audience}
Target Duration: {target_duration} minutes
Target Word Count: {target_word_count} words

Create an engaging educational narrative that flows as one continuous story:""",

            "general": base_instructions + """

Focus on:
- Creating engaging and entertaining content
- Using natural storytelling techniques
- Building compelling narrative structure
- Including interesting details and insights
- Making the content accessible and enjoyable
- Using conversational yet polished language

Topic: {topic}
Storyline: {storyline}
Target Audience: {target_audience}
Target Duration: {target_duration} minutes
Target Word Count: {target_word_count} words

Create an engaging narrative that flows as one continuous story:"""
        }
        
        return type_specific_prompts.get(podcast_type.lower(), type_specific_prompts["general"])
    
    def _clean_narrative_text(self, text: str) -> str:
        """Clean any remaining formatting from the narrative text."""
        import re
        
        # Remove any remaining brackets and their contents
        text = re.sub(r'\[.*?\]', '', text)
        
        # Remove speaker labels (e.g., "Narrator:", "Host:")
        text = re.sub(r'^[A-Za-z\s]+:', '', text, flags=re.MULTILINE)
        
        # Remove any remaining parentheses with stage directions
        text = re.sub(r'\([^)]*\)', '', text)
        
        # Clean up extra whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)  # Multiple newlines to double newlines
        text = re.sub(r'[ \t]+', ' ', text)  # Multiple spaces to single space
        
        # Remove leading/trailing whitespace
        text = text.strip()
        
        return text
    
    async def health_check(self) -> bool:
        """Check if the service is healthy."""
        try:
            return await self.openai_service.health_check()
        except Exception:
            return False


# Create singleton instance
single_speaker_service = SingleSpeakerService()
