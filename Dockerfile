# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose port
EXPOSE $PORT

# Change to backend directory and start the app
CMD cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
