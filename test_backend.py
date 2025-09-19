#!/usr/bin/env python3
"""
Test script for BB84 QKD Demo Backend
"""

import requests
import json
import time

def test_api_endpoints():
    """Test the main API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing BB84 QKD Demo Backend...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test simulation endpoint
    try:
        response = requests.get(f"{base_url}/simulate?n_bits=10&eve_prob=0.2")
        if response.status_code == 200:
            data = response.json()
            print("✅ Simulation endpoint working")
            print(f"   Generated {len(data['alice_bits'])} bits")
            print(f"   QBER: {data['qber']:.2%}")
            print(f"   Final key length: {len(data['final_key'])}")
        else:
            print(f"❌ Simulation endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Simulation endpoint error: {e}")
    
    # Test session status
    try:
        response = requests.get(f"{base_url}/session/status")
        if response.status_code == 200:
            print("✅ Session status endpoint working")
        else:
            print(f"❌ Session status failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Session status error: {e}")

def test_bb84_protocol():
    """Test BB84 protocol implementation"""
    print("\n🔬 Testing BB84 Protocol Logic...")
    
    # Import the protocol class
    import sys
    import os
    sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
    
    try:
        from main import BB84Protocol
        
        # Test bit generation
        bits = BB84Protocol.generate_random_bits(10)
        bases = BB84Protocol.generate_random_bases(10)
        print(f"✅ Generated {len(bits)} bits and {len(bases)} bases")
        
        # Test photon encoding
        photons = BB84Protocol.encode_photons(bits, bases)
        print(f"✅ Encoded {len(photons)} photons")
        
        # Test measurement
        bob_bases = BB84Protocol.generate_random_bases(10)
        measurements = BB84Protocol.measure_photons(photons, bob_bases)
        print(f"✅ Performed {len(measurements)} measurements")
        
        # Test Eve interception
        intercepted = BB84Protocol.simulate_eve_interception(photons, 0.3)
        print(f"✅ Simulated Eve interception")
        
        # Test QBER calculation
        matched_indices = [i for i in range(10) if bases[i] == bob_bases[i]]
        qber = BB84Protocol.calculate_qber(bits, measurements, matched_indices)
        print(f"✅ Calculated QBER: {qber:.2%}")
        
        # Test error correction
        sifted_key = [bits[i] for i in matched_indices]
        final_key = BB84Protocol.error_correction(sifted_key, qber)
        print(f"✅ Error correction: {len(sifted_key)} → {len(final_key)} bits")
        
    except Exception as e:
        print(f"❌ BB84 Protocol test failed: {e}")

if __name__ == "__main__":
    print("🚀 BB84 QKD Demo Test Suite")
    print("=" * 50)
    
    # Test API endpoints
    test_api_endpoints()
    
    # Test protocol logic
    test_bb84_protocol()
    
    print("\n" + "=" * 50)
    print("🎯 Test completed!")
    print("\nTo start the full demo:")
    print("1. Run: npm run dev")
    print("2. Open: http://localhost:3000?user=alice")
    print("3. Open: http://localhost:3000?user=bob")
    print("4. Open: http://localhost:3000?user=eve")
