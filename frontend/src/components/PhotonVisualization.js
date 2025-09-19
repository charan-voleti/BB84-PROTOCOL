import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PhotonVisualization = ({ photons, isTransmitting, userType, interceptedPhotons = [] }) => {
  const getPhotonColor = (photon) => {
    switch (photon) {
      case 0: return 'bg-blue-400'; // |0⟩
      case 1: return 'bg-red-400';  // |1⟩
      case 2: return 'bg-green-400'; // |+⟩
      case 3: return 'bg-yellow-400'; // |-⟩
      default: return 'bg-gray-400';
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
    <div className="quantum-channel relative">
      {/* Channel Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 rounded-lg"></div>
      
      {/* Photon Stream */}
      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence>
          {photons.map((photon, index) => (
            <motion.div
              key={`photon-${index}`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                transition: { delay: index * 0.1, duration: 0.5 }
              }}
              exit={{ x: 50, opacity: 0 }}
              className={`photon ${getPhotonColor(photon)} absolute`}
              style={{
                left: `${20 + (index * 3)}%`,
                top: '50%',
                transform: 'translateY(-50%)',
                animationDelay: `${index * 0.1}s`
              }}
              title={`${getPhotonSymbol(photon)}`}
            >
              <div className="w-full h-full rounded-full animate-pulse-quantum"></div>
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-glow">
            EVE INTERCEPTED
          </div>
        </motion.div>
      )}

      {/* Status Text */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
        {isTransmitting ? 'Photons Transmitting...' : 'Channel Idle'}
      </div>
    </div>
  );
};

export default PhotonVisualization;
