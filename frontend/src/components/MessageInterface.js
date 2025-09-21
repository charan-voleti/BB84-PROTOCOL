import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lock, Unlock, MessageSquare, Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const MessageInterface = ({ userType, finalKey, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [encryptionStatus, setEncryptionStatus] = useState('idle'); // idle, encrypting, success, error
  const [keyUsage, setKeyUsage] = useState(0);

  const encryptMessage = (message, key) => {
    if (!isEncrypted || key.length === 0) return message;
    
    setEncryptionStatus('encrypting');
    
    try {
      // Convert message to bytes
      const messageBytes = new TextEncoder().encode(message);
      const encryptedBytes = new Uint8Array(messageBytes.length);
      let keyIndex = 0;
      
      for (let i = 0; i < messageBytes.length; i++) {
        // XOR each byte with key bits (cycling through key)
        let keyByte = 0;
        for (let bitPos = 0; bitPos < 8; bitPos++) {
          if (keyIndex < key.length) {
            keyByte |= (key[keyIndex] << bitPos);
            keyIndex++;
          } else {
            keyIndex = 0;
            keyByte |= (key[keyIndex] << bitPos);
            keyIndex++;
          }
        }
        encryptedBytes[i] = messageBytes[i] ^ keyByte;
      }
      
      // Convert to base64
      const encryptedString = btoa(String.fromCharCode(...encryptedBytes));
      setEncryptionStatus('success');
      setKeyUsage(key.length);
      
      // Reset status after animation
      setTimeout(() => setEncryptionStatus('idle'), 2000);
      
      return encryptedString;
    } catch (error) {
      setEncryptionStatus('error');
      setTimeout(() => setEncryptionStatus('idle'), 2000);
      return message;
    }
  };

  const decryptMessage = (encryptedMessage, key) => {
    if (key.length === 0) return encryptedMessage;
    
    try {
      // Decode base64
      const encryptedBytes = new Uint8Array(
        atob(encryptedMessage).split('').map(char => char.charCodeAt(0))
      );
      const decryptedBytes = new Uint8Array(encryptedBytes.length);
      let keyIndex = 0;
      
      for (let i = 0; i < encryptedBytes.length; i++) {
        // XOR each byte with key bits (cycling through key)
        let keyByte = 0;
        for (let bitPos = 0; bitPos < 8; bitPos++) {
          if (keyIndex < key.length) {
            keyByte |= (key[keyIndex] << bitPos);
            keyIndex++;
          } else {
            keyIndex = 0;
            keyByte |= (key[keyIndex] << bitPos);
            keyIndex++;
          }
        }
        decryptedBytes[i] = encryptedBytes[i] ^ keyByte;
      }
      
      return new TextDecoder().decode(decryptedBytes);
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
        <motion.div
          animate={{ rotate: encryptionStatus === 'encrypting' ? 360 : 0 }}
          transition={{ duration: 1, repeat: encryptionStatus === 'encrypting' ? Infinity : 0 }}
          className="ml-2"
        >
          {encryptionStatus === 'encrypting' && <Zap className="w-5 h-5 text-yellow-400" />}
          {encryptionStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
          {encryptionStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
        </motion.div>
      </h2>

      {/* Encryption Status Indicator */}
      <AnimatePresence>
        {encryptionStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              encryptionStatus === 'success' ? 'bg-green-900/20 border border-green-500/30' :
              encryptionStatus === 'error' ? 'bg-red-900/20 border border-red-500/30' :
              'bg-yellow-900/20 border border-yellow-500/30'
            }`}
          >
            {encryptionStatus === 'encrypting' && (
              <>
                <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 font-semibold">Encrypting message...</span>
              </>
            )}
            {encryptionStatus === 'success' && (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">Message encrypted successfully!</span>
              </>
            )}
            {encryptionStatus === 'error' && (
              <>
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-semibold">Encryption failed!</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              key={message.message_id || index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-3 rounded-lg relative ${
                message.sender === userType
                  ? 'bg-blue-600 ml-8'
                  : 'bg-gray-700 mr-8'
              }`}
            >
              {/* Message Header */}
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-300">
                    {message.sender.toUpperCase()}
                  </span>
                  {message.encrypted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-1"
                    >
                      <Shield className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">SECURE</span>
                    </motion.div>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              
              {/* Message Content */}
              <div className="text-white">
                {message.encrypted && message.sender !== userType
                  ? decryptMessage(message.content, finalKey)
                  : message.content
                }
              </div>
              
              {/* Encryption Details */}
              {message.encrypted && (
                <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>OTP Encrypted</span>
                  </div>
                  {message.key_used && (
                    <div className="flex items-center space-x-1">
                      <span>Key: {message.key_used.length} bits</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Security Indicator */}
              {message.encrypted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-1 right-1"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8"
          >
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Start a conversation!</p>
            <p className="text-sm mt-2">Use the BB84 key to send encrypted messages</p>
          </motion.div>
        )}
      </div>

      {/* Key Info with LED Visualization */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-300">Quantum Key:</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {finalKey.slice(0, 8).map((bit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-3 h-3 rounded-full ${
                    bit === 0 ? 'bg-blue-500' : 'bg-red-500'
                  } shadow-lg`}
                  style={{
                    boxShadow: bit === 0 
                      ? '0 0 8px rgba(59, 130, 246, 0.6)' 
                      : '0 0 8px rgba(239, 68, 68, 0.6)'
                  }}
                />
              ))}
              {finalKey.length > 8 && (
                <span className="text-gray-400 text-xs ml-1">...</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Key Length:</span>
            <span className="text-green-400 font-semibold">{finalKey.length} bits</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Security:</span>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-semibold">QUANTUM</span>
            </div>
          </div>
        </div>
        
        {/* Key Usage Indicator */}
        {keyUsage > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 bg-green-900/20 border border-green-500/30 rounded-lg"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-400">Key Used:</span>
              <span className="text-green-300 font-semibold">{keyUsage} bits consumed</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MessageInterface;
