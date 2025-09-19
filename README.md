# BB84 Quantum Key Distribution Demo

An interactive multi-user demonstration of the BB84 Quantum Key Distribution protocol.

## Features

- **Multi-user Setup**: Alice, Bob, and Eve interfaces running on separate laptops
- **Real-time Communication**: WebSocket-based synchronization across devices
- **Interactive BB84 Protocol**: Complete implementation with photon visualization
- **Eve Interception**: Configurable intercept-resend attacks
- **OTP Messaging**: Encrypted communication using generated keys
- **Error Detection**: QBER calculation and error correction

## Quick Start

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start Development Servers**:
   ```bash
   npm run dev
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - WebSocket: ws://localhost:8000/ws

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
