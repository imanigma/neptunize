# Frontend Dockerfile for React PWA
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create health check file
RUN echo '{"status":"healthy","service":"neptunize-frontend","timestamp":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > dist/health.json

# Production stage with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx configuration
RUN rm -f /etc/nginx/conf.d/default.conf.bak

# Expose port 80
EXPOSE 80

# Health check - check for health.json endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health.json || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]