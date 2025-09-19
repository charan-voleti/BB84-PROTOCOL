import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, Unlock, MessageSquare } from 'lucide-react';

const MessageInterface = ({ userType, finalKey, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(true);

  const encryptMessage = (message, key) => {
    if (!isEncrypted || key.length === 0) return message;
    
    // Simple XOR encryption using the final key
    let encrypted = '';
    let keyIndex = 0;
    
    for (let i = 0; i < message.length; i++) {
      const charCode = message.charCodeAt(i);
      const keyBit = key[keyIndex % key.length];
      encrypted += String.fromCharCode(charCode ^ keyBit);
      keyIndex++;
    }
    
    return btoa(encrypted); // Base64 encode
  };

  const decryptMessage = (encryptedMessage, key) => {
    if (key.length === 0) return encryptedMessage;
    
    try {
      const decoded = atob(encryptedMessage); // Base64 decode
      let decrypted = '';
      let keyIndex = 0;
      
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyBit = key[keyIndex % key.length];
        decrypted += String.fromCharCode(charCode ^ keyBit);
        keyIndex++;
      }
      
      return decrypted;
    } catch (error) {
      return encryptedMessage; // Return as-is if decryption fails
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const messageToSend = isEncrypted ? encryptMessage(newMessage, finalKey) : newMessage;
    onSendMessage(messageToSend);
    setNewMessage('');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <MessageSquare className="w-6 h-6 mr-2 text-blue-400" />
        Secure Messaging
      </h2>

      {/* Encryption Toggle */}
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isEncrypted}
            onChange={(e) => setIsEncrypted(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-300 flex items-center">
            {isEncrypted ? (
              <>
                <Lock className="w-4 h-4 mr-1 text-green-400" />
                Encrypt with OTP
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-1 text-yellow-400" />
                Send Plain Text
              </>
            )}
          </span>
        </label>
      </div>

      {/* Message Input */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center ${
              !newMessage.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Send className="w-4 h-4 mr-1" />
            Send
          </button>
        </div>
      </div>

      {/* Messages Display */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 rounded-lg ${
                message.sender === userType
                  ? 'bg-blue-600 ml-8'
                  : 'bg-gray-700 mr-8'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-gray-300">
                  {message.sender.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <div className="text-white">
                {message.encrypted && message.sender !== userType
                  ? decryptMessage(message.content, finalKey)
                  : message.content
                }
              </div>
              {message.encrypted && (
                <div className="text-xs text-gray-400 mt-1 flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Encrypted with OTP
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No messages yet. Start a conversation!
          </div>
        )}
      </div>

      {/* Key Info */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Using Key:</span>
          <span className="text-blue-400 font-mono text-sm">
            {finalKey.slice(0, 8).join('')}...
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-300">Key Length:</span>
          <span className="text-green-400 font-semibold">{finalKey.length} bits</span>
        </div>
      </div>
    </div>
  );
};

export default MessageInterface;
