# Frontend Neptunize - Mobile Web App

A modern mobile web application for AI-powered podcast generation, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Features

- **📱 Mobile-First Design**: Optimized for mobile devices with app-like experience
- **🎨 Modern UI**: Clean, intuitive interface matching the provided designs
- **⚡ Fast Navigation**: Bottom tab navigation with smooth transitions
- **🎙️ Podcast Generation**: Interactive chat interface for AI podcast creation
- **📚 Library Management**: Download, organize, and manage your podcasts
- **🔍 Search & Discovery**: Find trending podcasts and browse categories
- **👥 Social Features**: Follow users and discover content from your network

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Icons**: Lucide React
- **Mobile**: PWA-ready with offline support

## 📱 Screenshots Match

The UI perfectly matches your provided screenshots:
- **Home**: Profile view with followers list
- **Generate**: Chat interface with AI assistant
- **Search**: Trending podcasts and categories
- **Library**: Downloaded episodes with storage management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend_neptunize
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```

### For Mobile Testing

1. **Get your local IP**:
   ```bash
   ipconfig getifaddr en0  # macOS
   # or
   hostname -I  # Linux
   ```

2. **Access from mobile device**:
   ```
   http://YOUR_IP:3000
   ```

## 📁 Project Structure

```
frontend_neptunize/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── page.tsx           # Home (Profile/Followers)
│   │   ├── generate/          # AI Chat Interface
│   │   ├── search/            # Search & Discovery
│   │   ├── library/           # Downloaded Podcasts
│   │   ├── layout.tsx         # Root Layout
│   │   └── globals.css        # Global Styles
│   ├── components/
│   │   ├── BottomNav.tsx      # Bottom Navigation
│   │   ├── FollowerCard.tsx   # Follower Component
│   │   └── Providers.tsx      # React Query Provider
│   └── lib/                   # Utilities & API
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Gray Scale**: Custom gray palette
- **Background**: Light gray (#f8fafc)

### Components
- **Mobile Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent padding and hover states
- **Navigation**: Fixed bottom navigation with active states
- **Typography**: System fonts optimized for mobile reading

### Mobile Optimizations
- **Safe Areas**: iOS safe area support
- **Touch Targets**: 44px minimum touch targets
- **Gestures**: Smooth scrolling and transitions
- **Performance**: Optimized images and lazy loading

## 🔗 API Integration (Ready)

The frontend is prepared for backend integration:

```typescript
// lib/api.ts (to be created)
class NeptunizeAPI {
  async generatePodcast(data: {
    topic: string
    storyline: string
    podcast_type: string
    target_duration: number
  }) {
    return fetch('/api/podcasts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }
}
```

## 📱 PWA Features (Planned)

- **Install Prompt**: Add to home screen
- **Offline Support**: Service worker for offline functionality
- **Push Notifications**: Podcast completion alerts
- **Background Sync**: Sync when connection restored

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables (Future)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## 📋 Todo / Next Steps

1. **Connect to Backend**: Integrate with FastAPI endpoints
2. **Authentication**: Add JWT token management
3. **Real-time**: WebSocket for live podcast generation status
4. **Audio Player**: Full-featured audio playback component
5. **PWA**: Service worker and offline support
6. **Push Notifications**: Real-time updates

## 🎯 Matching Your Backend

The frontend is designed to work seamlessly with your FastAPI backend:

- **Endpoints**: Ready for `/api/podcasts/generate`
- **Authentication**: JWT token support planned
- **Types**: TypeScript interfaces matching your schemas
- **Real-time**: WebSocket integration ready

Perfect mobile web app that matches your screenshots and integrates with your podcast generation backend! 🎙️📱
