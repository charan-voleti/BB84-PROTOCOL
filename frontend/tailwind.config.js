module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          blue: '#1e40af',
          purple: '#7c3aed',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
        }
      },
      animation: {
        'photon-travel': 'photon-travel 3s ease-in-out infinite',
        'pulse-quantum': 'pulse-quantum 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'photon-travel': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'pulse-quantum': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
