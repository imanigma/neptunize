# Backend - Neptunize API

FastAPI-based backend for AI-powered podcast generation using OpenAI and ElevenLabs APIs.

## Features

- 🔌 RESTful API with automatic documentation
- 🤖 OpenAI integration for script enhancement
- 🔊 ElevenLabs integration for text-to-speech
- 🗄️ SQLAlchemy ORM with database migrations
- 🔐 JWT authentication
- 📊 Usage tracking and analytics
- 🏥 Health checks and monitoring
- 📝 Structured logging

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the Application**
   ```bash
   python run.py
   ```

### Using Docker

```bash
# Build and run
docker build -t neptunize-backend .
docker run -p 8000:8000 --env-file .env neptunize-backend
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Optional
DATABASE_URL=sqlite:///./neptunize.db
SECRET_KEY=your_secret_key
DEBUG=false
LOG_LEVEL=info
FRONTEND_URL=http://localhost:3000
```

### Database

The application uses SQLAlchemy with Alembic for migrations:

```bash
# Run migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database connection
│   ├── auth/                # Authentication modules
│   ├── routers/             # API route handlers
│   └── services/            # Business logic
├── alembic/                 # Database migrations
├── generated_audio/         # Audio file storage
├── logs/                    # Application logs
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
├── railway.toml            # Railway deployment config
└── run.py                  # Application entry point
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### Podcast Generation
- `POST /podcasts/generate` - Generate podcast
- `GET /podcasts/` - List user podcasts
- `GET /podcasts/{id}` - Get specific podcast
- `DELETE /podcasts/{id}` - Delete podcast

### Utilities
- `GET /health` - Health check
- `GET /` - Root endpoint

## Deployment

### Railway

The backend is configured for Railway deployment with automatic builds from the `deployment` branch.

### Environment Setup

Make sure to set these environment variables in your deployment platform:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `SECRET_KEY`
- `DATABASE_URL` (if using external database)

## Development

### Adding New Features

1. Create models in `app/models.py`
2. Create schemas in `app/schemas.py`  
3. Add routes in `app/routers/`
4. Implement business logic in `app/services/`
5. Create database migrations with Alembic

### Testing

```bash
# Run tests
python -m pytest

# Run specific test
python test_backend.py
```
