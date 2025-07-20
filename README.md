# Neptunize Frontend

Modern React application for AI-powered podcast generation platform.

## Branch Structure

- `backend` - Backend API service
- `frontend` - Frontend React application (this branch)
- `deployment` - Legacy frontend branch (backup)

## Features

- 🎨 Modern React interface with TypeScript
- 📱 Progressive Web App (PWA) with offline support
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui components
- 📱 Fully responsive mobile design
- 🌙 Dark theme support
- 🔐 JWT authentication integration
- ⚡ Fast build and development with Vite
- 🔗 Backend API integration

## Railway Deployment

This branch is optimized for Railway deployment:

### Automatic Deployment
- Railway auto-detects and builds the React app
- Uses Nixpacks for optimal build performance
- Serves static files with high performance
- Health check endpoint at `/health.json`

### Configuration Files
- `railway.toml` - Railway deployment settings
- `.nixpacks.toml` - Build optimization
- `Dockerfile` - Containerization (backup option)
- `nginx.conf` - Production serving configuration

## Backend Integration

The frontend connects to the backend API service:
- Authentication flows
- Podcast generation requests
- Real-time status updates
- User management

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Visit: `http://localhost:5173`

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

Configure backend API endpoint:
```bash
# .env.local (for local development)
VITE_API_URL=http://localhost:8000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Serve production build
- `npm run preview` - Preview production build

## PWA Features

- 📱 Installable on mobile devices
- ⚡ Service worker for offline support
- 🔄 Background sync capability
- 📊 Web app manifest
- 🔔 Push notifications ready

## Deployment Notes

### Railway Deployment
1. Connect this `frontend` branch to Railway
2. Railway will automatically:
   - Detect Node.js project
   - Install dependencies
   - Build the application
   - Serve static files
   - Monitor health endpoint

### Backend Connection
- Ensure backend service is running on Railway
- Update API endpoints in frontend configuration
- Configure CORS settings in backend for frontend domain

## Health Check

The application provides `/health.json` endpoint for Railway monitoring.