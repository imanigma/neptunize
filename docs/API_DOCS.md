# API Documentation

## Overview

The Neptunize API provides AI-powered podcast generation capabilities, transforming simple topics into professional-quality audio content using OpenAI and ElevenLabs technologies.

## Base URL

```
http://localhost:8000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "secure_password"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Podcast Generation

#### Create Podcast
```http
POST /podcasts
Authorization: Bearer <token>
Content-Type: application/json

{
  "original_topic": "The mysterious disappearance of Amelia Earhart and what might have happened during her final flight",
  "podcast_type": "crime",
  "target_duration": 15,
  "target_audience": "true crime enthusiasts"
}
```

Response:
```json
{
  "id": 123,
  "user_id": 1,
  "original_topic": "The mysterious disappearance of Amelia Earhart...",
  "podcast_type": "crime",
  "target_duration": 15,
  "target_audience": "true crime enthusiasts",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Get Podcast Status
```http
GET /podcasts/123/status
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 123,
  "status": "processing_audio",
  "progress_percentage": 65,
  "current_stage": "Converting script to natural speech",
  "estimated_completion": "2024-01-15T10:32:30Z",
  "processing_time_so_far": 45.2
}
```

#### Get Podcast Details
```http
GET /podcasts/123
Authorization: Bearer <token>
```

Response:
```json
{
  "id": 123,
  "user_id": 1,
  "original_topic": "The mysterious disappearance of Amelia Earhart...",
  "enhanced_script": "In the summer of 1937, the world held its breath...",
  "audio_file_url": "/audio/podcast_1642248600.mp3",
  "status": "completed",
  "processing_time_script": 12.5,
  "processing_time_audio": 45.2,
  "total_processing_time": 57.7,
  "audio_duration": 892.5,
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:31:27Z"
}
```

#### List User Podcasts
```http
GET /podcasts?limit=10&offset=0
Authorization: Bearer <token>
```

### Configuration

#### Get Available Voices
```http
GET /voices
Authorization: Bearer <token>
```

Response:
```json
{
  "21m00Tcm4TlvDq8ikWAM": {
    "name": "Rachel",
    "description": "Calm, professional female voice",
    "category": "general"
  },
  "29vD33N1CtxCmqQRPOHJ": {
    "name": "Drew",
    "description": "Young male voice",
    "category": "general"
  }
}
```

#### Get Available Models
```http
GET /models
Authorization: Bearer <token>
```

Response:
```json
{
  "models": [
    "gpt-4-turbo-preview",
    "gpt-4",
    "gpt-3.5-turbo"
  ]
}
```

### Monitoring

#### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "openai": "healthy",
    "elevenlabs": "healthy"
  }
}
```

#### User Statistics
```http
GET /user/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "total_requests": 25,
  "completed_requests": 23,
  "failed_requests": 2,
  "average_processing_time": 58.3,
  "total_audio_minutes": 342.5,
  "total_cost": 12.45
}
```

## Podcast Types

### Crime
Optimized for true crime content with dramatic storytelling:
- Focus on mystery and suspense
- Investigative narrative style
- Character development
- Timeline reconstruction

### Educational
Designed for informative content:
- Clear explanations
- Progressive knowledge building
- Real-world examples
- Engaging analogies

### Business
Tailored for entrepreneurship and business content:
- Market insights
- Success stories
- Actionable strategies
- Professional tone

### General
Balanced approach for various topics:
- Versatile storytelling
- Engaging narrative
- Broad appeal
- Creative freedom

## Error Handling

All errors follow a consistent format:

```json
{
  "error": "Error description",
  "detail": "Additional error details",
  "error_code": "ERROR_001",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

- `400` - Bad Request: Invalid input data
- `401` - Unauthorized: Invalid or missing token
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource doesn't exist
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: System error

## Rate Limits

- **General API**: 60 requests per minute
- **Podcast Generation**: 5 requests per minute
- **Free Users**: 10 podcasts per day
- **Premium Users**: Unlimited

## Webhooks (Coming Soon)

Register webhook URLs to receive notifications:

```json
{
  "event": "podcast.completed",
  "data": {
    "podcast_id": 123,
    "status": "completed",
    "audio_url": "/audio/podcast_123.mp3"
  }
}
```

## SDKs

### Python
```python
import requests

class NeptunizeClient:
    def __init__(self, token):
        self.token = token
        self.base_url = "http://localhost:8000"
    
    def create_podcast(self, topic, podcast_type="general", duration=10):
        headers = {"Authorization": f"Bearer {self.token}"}
        data = {
            "original_topic": topic,
            "podcast_type": podcast_type,
            "target_duration": duration
        }
        response = requests.post(f"{self.base_url}/podcasts", 
                               json=data, headers=headers)
        return response.json()

# Usage
client = NeptunizeClient("your_token_here")
podcast = client.create_podcast("The history of artificial intelligence")
```

### JavaScript
```javascript
class NeptunizeClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = 'http://localhost:8000';
  }

  async createPodcast(topic, podcastType = 'general', duration = 10) {
    const response = await fetch(`${this.baseUrl}/podcasts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        original_topic: topic,
        podcast_type: podcastType,
        target_duration: duration
      })
    });
    return response.json();
  }
}

// Usage
const client = new NeptunizeClient('your_token_here');
const podcast = await client.createPodcast('The future of space exploration');
```

## Best Practices

### Input Optimization

1. **Topic Description**: Provide clear, detailed topics (50-500 words)
2. **Context**: Include relevant background information
3. **Target Audience**: Specify audience for better content optimization
4. **Duration**: Choose realistic durations (5-30 minutes work best)

### Performance

1. **Async Processing**: All generation is asynchronous
2. **Status Polling**: Check status every 10-30 seconds
3. **Caching**: Audio files are cached for 24 hours
4. **Batch Processing**: Consider batching multiple requests

### Cost Optimization

1. **Reuse Content**: Similar topics can be variations of existing scripts
2. **Optimal Length**: Shorter podcasts cost less but may lack depth
3. **Type Selection**: Choose appropriate podcast type for better results
4. **Preview Mode**: Test with shorter durations first

## Troubleshooting

### Common Issues

1. **Long Processing Times**: 
   - Normal range: 30-120 seconds
   - Factors: Script complexity, audio length, server load

2. **Generation Failures**:
   - Check API keys are valid
   - Ensure sufficient API quotas
   - Verify input content doesn't violate policies

3. **Authentication Errors**:
   - Token may be expired (30 minutes default)
   - Re-authenticate to get new token

4. **Audio Quality Issues**:
   - Try different voice settings
   - Check source script quality
   - Consider shorter segments for complex content

### Support

For additional support:
- Check `/health` endpoint for service status
- Review error messages in responses
- Monitor usage with `/user/stats`
- Contact support with request IDs for faster resolution
