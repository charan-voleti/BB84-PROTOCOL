# BB84 Quantum Key Distribution Demo - Hackathon Deployment Guide

## 🚀 Quick Start for 4-Laptop Hackathon Setup

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- Git
- All laptops on the same local network (Wi-Fi/LAN)

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

## 🌐 4-Laptop Hackathon Setup

### Server Laptop Setup (One Machine)
1. **Start the backend server**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start the frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Note the server's IP address** (e.g., 192.168.1.100):
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

### Client Laptop Setup (Alice, Bob, Eve)
1. **Open browser and navigate to**:
   - Alice: http://192.168.1.100:3000?user=alice
   - Bob: http://192.168.1.100:3000?user=bob
   - Eve: http://192.168.1.100:3000?user=eve

2. **All users will be synchronized in real-time via WebSocket**

### Network Requirements
- All laptops must be on the same local network
- Firewall should allow connections on ports 3000 and 8000
- WebSocket connections must be enabled

## 🔬 Enhanced Features for Hackathon

### New Gamified Elements
- **LED-style key visualization** with glowing effects
- **Real-time encryption status** with animated indicators
- **Photon transmission animations** with quantum field effects
- **Success/failure indicators** with color-coded alerts
- **Interactive Eve interception** with visual impact analysis

### Improved OTP Messaging
- **Enhanced encryption** using proper byte-level XOR
- **Real-time message synchronization** across all users
- **Security indicators** showing encryption status
- **Key usage tracking** with LED visualization

### Visual Enhancements
- **Smooth photon animations** with rotation and scaling
- **Quantum field effects** during transmission
- **LED-style bit visualization** for keys
- **Animated status indicators** for all operations
- **Responsive design** for different screen sizes

## 🎯 Hackathon Demo Flow

### Phase 1: Key Generation
1. **Alice** generates random bits and bases
2. **Alice** sends photons through quantum channel
3. **Eve** (optionally) intercepts photons
4. **Bob** measures photons with random bases
5. **Alice & Bob** compare bases and generate shared key

### Phase 2: Secure Messaging
1. **Alice** types message and encrypts with OTP
2. **Message** is transmitted securely to Bob
3. **Bob** receives and decrypts message
4. **Bob** can reply using the same process
5. **Eve** can see encrypted traffic but cannot decrypt

### Phase 3: Security Analysis
1. **QBER calculation** shows quantum bit error rate
2. **Eve's impact** is visualized with error indicators
3. **Key quality** is assessed based on QBER
4. **Security status** is displayed with LED indicators

## 📊 Understanding the Enhanced Results

### Quantum Bit Error Rate (QBER)
- **< 10%**: Low error rate, high-quality key (Green LED)
- **10-30%**: Medium error rate, usable key (Yellow LED)
- **> 30%**: High error rate, potential eavesdropping (Red LED)

### LED Visualizations
- **Blue LEDs**: Bit value 0
- **Red LEDs**: Bit value 1
- **Green LEDs**: Successful operations
- **Yellow LEDs**: Warnings or processing
- **Red LEDs**: Errors or interception detected

### Animation Phases
- **Idle**: Channel standby (Gray)
- **Transmitting**: Photons moving (Blue/Purple gradient)
- **Intercepted**: Eve's attack detected (Red alerts)
- **Complete**: Operation finished (Green indicators)

## 🛠️ Technical Enhancements

### Backend Improvements
- **Enhanced OTP encryption** with proper byte-level XOR
- **Improved WebSocket handling** with better error management
- **Real-time message routing** between Alice and Bob
- **Eve interception simulation** with QBER calculation
- **Session persistence** for multi-user synchronization

### Frontend Enhancements
- **Framer Motion animations** for smooth transitions
- **LED-style visualizations** for quantum states
- **Real-time status updates** with animated indicators
- **Responsive design** for different screen sizes
- **Gamified elements** for better user engagement

### BB84 Protocol Implementation
- **Rectilinear Basis**: |0⟩, |1⟩ states (Blue/Red LEDs)
- **Diagonal Basis**: |+⟩, |-⟩ states (Green/Yellow LEDs)
- **Intercept-Resend**: Eve's attack simulation
- **Error Correction**: QBER-based key reduction
- **OTP Encryption**: Byte-level XOR with quantum key

## 🔧 Troubleshooting for Hackathon

### Connection Issues
- Ensure backend server is running on port 8000
- Check firewall settings for WebSocket connections
- Verify all users are on the same network
- Try accessing server IP directly: http://[SERVER_IP]:8000

### Performance Issues
- Reduce number of bits for faster simulation (change from 20 to 10)
- Close unnecessary browser tabs
- Use modern browsers (Chrome, Firefox, Safari)
- Ensure stable network connection

### Multi-User Sync Issues
- Refresh all browser windows
- Restart backend server
- Check WebSocket connection status in browser dev tools
- Verify server IP address is correct

### Animation Issues
- Ensure JavaScript is enabled
- Check browser compatibility with Framer Motion
- Disable browser extensions that might interfere
- Try different browser if animations don't work

## 📚 Educational Value for Hackathon

This enhanced demo teaches:
- **Quantum Cryptography**: BB84 protocol fundamentals
- **Quantum Uncertainty**: Measurement disturbance effects
- **Eavesdropping Detection**: QBER analysis and visualization
- **Key Distribution**: Secure key establishment process
- **Real-time Collaboration**: Multi-user synchronization
- **Visual Learning**: LED-style quantum state representation
- **Interactive Security**: Hands-on quantum security demonstration

## 🎯 Hackathon Scenarios

### Scenario 1: Perfect Security (No Eve)
- Set Eve probability to 0%
- Observe low QBER (~0%)
- Generate high-quality keys (Green LEDs)
- Send encrypted messages successfully

### Scenario 2: Light Eavesdropping  
- Set Eve probability to 10-20%
- Observe moderate QBER increase (Yellow LEDs)
- Notice key quality degradation
- See Eve's interception attempts

### Scenario 3: Heavy Eavesdropping
- Set Eve probability to 50%+
- Observe high QBER (>30%, Red LEDs)
- Demonstrate eavesdropping detection
- Show security failure indicators

### Scenario 4: Interactive Attack
- Eve manually intercepts photons
- Alice and Bob see real-time alerts
- QBER increases dramatically
- Security system detects attack

## 📝 Hackathon Notes

- **Real-time synchronization** across all laptops
- **Visual feedback** for all quantum operations
- **Interactive elements** for better engagement
- **Educational value** for quantum cryptography
- **Perfect for demonstrations** and presentations
- **Scalable** for different group sizes
- **Professional appearance** with LED-style effects

## 🚀 Quick Commands for Hackathon

### Start Server (Server Laptop)
```bash
cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
cd frontend && npm start
```

### Access Interfaces (Client Laptops)
- Alice: http://[SERVER_IP]:3000?user=alice
- Bob: http://[SERVER_IP]:3000?user=bob
- Eve: http://[SERVER_IP]:3000?user=eve

### Check Network
```bash
# Find server IP
ipconfig | findstr IPv4  # Windows
ifconfig | grep inet     # Linux/Mac
```

This enhanced BB84 demo provides a complete, interactive quantum cryptography experience perfect for hackathons, educational demonstrations, and technical presentations!