#!/usr/bin/env python
import os
import sys

# Add the backend directory to Python path
sys.path.insert(0, 'backend')

# Change to backend directory
os.chdir('backend')

# Get port from environment variable (Railway sets this)
port = os.environ.get('PORT', '8000')

# Start the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(port))
