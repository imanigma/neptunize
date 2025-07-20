# Neptunize - AI Podcast Generator

A full-stack application for AI-powered podcast generation using OpenAI and ElevenLabs APIs.

## Architecture

- **Frontend**: React + Vite + TypeScript PWA with dark theme
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **AI Services**: OpenAI for script enhancement, ElevenLabs for TTS

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/imanigma/neptunize.git
cd neptunize

# Start both services
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Development Setup

#### Backend Development
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python run.py
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env in backend folder)
```
OPENAI_API_KEY=your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key
DATABASE_URL=sqlite:///./neptunize.db
SECRET_KEY=your_secret_key
```

### Frontend (.env in frontend folder)
```
VITE_API_URL=http://localhost:8000
```

## Deployment

### Railway
Each service has its own `railway.toml` configuration for separate deployments.

### Docker
Each service has its own optimized Dockerfile for production deployment.

## Features

- 🎙️ AI-powered podcast script generation
- 🔊 High-quality text-to-speech conversion
- 📱 PWA with offline capabilities
- 🌙 Dark theme UI
- 📊 Usage tracking and analytics
- 🔐 JWT authentication
- 🎨 Mobile-responsive design

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite + PWA plugin
- Tailwind CSS + shadcn/ui
- React Router + Lucide Icons

### Backend
- FastAPI + Uvicorn
- SQLAlchemy + Alembic
- OpenAI GPT models
- ElevenLabs TTS API
- JWT authentication
