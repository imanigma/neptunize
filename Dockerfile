# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Create generated_audio directory
RUN mkdir -p generated_audio

# Set Python path to include backend directory
ENV PYTHONPATH="/app/backend:/app"

# Expose port
EXPOSE $PORT

# Change to backend directory and start the app
CMD ["sh", "-c", "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
