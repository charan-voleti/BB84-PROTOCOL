# BB84 Quantum Key Distribution Demo - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- Git

### Installation

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd BB84
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start the Demo**:
   ```bash
   npm run dev
   ```

3. **Access Interfaces**:
   - Alice: http://localhost:3000?user=alice
   - Bob: http://localhost:3000?user=bob  
   - Eve: http://localhost:3000?user=eve

## 🌐 Multi-Laptop Demo Setup

### Server Setup (One Machine)
1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Note the server's IP address (e.g., 192.168.1.100)

### Client Setup (Other Laptops)
1. Open browser and navigate to:
   - Alice: http://192.168.1.100:3000?user=alice
   - Bob: http://192.168.1.100:3000?user=bob
   - Eve: http://192.168.1.100:3000?user=eve

2. All users will be synchronized in real-time via WebSocket

## 🔬 How to Use the Demo

### Alice's Role
1. **Generate Bits**: Click "Generate Bits" to create random bits and bases
2. **Adjust Eve Probability**: Use slider to set Eve's interception probability
3. **Send Photons**: Click "Send Photons" to transmit quantum states
4. **Monitor Process**: Watch basis comparison and key generation
5. **Send Messages**: Use OTP encryption with the final key

### Bob's Role  
1. **Generate Bases**: Create random measurement bases
2. **Measure Photons**: Automatically measures received photons
3. **Compare Bases**: Click "Compare Bases" to find matches
4. **Monitor QBER**: Watch quantum bit error rate
5. **Receive Messages**: Decrypt messages from Alice

### Eve's Role
1. **Choose Mode**: Select automatic or manual interception
2. **Generate Bases**: Create interception measurement bases
3. **Intercept**: Click "Intercept" to measure photons
4. **Resend**: Forward modified photons to Bob
5. **Monitor Impact**: See how interception affects QBER

## 📊 Understanding the Results

### Quantum Bit Error Rate (QBER)
- **< 10%**: Low error rate, high-quality key
- **10-30%**: Medium error rate, usable key
- **> 30%**: High error rate, potential eavesdropping

### Basis Matching
- Green highlighted bases indicate matches
- Only matched bases contribute to the sifted key
- Typical match rate: ~50% (due to random basis selection)

### Key Generation Process
1. **Raw Bits**: Alice's original random bits
2. **Encoded Photons**: Bits encoded with quantum bases
3. **Sifted Key**: Bits from matched bases only
4. **Final Key**: Error-corrected sifted key

## 🛠️ Technical Details

### Backend Architecture
- **FastAPI**: REST API and WebSocket server
- **Socket.IO**: Real-time communication
- **Qiskit**: Quantum simulation (optional)
- **Python**: Core BB84 protocol implementation

### Frontend Architecture
- **React**: User interface framework
- **TailwindCSS**: Styling and animations
- **Framer Motion**: Smooth animations
- **Socket.IO Client**: Real-time communication

### BB84 Protocol Implementation
- **Rectilinear Basis**: |0⟩, |1⟩ states
- **Diagonal Basis**: |+⟩, |-⟩ states  
- **Intercept-Resend**: Eve's attack simulation
- **Error Correction**: Simple QBER-based reduction

## 🔧 Troubleshooting

### Connection Issues
- Ensure backend server is running on port 8000
- Check firewall settings for WebSocket connections
- Verify all users are on the same network

### Performance Issues
- Reduce number of bits for faster simulation
- Close unnecessary browser tabs
- Use modern browsers (Chrome, Firefox, Safari)

### Multi-User Sync Issues
- Refresh all browser windows
- Restart backend server
- Check WebSocket connection status

## 📚 Educational Value

This demo teaches:
- **Quantum Cryptography**: BB84 protocol fundamentals
- **Quantum Uncertainty**: Measurement disturbance
- **Eavesdropping Detection**: QBER analysis
- **Key Distribution**: Secure key establishment
- **Real-time Collaboration**: Multi-user synchronization

## 🎯 Demo Scenarios

### Scenario 1: No Eavesdropping
- Set Eve probability to 0%
- Observe low QBER (~0%)
- Generate high-quality keys

### Scenario 2: Light Eavesdropping  
- Set Eve probability to 10-20%
- Observe moderate QBER increase
- Notice key quality degradation

### Scenario 3: Heavy Eavesdropping
- Set Eve probability to 50%+
- Observe high QBER (>30%)
- Demonstrate eavesdropping detection

## 📝 Notes

- This is a simulation for educational purposes
- Real quantum systems require specialized hardware
- The demo demonstrates quantum principles, not actual quantum states
- Perfect for quantum cryptography education and demonstrations
