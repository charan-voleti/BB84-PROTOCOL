import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Eye } from 'lucide-react';

const LoginScreen = ({ onUserSelect }) => {
  const users = [
    {
      id: 'alice',
      name: 'Alice',
      description: 'Quantum Key Sender',
      icon: User,
      color: 'blue',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'bob',
      name: 'Bob',
      description: 'Quantum Key Receiver',
      icon: Shield,
      color: 'green',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      id: 'eve',
      name: 'Eve',
      description: 'Quantum Eavesdropper',
      icon: Eye,
      color: 'red',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Role
        </h2>
        <p className="text-gray-300 text-lg">
          Select your character to participate in the BB84 Quantum Key Distribution protocol
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {users.map((user, index) => {
          const IconComponent = user.icon;
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => onUserSelect(user.id)}
            >
              <div className={`card ${user.hoverColor} transition-all duration-300 hover:shadow-2xl`}>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${user.bgColor} flex items-center justify-center`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {user.name}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {user.description}
                  </p>
                  <div className={`btn-primary ${user.bgColor} ${user.hoverColor} border-0`}>
                    Play as {user.name}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="card max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">
            How to Run Multi-User Demo
          </h3>
          <div className="text-left space-y-2 text-gray-300">
            <p>1. Start the backend server on one machine</p>
            <p>2. Open Alice interface: <code className="bg-gray-700 px-2 py-1 rounded">?user=alice</code></p>
            <p>3. Open Bob interface: <code className="bg-gray-700 px-2 py-1 rounded">?user=bob</code></p>
            <p>4. Open Eve interface: <code className="bg-gray-700 px-2 py-1 rounded">?user=eve</code></p>
            <p>5. All users will be synchronized in real-time via WebSocket</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
