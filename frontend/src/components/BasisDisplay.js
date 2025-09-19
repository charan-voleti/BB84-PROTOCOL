import React from 'react';
import { motion } from 'framer-motion';

const BasisDisplay = ({ aliceBases, bobBases, matchedIndices }) => {
  const getBasisSymbol = (base) => base === 0 ? 'R' : 'D';
  const getBasisColor = (base) => base === 0 ? 'bg-blue-500' : 'bg-purple-500';
  const getBasisName = (base) => base === 0 ? 'Rectilinear' : 'Diagonal';

  return (
    <div className="space-y-4">
      {/* Alice's Bases */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Alice's Bases</h4>
        <div className="flex flex-wrap gap-1">
          {aliceBases.map((base, index) => (
            <motion.div
              key={`alice-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`px-3 py-2 rounded text-sm font-mono font-semibold ${
                matchedIndices.includes(index) 
                  ? 'bg-green-500 ring-2 ring-green-300' 
                  : getBasisColor(base)
              } text-white`}
              title={`Position ${index}: ${getBasisName(base)}`}
            >
              {getBasisSymbol(base)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bob's Bases */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Bob's Bases</h4>
        <div className="flex flex-wrap gap-1">
          {bobBases.map((base, index) => (
            <motion.div
              key={`bob-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`px-3 py-2 rounded text-sm font-mono font-semibold ${
                matchedIndices.includes(index) 
                  ? 'bg-green-500 ring-2 ring-green-300' 
                  : getBasisColor(base)
              } text-white`}
              title={`Position ${index}: ${getBasisName(base)}`}
            >
              {getBasisSymbol(base)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-4 text-xs text-gray-400">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Rectilinear (R)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Diagonal (D)</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded ring-2 ring-green-300"></div>
          <span>Matched</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-700 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Matched Bases:</span>
          <span className="text-green-400 font-semibold">
            {matchedIndices.length} / {aliceBases.length}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-300">Match Rate:</span>
          <span className="text-blue-400 font-semibold">
            {((matchedIndices.length / aliceBases.length) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BasisDisplay;
