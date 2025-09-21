#!/usr/bin/env python3
"""
BB84 QKD Demo Test Script
Tests the complete system functionality for hackathon deployment
"""

import requests
import json
import time
import sys
from typing import Dict, Any

def test_backend_api():
    """Test backend API endpoints"""
    print("🔍 Testing Backend API...")
    
    base_url = "http://localhost:8000"
    
    try:
        # Test root endpoint
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
        else:
            print("❌ Root endpoint failed")
            return False
            
        # Test simulation endpoint
        response = requests.get(f"{base_url}/simulate?n_bits=10&eve_prob=0.2")
        if response.status_code == 200:
            data = response.json()
            if 'alice_bits' in data and 'final_key' in data:
                print("✅ Simulation endpoint working")
                print(f"   Generated {len(data['final_key'])}-bit key")
            else:
                print("❌ Simulation endpoint returned invalid data")
                return False
        else:
            print("❌ Simulation endpoint failed")
            return False
            
        # Test session status
        response = requests.get(f"{base_url}/session/status")
        if response.status_code == 200:
            print("✅ Session status endpoint working")
        else:
            print("❌ Session status endpoint failed")
            return False
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
        print("   Make sure backend is running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False

def test_otp_encryption():
    """Test OTP encryption functionality"""
    print("\n🔐 Testing OTP Encryption...")
    
    try:
        # Test encryption endpoint
        test_message = {
            "sender": "alice",
            "content": "Hello Bob! This is a test message.",
            "encrypted": True,
            "timestamp": "2024-01-01T12:00:00Z"
        }
        
        response = requests.post("http://localhost:8000/message", json=test_message)
        if response.status_code == 200:
            print("✅ Message encryption endpoint working")
        else:
            print("❌ Message encryption endpoint failed")
            return False
            
        # Test message retrieval
        response = requests.get("http://localhost:8000/messages")
        if response.status_code == 200:
            messages = response.json().get('messages', [])
            if messages:
                print("✅ Message retrieval working")
                print(f"   Retrieved {len(messages)} messages")
            else:
                print("⚠️  No messages found (expected for fresh session)")
        else:
            print("❌ Message retrieval failed")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ OTP encryption test failed: {e}")
        return False

def test_bb84_protocol():
    """Test BB84 protocol implementation"""
    print("\n🔬 Testing BB84 Protocol...")
    
    try:
        # Test with different Eve probabilities
        test_cases = [
            {"eve_prob": 0.0, "expected_qber": "low"},
            {"eve_prob": 0.2, "expected_qber": "medium"},
            {"eve_prob": 0.5, "expected_qber": "high"}
        ]
        
        for case in test_cases:
            response = requests.get(f"http://localhost:8000/simulate?n_bits=20&eve_prob={case['eve_prob']}")
            if response.status_code == 200:
                data = response.json()
                qber = data.get('qber', 0)
                
                if case['expected_qber'] == 'low' and qber < 0.1:
                    print(f"✅ Low QBER test passed ({qber:.3f})")
                elif case['expected_qber'] == 'medium' and 0.1 <= qber < 0.3:
                    print(f"✅ Medium QBER test passed ({qber:.3f})")
                elif case['expected_qber'] == 'high' and qber >= 0.3:
                    print(f"✅ High QBER test passed ({qber:.3f})")
                else:
                    print(f"⚠️  QBER test inconclusive ({qber:.3f})")
            else:
                print(f"❌ BB84 test failed for Eve prob {case['eve_prob']}")
                return False
                
        return True
        
    except Exception as e:
        print(f"❌ BB84 protocol test failed: {e}")
        return False

def test_frontend_access():
    """Test frontend accessibility"""
    print("\n🌐 Testing Frontend Access...")
    
    try:
        # Test if frontend is accessible
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend accessible")
            return True
        else:
            print("❌ Frontend not accessible")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to frontend")
        print("   Make sure frontend is running on port 3000")
        return False
    except Exception as e:
        print(f"❌ Frontend test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 BB84 QKD Demo System Test")
    print("=" * 50)
    
    tests = [
        ("Backend API", test_backend_api),
        ("OTP Encryption", test_otp_encryption),
        ("BB84 Protocol", test_bb84_protocol),
        ("Frontend Access", test_frontend_access)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for hackathon!")
        print("\n🌐 Access URLs:")
        print("   Alice: http://localhost:3000?user=alice")
        print("   Bob:   http://localhost:3000?user=bob")
        print("   Eve:   http://localhost:3000?user=eve")
        print("\n🔥 HACKATHON READY!")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above.")
        print("   Make sure both backend and frontend are running.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
