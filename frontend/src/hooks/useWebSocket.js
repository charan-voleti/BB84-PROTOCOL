import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (userType) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (userType && userType !== 'login') {
      const newSocket = io('http://localhost:8000', {
        transports: ['websocket'],
        autoConnect: true
      });

      newSocket.on('connect', () => {
        console.log(`Connected as ${userType}`);
        setIsConnected(true);
        // Join with user type
        newSocket.emit('join', { user_id: userType });
      });

      newSocket.on('disconnect', () => {
        console.log(`Disconnected as ${userType}`);
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('joined', (data) => {
        console.log(`Joined as ${data.user_id}`);
      });

      setSocket(newSocket);
      socketRef.current = newSocket;

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [userType]);

  return { socket, isConnected };
};
