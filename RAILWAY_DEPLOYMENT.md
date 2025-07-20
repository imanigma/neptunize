# Frontend Railway Deployment Guide

This guide will help you deploy the Neptunize frontend on Railway.

## Prerequisites

1. Railway account
2. Backend service already deployed on Railway
3. GitHub repository access

## Deployment Steps

### 1. Create Frontend Service

1. Go to [Railway](https://railway.app)
2. Create a new project or use existing one
3. Click "Add Service" → "GitHub Repo"
4. Select your `neptunize` repository
5. **Important**: Set the branch to `frontend`

### 2. Configure Environment Variables

In Railway dashboard, add these environment variables:

```bash
VITE_API_URL=https://your-backend-service.railway.app
VITE_APP_NAME=Neptunize
VITE_ENABLE_PWA=true
```

**Note**: Replace `your-backend-service.railway.app` with your actual backend Railway URL.

### 3. Configure Backend CORS

Make sure your backend (on the `backend` branch) allows requests from your frontend domain:

```python
# In backend app/main.py, update CORS origins
origins = [
    "https://your-frontend-service.railway.app",
    "http://localhost:5173",  # for local development
]
```

### 4. Deploy

Railway will automatically:
- Detect the Node.js project
- Install dependencies with `npm ci`
- Build the app with `npm run build`
- Serve with the configured serve command
- Monitor health at `/health.json`

## Verification

1. Visit your frontend URL
2. Check that it loads properly
3. Test API connectivity (login, etc.)
4. Verify PWA functionality

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Railway dashboard

### API Connection Issues
- Verify `VITE_API_URL` is correct
- Check backend CORS configuration
- Ensure backend service is running

### Health Check Fails
- Verify `/health.json` endpoint exists
- Check that serve command is working
- Review Railway health check logs

## File Structure

```
frontend/
├── src/           # React application source
├── public/        # Static assets
├── dist/          # Built application (generated)
├── package.json   # Dependencies and scripts
├── railway.toml   # Railway configuration
├── .nixpacks.toml # Build optimization
├── Dockerfile     # Container configuration (backup)
└── nginx.conf     # Production server config
```

## Branch Management

- `frontend` - This optimized branch for Railway
- `backend` - Backend API service
- `deployment` - Legacy frontend branch (backup)

## Next Steps

1. Deploy frontend to Railway using this branch
2. Update backend CORS settings
3. Test full application functionality
4. Set up custom domain (optional)
5. Configure monitoring and alerts

## Support

For deployment issues:
- Check Railway documentation
- Review build and deploy logs
- Verify environment variable configuration
