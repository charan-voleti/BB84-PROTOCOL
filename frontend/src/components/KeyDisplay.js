import React from 'react';
import { motion } from 'framer-motion';

const KeyDisplay = ({ siftedKey, finalKey, qber }) => {
  const getBitColor = (bit) => bit === 0 ? 'bg-blue-600' : 'bg-red-600';

  return (
    <div className="space-y-4">
      {/* Sifted Key */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Sifted Key ({siftedKey.length} bits)
        </h4>
        <div className="flex flex-wrap gap-1">
          {siftedKey.map((bit, index) => (
            <motion.div
              key={`sifted-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`px-2 py-1 rounded text-sm font-mono font-semibold ${getBitColor(bit)} text-white`}
            >
              {bit}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final Key */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Final Key ({finalKey.length} bits)
        </h4>
        <div className="flex flex-wrap gap-1">
          {finalKey.map((bit, index) => (
            <motion.div
              key={`final-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`px-2 py-1 rounded text-sm font-mono font-semibold ${getBitColor(bit)} text-white ring-2 ring-green-300`}
            >
              {bit}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Statistics */}
      <div className="bg-gray-700 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Sifted Key Length:</span>
          <span className="text-blue-400 font-semibold">{siftedKey.length} bits</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Final Key Length:</span>
          <span className="text-green-400 font-semibold">{finalKey.length} bits</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Key Reduction:</span>
          <span className="text-yellow-400 font-semibold">
            {siftedKey.length > 0 ? (((siftedKey.length - finalKey.length) / siftedKey.length) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">QBER:</span>
          <span className={`font-semibold ${
            qber < 0.1 ? 'text-green-400' :
            qber < 0.3 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {(qber * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Key Quality Indicator */}
      <div className={`rounded-lg p-3 ${
        qber < 0.1 ? 'bg-green-900/20 border border-green-500/30' :
        qber < 0.3 ? 'bg-yellow-900/20 border border-yellow-500/30' :
        'bg-red-900/20 border border-red-500/30'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            qber < 0.1 ? 'bg-green-400' :
            qber < 0.3 ? 'bg-yellow-400' : 'bg-red-400'
          }`}></div>
          <span className={`font-semibold ${
            qber < 0.1 ? 'text-green-400' :
            qber < 0.3 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {qber < 0.1 ? 'High Quality Key' :
             qber < 0.3 ? 'Medium Quality Key' : 'Low Quality Key'}
          </span>
        </div>
        <p className={`text-sm mt-1 ${
          qber < 0.1 ? 'text-green-300' :
          qber < 0.3 ? 'text-yellow-300' : 'text-red-300'
        }`}>
          {qber < 0.1 ? 'Key is suitable for secure communication' :
           qber < 0.3 ? 'Key may have some errors but is usable' :
           'Key has significant errors and may not be secure'}
        </p>
      </div>
    </div>
  );
};

export default KeyDisplay;
