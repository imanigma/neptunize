# Neptunize - AI Podcast Generation Platform

A full-stack AI-powered podcast generation platform with FastAPI backend and React frontend.

## 🏗️ Project Structure

```
neptunize/
├── backend/              # FastAPI backend application
│   ├── app/             # Main application code
│   ├── alembic/         # Database migrations
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile       # Backend container
├── frontend/            # React + Vite frontend
│   ├── src/            # React components and pages
│   ├── public/         # Static assets
│   └── package.json    # Node.js dependencies
├── docs/               # Documentation
├── generated_audio/    # Generated podcast files
├── logs/              # Application logs
└── docker-compose.yml # Multi-service orchestration
```

## 🚀 Quick Start

### Using Docker (Recommended)
```bash
# Clone the repository
git clone https://github.com/imanigma/neptunize.git
cd neptunize

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Development Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📱 Features

- **AI-Powered Script Generation**: Using OpenAI GPT models
- **Text-to-Speech**: ElevenLabs integration for audio generation
- **Interactive Chat Interface**: User-friendly podcast creation flow
- **Multiple Formats**: Support for different podcast styles
- **Mobile-First Design**: Responsive web application
- **Real-time Audio Processing**: Fast podcast generation

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Keys
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Database
DATABASE_URL=sqlite:///./neptunize.db

# Security
SECRET_KEY=your_secret_key_here
```

## 📚 Documentation

- [API Documentation](./docs/API_DOCS.md)
- Backend API: http://localhost:8000/docs (when running)

## 🤝 Development Workflow

### For Backend Developers
```bash
git checkout -b backend/feature-name
# Make changes to backend/ directory only
git commit -m "backend: add new feature"
git push origin backend/feature-name
```

### For Frontend Developers
```bash
git checkout -b frontend/feature-name
# Make changes to frontend/ directory only
git commit -m "frontend: add new component"
git push origin frontend/feature-name
```

## 🏷️ Architecture

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI Services**: OpenAI GPT-4 + ElevenLabs TTS
- **Deployment**: Docker + Docker Compose

## 📋 Backend Features

- **AI-Enhanced Scripts**: Uses OpenAI's GPT models to transform basic topics into engaging podcast narratives
- **Professional Audio**: Leverages ElevenLabs TTS for natural-sounding podcast audio
- **Modular Architecture**: Easily configurable prompts and settings for different podcast types
- **Scalable Design**: Built with FastAPI for high concurrent user support
- **Comprehensive Monitoring**: Built-in logging, health checks, and usage analytics
- **Secure Authentication**: JWT-based user authentication and authorization
- **Database Integration**: PostgreSQL with SQLAlchemy ORM for data persistence
   ```bash
   python run.py
   ```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Architecture Overview

### Core Components

1. **FastAPI Application** (`app/main.py`)
   - REST API endpoints
   - Authentication middleware
   - Request/response handling

2. **Services Layer** (`app/services/`)
   - `openai_service.py`: Script enhancement using GPT models
   - `elevenlabs_service.py`: Text-to-speech audio generation
   - `podcast_service.py`: Main orchestration service

3. **Database Models** (`app/models.py`)
   - User management
   - Podcast requests tracking
   - Usage metrics and monitoring

4. **Configuration** (`app/config.py`)
   - Environment-based settings
   - Modular system prompts
   - Service configurations

### Processing Pipeline

1. **User Input**: Topic/storyline submission
2. **Script Enhancement**: OpenAI processes and enhances the content
3. **Audio Generation**: ElevenLabs converts enhanced script to audio
4. **Storage & Delivery**: Audio files stored and made available via API

## Configuration

### Environment Variables

Key configuration options in `.env`:

```bash
# API Keys
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/neptunize_db

# OpenAI Settings
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4096
OPENAI_TEMPERATURE=0.7

# ElevenLabs Settings
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_MODEL_ID=eleven_multilingual_v2
```

### System Prompts

Customize podcast generation by editing prompts in `app/config.py`:

- `BASE_PODCAST_ENHANCER`: General podcast enhancement
- `CRIME_PODCAST_ENHANCER`: Crime/mystery podcast optimization
- `EDUCATIONAL_PODCAST_ENHANCER`: Educational content focus
- `BUSINESS_PODCAST_ENHANCER`: Business/entrepreneurship content

## API Usage Examples

### Authentication

```bash
# Register user
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword"
  }'

# Login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepassword"
  }'
```

### Create Podcast

```bash
# Create podcast request
curl -X POST "http://localhost:8000/podcasts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "original_topic": "The mysterious disappearance of Amelia Earhart",
    "podcast_type": "crime",
    "target_duration": 15,
    "target_audience": "true crime enthusiasts"
  }'
```

### Check Status

```bash
# Get processing status
curl -X GET "http://localhost:8000/podcasts/123/status" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Scaling Considerations

### Production Deployment

1. **Container Deployment**:
   ```bash
   # Build Docker image
   docker build -t neptunize-backend .
   
   # Run with docker-compose
   docker-compose up -d
   ```

2. **Load Balancing**: Use nginx or similar for multiple app instances

3. **Database**: Configure connection pooling and read replicas

4. **Caching**: Implement Redis for rate limiting and response caching

5. **File Storage**: Use cloud storage (S3, GCS) for audio files

### Performance Optimization

- **Async Processing**: All AI API calls are asynchronous
- **Connection Pooling**: Database connections optimized
- **Retry Logic**: Robust error handling with exponential backoff
- **Resource Management**: Configurable timeouts and limits

## Monitoring and Logging

### Health Checks

```bash
curl http://localhost:8000/health
```

### Metrics

- Processing times for each stage
- Token/character usage tracking
- Cost estimation and monitoring
- Error rates and patterns

### Logging

Structured JSON logging with request correlation:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "logger": "app.services.openai_service",
  "message": "OpenAI request completed",
  "request_id": 123,
  "processing_time": 2.5,
  "tokens_used": 1024
}
```

## Security

- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Pydantic schemas for all inputs
- **Rate Limiting**: Per-user API rate limits
- **CORS**: Configurable cross-origin policies
- **Environment Isolation**: Separate configs for dev/staging/prod

## Development

### Project Structure

```
backend_neptunize/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration and prompts
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database connection
│   ├── auth.py              # Authentication utilities
│   └── services/            # Business logic services
│       ├── __init__.py
│       ├── openai_service.py
│       ├── elevenlabs_service.py
│       └── podcast_service.py
├── alembic/                 # Database migrations
├── generated_audio/         # Audio file storage
├── requirements.txt         # Python dependencies
├── .env.example            # Environment template
├── run.py                  # Application startup
└── README.md              # This file
```

### Adding New Features

1. **New Podcast Types**: Add prompts in `config.py`
2. **Custom Processing**: Extend service classes
3. **New Endpoints**: Add routes in `main.py`
4. **Database Changes**: Create Alembic migrations

### Testing

```bash
# Run tests
pytest tests/

# With coverage
pytest --cov=app tests/
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review logs for error details
3. Ensure all environment variables are configured
4. Verify API keys have sufficient quotas
