#!/usr/bin/env python3
"""
Simple test script to verify the backend components work correctly.
"""
import asyncio
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import get_settings, SystemPrompts
from app.schemas import ScriptEnhancementRequest, PodcastType

async def test_configuration():
    """Test configuration loading."""
    print("🔧 Testing configuration...")
    settings = get_settings()
    
    # Check if basic settings load
    assert settings.host is not None
    assert settings.port is not None
    print(f"✅ Settings loaded - Host: {settings.host}:{settings.port}")
    
    # Test system prompts
    crime_prompt = SystemPrompts.get_prompt_by_type("crime")
    assert len(crime_prompt) > 100
    print("✅ System prompts loaded successfully")

async def test_schemas():
    """Test Pydantic schemas."""
    print("\n📋 Testing schemas...")
    
    # Test request schema
    request = ScriptEnhancementRequest(
        topic="A mysterious disappearance in a small town",
        podcast_type=PodcastType.CRIME,
        target_duration=15,
        target_audience="crime enthusiasts"
    )
    
    assert request.topic is not None
    assert request.podcast_type == PodcastType.CRIME
    print("✅ Schemas working correctly")

async def test_services():
    """Test service imports."""
    print("\n🔧 Testing services...")
    
    try:
        from app.services import openai_service, elevenlabs_service, podcast_service
        print("✅ All services imported successfully")
    except ImportError as e:
        print(f"❌ Service import failed: {e}")
        return False
    
    return True

async def test_database():
    """Test database connection."""
    print("\n🗄️ Testing database...")
    
    try:
        from app.database import get_db
        from app.models import Base
        print("✅ Database modules loaded successfully")
        print("⚠️  Note: Database connection requires PostgreSQL to be running")
    except ImportError as e:
        print(f"❌ Database import failed: {e}")
        return False
    
    return True

async def main():
    """Run all tests."""
    print("🚀 Neptunize Backend Test Suite")
    print("=" * 50)
    
    try:
        await test_configuration()
        await test_schemas()
        
        services_ok = await test_services()
        database_ok = await test_database()
        
        print("\n📊 Test Summary:")
        print("=" * 30)
        print("✅ Configuration: PASS")
        print("✅ Schemas: PASS")
        print(f"{'✅' if services_ok else '❌'} Services: {'PASS' if services_ok else 'FAIL'}")
        print(f"{'✅' if database_ok else '❌'} Database: {'PASS' if database_ok else 'FAIL'}")
        
        if services_ok and database_ok:
            print("\n🎉 All basic tests passed!")
            print("\n📝 Next steps:")
            print("1. Set up PostgreSQL database")
            print("2. Configure .env file with API keys")
            print("3. Run: python run.py")
            print("4. Visit: http://localhost:8000/docs")
            
            return True
        else:
            print("\n❌ Some tests failed. Check the errors above.")
            return False
            
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
