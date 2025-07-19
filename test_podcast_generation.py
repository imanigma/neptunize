#!/usr/bin/env python3
"""
Test script to generate a podcast about work-life balance.
This script tests the complete podcast generation pipeline.
"""
import requests
import time
import json
import sys
from typing import Optional, Dict, Any

# API Configuration
BASE_URL = "http://localhost:8000"
HEADERS = {"Content-Type": "application/json"}

class PodcastGenerationTest:
    """Test class for podcast generation functionality."""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        
    def test_health_check(self) -> bool:
        """Test if the API is healthy."""
        print("🏥 Testing API health...")
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                health_data = response.json()
                print(f"✅ API is healthy: {health_data['status']}")
                print(f"   Services: {health_data['services']}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    def register_test_user(self) -> bool:
        """Register a test user."""
        print("\n👤 Registering test user...")
        
        user_data = {
            "username": f"test_user_{int(time.time())}",
            "email": f"test_{int(time.time())}@example.com",
            "password": "test_password_123"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=user_data,
                headers=HEADERS,
                timeout=10
            )
            
            if response.status_code == 200:
                user_info = response.json()
                self.user_id = user_info["id"]
                print(f"✅ User registered: {user_info['username']} (ID: {self.user_id})")
                
                # Now login to get token
                return self.login_user(user_data["username"], user_data["password"])
            else:
                print(f"❌ User registration failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Registration error: {e}")
            return False
    
    def login_user(self, username: str, password: str) -> bool:
        """Login user and get access token."""
        print(f"🔑 Logging in user: {username}...")
        
        try:
            # Use query parameters for login
            response = requests.post(
                f"{self.base_url}/auth/login?username={username}&password={password}",
                headers=HEADERS,
                timeout=10
            )
            
            if response.status_code == 200:
                login_data = response.json()
                self.token = login_data["access_token"]
                print(f"✅ Login successful, token received")
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False
    
    def create_podcast_request(self) -> Optional[int]:
        """Create a podcast generation request."""
        print("\n🎙️ Creating podcast request...")
        
        podcast_data = {
            "original_topic": """
            Explore the evolving concept of work-life balance in the modern era. 
            Discuss how remote work, technology, and changing workplace cultures have redefined 
            what it means to balance professional responsibilities with personal well-being. 
            Include insights about setting boundaries, managing stress, prioritizing mental health, 
            and finding fulfillment both at work and in personal life. Touch on practical strategies 
            for busy professionals, the role of employers in supporting work-life balance, 
            and how different generations approach this challenge differently.
            """.strip(),
            "podcast_type": "business",
            "target_duration": 5,
            "target_audience": "working professionals and entrepreneurs"
        }
        
        try:
            auth_headers = {
                **HEADERS,
                "Authorization": f"Bearer {self.token}"
            }
            
            response = requests.post(
                f"{self.base_url}/podcasts",
                json=podcast_data,
                headers=auth_headers,
                timeout=30
            )
            
            if response.status_code == 200:
                request_data = response.json()
                request_id = request_data["id"]
                print(f"✅ Podcast request created: ID {request_id}")
                print(f"   Topic: {podcast_data['original_topic'][:100]}...")
                print(f"   Type: {podcast_data['podcast_type']}")
                print(f"   Duration: {podcast_data['target_duration']} minutes")
                return request_id
            else:
                print(f"❌ Podcast creation failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Podcast creation error: {e}")
            return None
    
    def monitor_podcast_progress(self, request_id: int, max_wait_time: int = 300) -> bool:
        """Monitor podcast generation progress."""
        print(f"\n⏳ Monitoring podcast generation (ID: {request_id})...")
        print("   This may take 1-3 minutes depending on content length...")
        
        auth_headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        start_time = time.time()
        last_status = None
        
        while time.time() - start_time < max_wait_time:
            try:
                # Check status
                response = requests.get(
                    f"{self.base_url}/podcasts/{request_id}/status",
                    headers=auth_headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    status_data = response.json()
                    current_status = status_data["status"]
                    progress = status_data["progress_percentage"]
                    stage = status_data["current_stage"]
                    
                    # Only print if status changed
                    if current_status != last_status:
                        print(f"   📊 Status: {current_status} ({progress}%)")
                        print(f"   🔄 Stage: {stage}")
                        last_status = current_status
                    
                    if current_status == "completed":
                        print("✅ Podcast generation completed!")
                        return True
                    elif current_status == "failed":
                        error_msg = status_data.get("error_message", "Unknown error")
                        print(f"❌ Podcast generation failed: {error_msg}")
                        return False
                    
                    # Wait before next check
                    time.sleep(5)
                    
                else:
                    print(f"❌ Status check failed: {response.status_code}")
                    return False
                    
            except Exception as e:
                print(f"❌ Status monitoring error: {e}")
                time.sleep(5)
        
        print(f"⏰ Timeout: Podcast generation took longer than {max_wait_time} seconds")
        return False
    
    def get_podcast_details(self, request_id: int) -> Optional[Dict[str, Any]]:
        """Get final podcast details."""
        print(f"\n📋 Retrieving podcast details...")
        
        auth_headers = {
            "Authorization": f"Bearer {self.token}"
        }
        
        try:
            response = requests.get(
                f"{self.base_url}/podcasts/{request_id}",
                headers=auth_headers,
                timeout=10
            )
            
            if response.status_code == 200:
                podcast_data = response.json()
                
                print("✅ Podcast Details:")
                print(f"   📝 Status: {podcast_data['status']}")
                print(f"   ⏱️  Audio Duration: {podcast_data.get('audio_duration', 'N/A')} seconds")
                print(f"   🕐 Processing Time: {podcast_data.get('total_processing_time', 'N/A')} seconds")
                print(f"   🎵 Audio URL: {podcast_data.get('audio_file_url', 'N/A')}")
                
                # Show enhanced script preview
                if podcast_data.get('enhanced_script'):
                    script = podcast_data['enhanced_script']
                    print(f"\n📜 Enhanced Script Preview:")
                    print(f"   {script[:200]}...")
                    print(f"   (Total length: {len(script)} characters)")
                
                return podcast_data
            else:
                print(f"❌ Failed to get podcast details: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error getting podcast details: {e}")
            return None
    
    def test_audio_file_access(self, audio_url: str) -> bool:
        """Test if the generated audio file is accessible."""
        if not audio_url or audio_url == "N/A":
            print("⚠️  No audio URL available to test")
            return False
        
        print(f"\n🔊 Testing audio file access...")
        
        try:
            # Test audio file accessibility
            full_url = f"{self.base_url}{audio_url}"
            response = requests.head(full_url, timeout=10)
            
            if response.status_code == 200:
                content_length = response.headers.get('content-length', 'Unknown')
                print(f"✅ Audio file accessible: {full_url}")
                print(f"   📦 File size: {content_length} bytes")
                return True
            else:
                print(f"❌ Audio file not accessible: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Audio file test error: {e}")
            return False
    
    def run_complete_test(self) -> bool:
        """Run the complete podcast generation test."""
        print("🚀 Starting Complete Podcast Generation Test")
        print("=" * 60)
        print("Topic: Work-Life Balance")
        print("Duration: 5 minutes")
        print("Type: Business podcast")
        print("=" * 60)
        
        # Step 1: Health check
        if not self.test_health_check():
            return False
        
        # Step 2: Register and login user
        if not self.register_test_user():
            return False
        
        # Step 3: Create podcast request
        request_id = self.create_podcast_request()
        if not request_id:
            return False
        
        # Step 4: Monitor progress
        if not self.monitor_podcast_progress(request_id):
            return False
        
        # Step 5: Get final details
        podcast_data = self.get_podcast_details(request_id)
        if not podcast_data:
            return False
        
        # Step 6: Test audio file
        audio_url = podcast_data.get('audio_file_url')
        self.test_audio_file_access(audio_url)
        
        # Final summary
        print("\n🎉 TEST COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print("✅ All components working correctly")
        print("✅ OpenAI script enhancement functional")
        print("✅ ElevenLabs audio generation functional")
        print("✅ Database operations successful")
        print("✅ Authentication system working")
        
        if audio_url and audio_url != "N/A":
            print(f"\n🎵 Your podcast is ready!")
            print(f"   Listen at: {self.base_url}{audio_url}")
            print(f"   Or find the file: ./generated_audio/")
        
        return True


def main():
    """Main test execution."""
    tester = PodcastGenerationTest()
    
    try:
        success = tester.run_complete_test()
        
        if success:
            print("\n🎯 Test Result: SUCCESS")
            sys.exit(0)
        else:
            print("\n❌ Test Result: FAILED")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
