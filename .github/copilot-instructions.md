<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Neptunize Podcast Generation Backend

This is a FastAPI-based backend for AI-powered podcast generation using OpenAI and ElevenLabs APIs.

## Architecture Overview

- **FastAPI**: Modern async web framework for high performance
- **SQLAlchemy**: ORM for database operations with PostgreSQL
- **OpenAI**: GPT models for script enhancement and storytelling
- **ElevenLabs**: Text-to-speech for audio generation
- **Structured Logging**: JSON-based logging with correlation IDs
- **Modular Design**: Separate services for different AI providers

## Key Components

1. **Services Layer** (`app/services/`):
   - `openai_service.py`: Script enhancement using GPT models
   - `elevenlabs_service.py`: TTS audio generation
   - `podcast_service.py`: Main orchestration service

2. **Configuration** (`app/config.py`):
   - Environment-based settings
   - Modular system prompts for different podcast types
   - Voice settings optimization per content type

3. **Database Models** (`app/models.py`):
   - User management and authentication
   - Podcast request tracking with detailed metadata
   - Usage metrics and cost tracking

## Development Guidelines

### Code Style
- Follow async/await patterns for all I/O operations
- Use type hints throughout the codebase
- Implement proper error handling with structured logging
- Include retry logic for external API calls

### Configuration Management
- All settings should be environment-based
- System prompts are modular and easily editable
- Service configurations support different podcast types

### Database Operations
- Use SQLAlchemy ORM with proper session management
- Include database migrations with Alembic
- Track usage metrics for monitoring and billing

### API Design
- RESTful endpoints with proper HTTP status codes
- Pydantic schemas for request/response validation
- JWT authentication for secure access
- Comprehensive API documentation with examples

### Testing Considerations
- Mock external API calls (OpenAI, ElevenLabs)
- Test async operations properly
- Include integration tests for the full pipeline
- Validate cost calculations and usage tracking

## Podcast Generation Pipeline

1. **Input Processing**: Validate and sanitize user input
2. **Script Enhancement**: Use OpenAI to improve storyline
3. **Audio Generation**: Convert enhanced script to speech
4. **Storage & Delivery**: Save files and provide access URLs
5. **Metrics Tracking**: Record usage, costs, and performance

## Environment Variables

Key configuration in `.env`:
- `OPENAI_API_KEY`: OpenAI API access
- `ELEVENLABS_API_KEY`: ElevenLabs API access
- `DATABASE_URL`: PostgreSQL connection
- `SECRET_KEY`: Authentication secret

## Production Considerations

- Use proper JWT libraries in production
- Implement Redis for caching and rate limiting
- Configure file storage with cloud providers
- Set up monitoring and alerting
- Implement proper backup strategies
