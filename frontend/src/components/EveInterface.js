import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, RefreshCw, Zap, AlertTriangle } from 'lucide-react';
import PhotonVisualization from './PhotonVisualization';
import BasisDisplay from './BasisDisplay';

const EveInterface = ({ socket, sessionData, updateSession, sendMessage }) => {
  const [eveBases, setEveBases] = useState([]);
  const [eveMeasurements, setEveMeasurements] = useState([]);
  const [interceptionMode, setInterceptionMode] = useState('automatic'); // 'automatic' or 'manual'
  const [interceptedPhotons, setInterceptedPhotons] = useState([]);
  const [hasIntercepted, setHasIntercepted] = useState(false);

  const generateEveBases = () => {
    const newBases = Array.from({ length: 20 }, () => Math.floor(Math.random() * 2));
    setEveBases(newBases);
  };

  const interceptPhotons = () => {
    if (!sessionData.photons || sessionData.photons.length === 0) return;
    
    const intercepted = sessionData.photons.map((photon, index) => {
      const base = eveBases[index] || Math.floor(Math.random() * 2);
      
      // Eve measures with her basis
      if (base === 0) { // Rectilinear measurement
        if (photon < 2) { // Correct basis
          return photon;
        } else { // Wrong basis - random result
          return Math.floor(Math.random() * 2);
        }
      } else { // Diagonal measurement
        if (photon >= 2) { // Correct basis
          return photon - 2;
        } else { // Wrong basis - random result
          return Math.floor(Math.random() * 2);
        }
      }
    });
    
    setEveMeasurements(intercepted);
    setInterceptedPhotons(intercepted);
    setHasIntercepted(true);
    
    // Send interception data to other users
    sendMessage('eve_intercept', {
      bits: intercepted,
      bases: eveBases,
      intercepted_photons: intercepted
    });
  };

  const resendPhotons = () => {
    if (interceptedPhotons.length === 0) return;
    
    // Eve resends photons with random bases (simulating her uncertainty)
    const resentPhotons = interceptedPhotons.map((bit) => {
      const resendBase = Math.floor(Math.random() * 2);
      if (resendBase === 0) {
        return bit; // Rectilinear
      } else {
        return bit + 2; // Diagonal
      }
    });
    
    // Forward to Bob
    sendMessage('photons_received', {
      photons: resentPhotons,
      phase: 'photon_transmission'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Controls and Data */}
        <div className="space-y-6">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-red-400" />
              Eve's Control Panel
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interception Mode
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setInterceptionMode('automatic')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      interceptionMode === 'automatic'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Automatic
                  </button>
                  <button
                    onClick={() => setInterceptionMode('manual')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      interceptionMode === 'manual'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={generateEveBases}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Bases
                </button>
                <button
                  onClick={interceptPhotons}
                  disabled={!sessionData.photons || hasIntercepted}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                    !sessionData.photons || hasIntercepted
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {hasIntercepted ? 'Intercepted!' : 'Intercept'}
                </button>
              </div>

              <button
                onClick={resendPhotons}
                disabled={!hasIntercepted}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                  !hasIntercepted
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Resend Photons
              </button>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4">Eve's Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Photons Available:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sessionData.photons ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {sessionData.photons ? 'YES' : 'NO'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Interception Bases:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  eveBases.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {eveBases.length > 0 ? 'GENERATED' : 'PENDING'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Intercepted:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  hasIntercepted ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {hasIntercepted ? 'YES' : 'NO'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Eve's Data Display */}
          <AnimatePresence>
            {eveBases.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-white mb-4">Eve's Interception Data</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Interception Bases</h4>
                    <div className="flex flex-wrap gap-1">
                      {eveBases.map((base, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-sm font-mono ${
                            base === 0 ? 'bg-purple-600 text-white' : 'bg-yellow-600 text-white'
                          }`}
                        >
                          {base === 0 ? 'R' : 'D'}
                        </span>
                      ))}
                    </div>
                  </div>
                  {eveMeasurements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Intercepted Bits</h4>
                      <div className="flex flex-wrap gap-1">
                        {eveMeasurements.map((bit, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-sm font-mono ${
                              bit === 0 ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                            }`}
                          >
                            {bit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Impact Analysis */}
          {sessionData.qber > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Attack Impact</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">QBER Increase:</span>
                  <span className={`font-semibold ${
                    sessionData.qber < 0.1 ? 'text-green-400' :
                    sessionData.qber < 0.3 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {(sessionData.qber * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Detection Risk:</span>
                  <span className={`font-semibold ${
                    sessionData.qber < 0.1 ? 'text-green-400' :
                    sessionData.qber < 0.3 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {sessionData.qber < 0.1 ? 'LOW' :
                     sessionData.qber < 0.3 ? 'MEDIUM' : 'HIGH'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column - Visualizations */}
        <div className="space-y-6">
          {/* Quantum Channel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4">Quantum Channel (Eve's View)</h3>
            <PhotonVisualization
              photons={sessionData.photons || []}
              isTransmitting={hasIntercepted}
              userType="eve"
              interceptedPhotons={interceptedPhotons}
            />
          </motion.div>

          {/* Interception Visualization */}
          {hasIntercepted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Interception Analysis</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-300">
                  <p className="mb-2">Eve intercepted photons and measured them with her bases.</p>
                  <p className="mb-2">Due to quantum uncertainty, Eve's measurements introduce errors.</p>
                  <p>These errors will be detected by Alice and Bob during basis comparison.</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">⚠️ Interception Detected</h4>
                  <p className="text-red-300 text-sm">
                    The increased QBER indicates Eve's presence in the quantum channel.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EveInterface;
