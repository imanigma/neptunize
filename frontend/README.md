# Frontend - Neptunize PWA

React-based Progressive Web App for AI-powered podcast generation with modern UI and offline capabilities.

## Features

- 📱 **Progressive Web App** - Installable, offline-capable
- 🌙 **Dark Theme** - Beautiful dark gradient design
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Performance** - Vite build system with optimizations
- 🎨 **Modern UI** - shadcn/ui components with Tailwind CSS
- 🔄 **Real-time Updates** - Service worker for background updates
- 🎵 **Audio Player** - Built-in podcast player with controls

## Quick Start

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Using Docker

```bash
# Build and run
docker build -t neptunize-frontend .
docker run -p 3000:80 neptunize-frontend
```

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm start           # Serve static files (for Railway)
```

## Configuration

### Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Neptunize
VITE_APP_DESCRIPTION=AI-powered podcast generation
```

### PWA Configuration

The app is configured as a PWA with:
- **Service Worker** - Automatic caching and offline support
- **Web Manifest** - App metadata and icons
- **Install Prompts** - Native app-like installation
- **Background Sync** - Offline queue management

## Project Structure

```
frontend/
├── public/
│   ├── icons/              # PWA icons (72x72 to 512x512)
│   ├── manifest.webmanifest # PWA manifest
│   └── favicon.ico         # Browser favicon
├── src/
│   ├── components/
│   │   └── ui/             # shadcn/ui components
│   ├── screens/            # Page components
│   │   ├── Home/           # Home page
│   │   ├── Library/        # Podcast library
│   │   ├── Search/         # Search interface
│   │   └── Frame/          # Layout wrapper
│   ├── services/           # API and external services
│   ├── lib/                # Utilities and helpers
│   └── styles/             # Global styles
├── Dockerfile              # Container configuration
├── railway.toml           # Railway deployment config
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies and scripts
```

## UI Components

The app uses shadcn/ui components with custom styling:

- **Button** - Primary, secondary, ghost variants
- **Card** - Content containers with shadows
- **Input** - Form inputs with validation
- **Avatar** - User profile images
- **Separator** - Visual dividers

## Deployment

### Railway

Configured for Railway deployment with optimized Nixpacks build:

```toml
[build]
builder = "nixpacks"

[deploy]
healthcheckPath = "/"
restartPolicyType = "on_failure"
```

### Docker

Multi-stage Docker build with nginx for production:

1. **Build Stage** - Node.js environment for building
2. **Production Stage** - Nginx for serving static files

## Development

### Adding New Screens

1. Create component in `src/screens/NewScreen/`
2. Add route in main App component
3. Update navigation if needed

### Styling

- Use Tailwind CSS utility classes
- Follow the dark theme color scheme
- Ensure mobile responsiveness

### API Integration

- API calls are centralized in `src/services/api.ts`
- Environment-based API URL configuration
- Error handling and loading states

## PWA Features

### Installation

Users can install the app on:
- **Desktop** - Chrome, Edge, Safari
- **Mobile** - iOS Safari, Android Chrome
- **Windows** - As desktop app

### Offline Support

- **Cached Assets** - CSS, JS, images cached automatically
- **API Caching** - Network-first strategy for API calls
- **Offline Fallbacks** - Graceful degradation when offline

### Updates

- **Automatic Updates** - Service worker updates in background
- **Prompt Users** - Option to show update notifications
- **Version Control** - Proper cache invalidation
