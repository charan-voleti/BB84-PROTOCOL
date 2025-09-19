import { useState, useEffect } from 'react';

export const useBB84Session = (socket) => {
  const [sessionData, setSessionData] = useState({
    phase: 'idle',
    aliceData: { bits: [], bases: [], siftedKey: [], finalKey: [] },
    bobData: { bases: [], measurements: [], siftedKey: [], finalKey: [] },
    eveData: { bits: [], bases: [] },
    qber: 0,
    matchedIndices: [],
    messages: []
  });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      switch (data.type) {
        case 'photons_received':
          setSessionData(prev => ({
            ...prev,
            phase: data.data.phase,
            photons: data.data.photons
          }));
          break;
          
        case 'eve_intercepted':
          setSessionData(prev => ({
            ...prev,
            eveData: { ...prev.eveData, ...data.data }
          }));
          break;
          
        case 'basis_comparison_complete':
          setSessionData(prev => ({
            ...prev,
            phase: data.data.phase,
            matchedIndices: data.data.matched_indices,
            qber: data.data.qber,
            aliceData: {
              ...prev.aliceData,
              siftedKey: data.data.sifted_key,
              finalKey: data.data.final_key
            },
            bobData: {
              ...prev.bobData,
              siftedKey: data.data.sifted_key,
              finalKey: data.data.final_key
            }
          }));
          break;
          
        case 'new_message':
          setSessionData(prev => ({
            ...prev,
            messages: [...prev.messages, data.data]
          }));
          break;
          
        case 'session_reset':
          setSessionData({
            phase: 'idle',
            aliceData: { bits: [], bases: [], siftedKey: [], finalKey: [] },
            bobData: { bases: [], measurements: [], siftedKey: [], finalKey: [] },
            eveData: { bits: [], bases: [] },
            qber: 0,
            matchedIndices: [],
            messages: []
          });
          break;
          
        default:
          break;
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [socket]);

  const updateSession = (updates) => {
    setSessionData(prev => ({ ...prev, ...updates }));
  };

  const sendMessage = (type, data) => {
    if (socket) {
      socket.emit('message', JSON.stringify({ type, data }));
    }
  };

  return { sessionData, updateSession, sendMessage };
};
