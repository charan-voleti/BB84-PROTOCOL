# BB84 Quantum Key Distribution Demo

An interactive, gamified multi-user demonstration of the BB84 Quantum Key Distribution protocol with enhanced visualizations and real-time OTP messaging.

## ✨ Enhanced Features

- **🎮 Gamified Interface**: LED-style visualizations, animated indicators, and interactive elements
- **🌐 Multi-laptop Setup**: Alice, Bob, and Eve interfaces running on separate laptops
- **⚡ Real-time Communication**: WebSocket-based synchronization across devices
- **🔬 Interactive BB84 Protocol**: Complete implementation with enhanced photon visualization
- **👁️ Eve Interception**: Configurable intercept-resend attacks with visual impact analysis
- **🔐 OTP Messaging**: Enhanced encrypted communication using quantum-generated keys
- **📊 Error Detection**: QBER calculation with LED-style indicators
- **🎨 Smooth Animations**: Framer Motion-powered transitions and quantum field effects
- **💡 LED Visualizations**: Glowing key bits, photon states, and status indicators

## Quick Start

### Option 1: Automated Setup (Recommended)
**Windows:**
```bash
start_demo.bat
```

**Linux/Mac:**
```bash
./start_demo.sh
```

### Option 2: Manual Setup
1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start Both Services**:
   ```bash
   npm run dev
   ```

3. **Or Start Separately**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

## Multi-User Demo Setup

1. Start the backend server on one machine
2. Open Alice interface on laptop 1: http://[server-ip]:3000?user=alice
3. Open Bob interface on laptop 2: http://[server-ip]:3000?user=bob
4. Open Eve interface on laptop 3: http://[server-ip]:3000?user=eve

## Project Structure

```
├── frontend/          # React + TailwindCSS + Framer Motion
├── backend/           # Python FastAPI + Qiskit
├── package.json       # Root package configuration
└── README.md          # This file
```

## Technology Stack

- **Frontend**: React, TailwindCSS, Framer Motion, React Query
- **Backend**: Python, FastAPI, Qiskit, WebSockets
- **Communication**: WebSocket real-time synchronization
