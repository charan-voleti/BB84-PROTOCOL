import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import PhotonVisualization from './PhotonVisualization';
import BasisDisplay from './BasisDisplay';
import KeyDisplay from './KeyDisplay';
import MessageInterface from './MessageInterface';

const BobInterface = ({ socket, sessionData, updateSession, sendMessage }) => {
  const [measurementBases, setMeasurementBases] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [photonsReceived, setPhotonsReceived] = useState(false);
  const [basisComparisonDone, setBasisComparisonDone] = useState(false);

  const generateMeasurementBases = () => {
    const newBases = Array.from({ length: 20 }, () => Math.floor(Math.random() * 2));
    setMeasurementBases(newBases);
    
    updateSession({
      bobData: { ...sessionData.bobData, bases: newBases }
    });
  };

  const measurePhotons = () => {
    if (!sessionData.photons || sessionData.photons.length === 0) return;
    
    const newMeasurements = sessionData.photons.map((photon, index) => {
      const base = measurementBases[index];
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
    
    setMeasurements(newMeasurements);
    setPhotonsReceived(true);
    
    updateSession({
      bobData: { ...sessionData.bobData, measurements: newMeasurements }
    });
  };

  const performBasisComparison = () => {
    if (measurements.length === 0 || !sessionData.aliceData.bases) return;
    
    sendMessage('basis_comparison', {
      bob_bases: measurementBases,
      bob_measurements: measurements
    });
    
    setBasisComparisonDone(true);
  };

  useEffect(() => {
    if (sessionData.photons && sessionData.photons.length > 0 && !photonsReceived) {
      measurePhotons();
    }
  }, [sessionData.photons]);

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
              <Shield className="w-6 h-6 mr-2 text-green-400" />
              Bob's Control Panel
            </h2>
            
            <div className="space-y-4">
              <div className="flex space-x-3">
                <button
                  onClick={generateMeasurementBases}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Bases
                </button>
                <button
                  onClick={measurePhotons}
                  disabled={!sessionData.photons || photonsReceived}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                    !sessionData.photons || photonsReceived
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {photonsReceived ? 'Measured!' : 'Measure Photons'}
                </button>
              </div>

              <button
                onClick={performBasisComparison}
                disabled={measurements.length === 0 || basisComparisonDone}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                  measurements.length === 0 || basisComparisonDone
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {basisComparisonDone ? 'Comparison Done!' : 'Compare Bases'}
              </button>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Photons Received:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sessionData.photons ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {sessionData.photons ? 'YES' : 'NO'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Measurement Bases:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  measurementBases.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {measurementBases.length > 0 ? 'GENERATED' : 'PENDING'}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Measurements:</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  measurements.length > 0 ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {measurements.length > 0 ? 'COMPLETE' : 'PENDING'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Generated Data Display */}
          <AnimatePresence>
            {measurementBases.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-white mb-4">Bob's Data</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Measurement Bases</h4>
                    <div className="flex flex-wrap gap-1">
                      {measurementBases.map((base, index) => (
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
                  {measurements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Measurements</h4>
                      <div className="flex flex-wrap gap-1">
                        {measurements.map((measurement, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-sm font-mono ${
                              measurement === 0 ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
                            }`}
                          >
                            {measurement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Basis Comparison Results */}
          {sessionData.matchedIndices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Basis Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Matched Bases:</span>
                  <span className="text-green-400 font-semibold">
                    {sessionData.matchedIndices.length}/20
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">QBER:</span>
                  <span className={`font-semibold ${
                    sessionData.qber < 0.1 ? 'text-green-400' :
                    sessionData.qber < 0.3 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {(sessionData.qber * 100).toFixed(1)}%
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
            <h3 className="text-xl font-bold text-white mb-4">Quantum Channel</h3>
            <PhotonVisualization
              photons={sessionData.photons || []}
              isTransmitting={photonsReceived}
              userType="bob"
            />
          </motion.div>

          {/* Basis Display */}
          {sessionData.matchedIndices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Basis Matching</h3>
              <BasisDisplay
                aliceBases={sessionData.aliceData.bases}
                bobBases={sessionData.bobData.bases}
                matchedIndices={sessionData.matchedIndices}
              />
            </motion.div>
          )}

          {/* Key Display */}
          {sessionData.bobData.finalKey.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Final Key</h3>
              <KeyDisplay
                siftedKey={sessionData.bobData.siftedKey}
                finalKey={sessionData.bobData.finalKey}
                qber={sessionData.qber}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Message Interface */}
      {sessionData.bobData.finalKey.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <MessageInterface
            userType="bob"
            finalKey={sessionData.bobData.finalKey}
            messages={sessionData.messages}
            onSendMessage={(message) => sendMessage('send_message', {
              sender: 'bob',
              content: message,
              encrypted: true
            })}
          />
        </motion.div>
      )}
    </div>
  );
};

export default BobInterface;
