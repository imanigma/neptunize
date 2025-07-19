# Frontend Dockerfile for Vite React App
FROM node:20.12.2-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN apk update && apk upgrade && \
    npm ci && \
    adduser -D appuser && \
    chown -R appuser /app
USER appuser

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:1.27.2-alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Security configurations
RUN echo 'server_tokens off;' > /etc/nginx/conf.d/security.conf && \
    echo 'add_header X-Frame-Options DENY always; \
    add_header X-Content-Type-Options nosniff always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header Referrer-Policy "strict-origin-when-cross-origin" always; \
    add_header Content-Security-Policy "default-src '\''self'\''; connect-src '\''self'\'' http://backend:8000 http://localhost:8000; script-src '\''self'\'' '\''unsafe-inline'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data:;" always;' \
    >> /etc/nginx/conf.d/security.conf && \
    adduser -D appuser && \
    chown -R appuser /var/cache/nginx && \
    chown -R appuser /var/log/nginx && \
    chown -R appuser /etc/nginx

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]