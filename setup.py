#!/usr/bin/env python3
"""
Setup script for Neptunize backend development environment.
"""
import os
import sys
import subprocess
import shutil
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors."""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_prerequisites():
    """Check if required tools are installed."""
    print("🔍 Checking prerequisites...")
    
    # Check Python
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}")
    
    # Check PostgreSQL
    if shutil.which("psql") is None:
        print("⚠️  PostgreSQL not found. Install PostgreSQL to use database features.")
        print("   macOS: brew install postgresql")
        print("   Ubuntu: sudo apt install postgresql postgresql-contrib")
    else:
        print("✅ PostgreSQL found")
    
    # Check Git (for development)
    if shutil.which("git") is None:
        print("⚠️  Git not found. Install Git for version control.")
    else:
        print("✅ Git found")
    
    return True

def setup_virtual_environment():
    """Set up Python virtual environment."""
    venv_path = Path("venv")
    
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True
    
    return run_command(f"{sys.executable} -m venv venv", "Creating virtual environment")

def install_dependencies():
    """Install Python dependencies."""
    pip_cmd = "venv/bin/pip" if os.name != "nt" else "venv\\Scripts\\pip"
    return run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies")

def setup_environment_file():
    """Set up environment configuration."""
    env_file = Path(".env")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    example_file = Path(".env.example")
    if example_file.exists():
        shutil.copy(example_file, env_file)
        print("✅ Created .env from .env.example")
        print("⚠️  Please edit .env with your actual API keys")
        return True
    else:
        print("❌ .env.example not found")
        return False

def create_directories():
    """Create necessary directories."""
    directories = ["generated_audio", "logs", "alembic/versions"]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
    
    print("✅ Created necessary directories")
    return True

def setup_database():
    """Set up database (if PostgreSQL is available)."""
    if shutil.which("createdb") is None:
        print("⚠️  PostgreSQL not available. Skipping database setup.")
        print("   To set up database manually:")
        print("   1. Install PostgreSQL")
        print("   2. Create database: createdb neptunize_db")
        print("   3. Run migrations: alembic upgrade head")
        return True
    
    # Try to create database
    success = run_command("createdb neptunize_db", "Creating database")
    if success:
        # Run migrations
        python_cmd = "venv/bin/python" if os.name != "nt" else "venv\\Scripts\\python"
        return run_command(f"{python_cmd} -m alembic upgrade head", "Running database migrations")
    
    return True

def run_tests():
    """Run basic tests to verify setup."""
    python_cmd = "venv/bin/python" if os.name != "nt" else "venv\\Scripts\\python"
    return run_command(f"{python_cmd} test_backend.py", "Running basic tests")

def main():
    """Main setup function."""
    print("🚀 Neptunize Backend Setup")
    print("=" * 50)
    
    if not check_prerequisites():
        sys.exit(1)
    
    steps = [
        setup_virtual_environment,
        install_dependencies,
        setup_environment_file,
        create_directories,
        setup_database,
        run_tests
    ]
    
    for step in steps:
        if not step():
            print(f"\n❌ Setup failed at step: {step.__name__}")
            sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📝 Next steps:")
    print("1. Edit .env file with your OpenAI and ElevenLabs API keys")
    print("2. Activate virtual environment:")
    if os.name != "nt":
        print("   source venv/bin/activate")
    else:
        print("   venv\\Scripts\\activate")
    print("3. Start the server:")
    print("   python run.py")
    print("4. Visit API documentation:")
    print("   http://localhost:8000/docs")

if __name__ == "__main__":
    main()
