#!/usr/bin/env python
import os
import sys
import subprocess

# Add the backend directory to Python path
sys.path.insert(0, 'backend')

# Change to backend directory and start the app
os.chdir('backend')
subprocess.run([sys.executable, '-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', os.environ.get('PORT', '8000')])
