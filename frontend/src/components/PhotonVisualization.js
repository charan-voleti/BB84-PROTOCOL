import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PhotonVisualization = ({ photons, isTransmitting, userType, interceptedPhotons = [] }) => {
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, transmitting, intercepted, complete
  const [photonPositions, setPhotonPositions] = useState([]);
  useEffect(() => {
    if (photons && photons.length > 0) {
      setAnimationPhase('transmitting');
      // Update photon positions for smooth animation
      const positions = photons.map((_, index) => ({
        id: index,
        x: 20 + (index * 3),
        delay: index * 0.1
      }));
      setPhotonPositions(positions);
      
      // Complete animation after all photons are transmitted
      setTimeout(() => {
        setAnimationPhase('complete');
      }, photons.length * 100 + 1000);
    }
  }, [photons]);

  const getPhotonColor = (photon) => {
    switch (photon) {
      case 0: return 'bg-blue-500'; // |0⟩
      case 1: return 'bg-red-500';  // |1⟩
      case 2: return 'bg-green-500'; // |+⟩
      case 3: return 'bg-yellow-500'; // |-⟩
      default: return 'bg-gray-500';
    }
  };

  const getPhotonGlow = (photon) => {
    switch (photon) {
      case 0: return 'shadow-blue-500/50'; // |0⟩
      case 1: return 'shadow-red-500/50';  // |1⟩
      case 2: return 'shadow-green-500/50'; // |+⟩
      case 3: return 'shadow-yellow-500/50'; // |-⟩
      default: return 'shadow-gray-500/50';
    }
  };

  const getPhotonSymbol = (photon) => {
    switch (photon) {
      case 0: return '|0⟩';
      case 1: return '|1⟩';
      case 2: return '|+⟩';
      case 3: return '|-⟩';
      default: return '?';
    }
  };

  return (
    <div className="quantum-channel relative h-32 overflow-hidden">
      {/* Channel Background with Animated Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 rounded-lg"
        animate={{
          background: animationPhase === 'transmitting' 
            ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))'
            : 'linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))'
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Quantum Field Effect */}
      {animationPhase === 'transmitting' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
      
      {/* Photon Stream */}
      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence>
          {photons.map((photon, index) => (
            <motion.div
              key={`photon-${index}`}
              initial={{ 
                x: -100, 
                opacity: 0, 
                scale: 0.5,
                rotate: 0
              }}
              animate={{ 
                x: 0, 
                opacity: 1,
                scale: 1,
                rotate: 360,
                transition: { 
                  delay: index * 0.1, 
                  duration: 0.8,
                  ease: 'easeOut'
                }
              }}
              exit={{ 
                x: 100, 
                opacity: 0, 
                scale: 0.5,
                transition: { duration: 0.3 }
              }}
              className={`photon ${getPhotonColor(photon)} ${getPhotonGlow(photon)} absolute w-4 h-4 rounded-full shadow-lg`}
              style={{
                left: `${20 + (index * 3)}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                boxShadow: `0 0 20px ${getPhotonColor(photon).replace('bg-', '').replace('-500', '')}`
              }}
              title={`${getPhotonSymbol(photon)}`}
            >
              {/* Inner LED Effect */}
              <motion.div
                className="w-full h-full rounded-full bg-white/30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Quantum State Indicator */}
              <motion.div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-white bg-black/50 px-1 rounded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {getPhotonSymbol(photon)}
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Labels */}
      <div className="absolute top-2 left-2 text-xs text-gray-400">
        Alice
      </div>
      <div className="absolute top-2 right-2 text-xs text-gray-400">
        Bob
      </div>

      {/* Eve's Interception Indicator */}
      {userType === 'eve' && interceptedPhotons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
            animate={{
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.5)',
                '0 0 30px rgba(239, 68, 68, 0.8)',
                '0 0 20px rgba(239, 68, 68, 0.5)'
              ]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                ⚡
              </motion.div>
              <span>EVE INTERCEPTED</span>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Interception Alert for Alice/Bob */}
      {userType !== 'eve' && interceptedPhotons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 right-2 z-10"
        >
          <div className="bg-red-900/80 border border-red-500/50 text-red-300 px-2 py-1 rounded text-xs font-semibold">
            ⚠️ INTERCEPTION DETECTED
          </div>
        </motion.div>
      )}

      {/* Status Text with Animation */}
      <motion.div 
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400"
        animate={{
          opacity: animationPhase === 'transmitting' ? [0.5, 1, 0.5] : 0.7
        }}
        transition={{
          duration: 1,
          repeat: animationPhase === 'transmitting' ? Infinity : 0,
          ease: 'easeInOut'
        }}
      >
        {animationPhase === 'transmitting' && 'Photons Transmitting...'}
        {animationPhase === 'complete' && 'Transmission Complete'}
        {animationPhase === 'idle' && 'Channel Idle'}
      </motion.div>

      {/* Quantum Channel Quality Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            animationPhase === 'transmitting' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-xs text-gray-400">
            {animationPhase === 'transmitting' ? 'QUANTUM CHANNEL ACTIVE' : 'CHANNEL STANDBY'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PhotonVisualization;
