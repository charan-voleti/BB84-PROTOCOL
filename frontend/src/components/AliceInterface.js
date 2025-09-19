import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Key, MessageSquare } from 'lucide-react';
import PhotonVisualization from './PhotonVisualization';
import BasisDisplay from './BasisDisplay';
import KeyDisplay from './KeyDisplay';
import MessageInterface from './MessageInterface';

const AliceInterface = ({ socket, sessionData, updateSession, sendMessage }) => {
  const [bits, setBits] = useState([]);
  const [bases, setBases] = useState([]);
  const [photonsSent, setPhotonsSent] = useState(false);
  const [eveProb, setEveProb] = useState(0.2);

  const generateBits = () => {
    const newBits = Array.from({ length: 20 }, () => Math.floor(Math.random() * 2));
    const newBases = Array.from({ length: 20 }, () => Math.floor(Math.random() * 2));
    setBits(newBits);
    setBases(newBases);
    setPhotonsSent(false);
    
    updateSession({
      aliceData: { ...sessionData.aliceData, bits: newBits, bases: newBases }
    });
  };

  const sendPhotons = () => {
    if (bits.length === 0) return;
    
    setPhotonsSent(true);
    sendMessage('alice_send_photons', {
      bits,
      bases,
      eve_prob: eveProb
    });
  };

  const resetSession = () => {
    setBits([]);
    setBases([]);
    setPhotonsSent(false);
    sendMessage('session_reset', {});
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
              <Key className="w-6 h-6 mr-2 text-blue-400" />
              Alice's Control Panel
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Eve Interception Probability
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={eveProb}
                  onChange={(e) => setEveProb(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span className="font-medium">{Math.round(eveProb * 100)}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={generateBits}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Bits
                </button>
                <button
                  onClick={resetSession}
                  className="btn-secondary flex-1"
                >
                  Reset Session
                </button>
              </div>

              <button
                onClick={sendPhotons}
                disabled={bits.length === 0 || photonsSent}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center ${
                  bits.length === 0 || photonsSent
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Send className="w-4 h-4 mr-2" />
                {photonsSent ? 'Photons Sent!' : 'Send Photons'}
              </button>
            </div>
          </motion.div>

          {/* Generated Data Display */}
          <AnimatePresence>
            {bits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card"
              >
                <h3 className="text-xl font-bold text-white mb-4">Generated Data</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Bits</h4>
                    <div className="flex flex-wrap gap-1">
                      {bits.map((bit, index) => (
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
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Bases</h4>
                    <div className="flex flex-wrap gap-1">
                      {bases.map((base, index) => (
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
              isTransmitting={photonsSent}
              userType="alice"
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
          {sessionData.aliceData.finalKey.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-4">Final Key</h3>
              <KeyDisplay
                siftedKey={sessionData.aliceData.siftedKey}
                finalKey={sessionData.aliceData.finalKey}
                qber={sessionData.qber}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Message Interface */}
      {sessionData.aliceData.finalKey.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <MessageInterface
            userType="alice"
            finalKey={sessionData.aliceData.finalKey}
            messages={sessionData.messages}
            onSendMessage={(message) => sendMessage('send_message', {
              sender: 'alice',
              content: message,
              encrypted: true
            })}
          />
        </motion.div>
      )}
    </div>
  );
};

export default AliceInterface;
