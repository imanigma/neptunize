#!/usr/bin/env python3
"""
Startup script for the Neptunize backend server.
"""
import os
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

import uvicorn
from app.config import get_settings

def main():
    """Main entry point for the application."""
    settings = get_settings()
    
    # Ensure required directories exist
    os.makedirs("generated_audio", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    # Start the server
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        workers=1 if settings.reload else settings.workers,
        log_level=settings.log_level.lower(),
        access_log=True
    )

if __name__ == "__main__":
    main()
