import React, { useState, useEffect } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import { useWebSocket } from './hooks/useWebSocket';
import { useBB84Session } from './hooks/useBB84Session';
import AliceInterface from './components/AliceInterface';
import BobInterface from './components/BobInterface';
import EveInterface from './components/EveInterface';
import LoginScreen from './components/LoginScreen';
import './App.css';

function App() {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('user') || 'login';
  const [currentUser, setCurrentUser] = useState(userType);
  
  const { socket, isConnected } = useWebSocket(currentUser);
  const { sessionData, updateSession } = useBB84Session(socket);

  useEffect(() => {
    if (userType !== 'login') {
      setCurrentUser(userType);
    }
  }, [userType]);

  const renderInterface = () => {
    switch (currentUser) {
      case 'alice':
        return <AliceInterface socket={socket} sessionData={sessionData} updateSession={updateSession} />;
      case 'bob':
        return <BobInterface socket={socket} sessionData={sessionData} updateSession={updateSession} />;
      case 'eve':
        return <EveInterface socket={socket} sessionData={sessionData} updateSession={updateSession} />;
      default:
        return <LoginScreen onUserSelect={setCurrentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            BB84 Quantum Key Distribution Demo
          </h1>
          <p className="text-gray-300">
            Interactive Multi-User Quantum Cryptography Demonstration
          </p>
          {currentUser !== 'login' && (
            <div className="mt-4 flex justify-center items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentUser === 'alice' ? 'bg-blue-600 text-white' :
                currentUser === 'bob' ? 'bg-green-600 text-white' :
                'bg-red-600 text-white'
              }`}>
                {currentUser.toUpperCase()}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </div>
            </div>
          )}
        </header>

        <main>
          {renderInterface()}
        </main>

        <footer className="text-center mt-12 text-gray-400 text-sm">
          <p>BB84 QKD Demo - Quantum Cryptography in Action</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
