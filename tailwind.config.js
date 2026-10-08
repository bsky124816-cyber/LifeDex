/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          darkest: '#05110a',
          darker: '#0a1e13',
          dark: '#0f2f1f',
          surface: '#143826',
          card: '#0f2419',
          border: '#1d4833',
          accent: '#10b981',
          neon: '#00ff87',
          glow: '#34d399',
        },
        cyber: {
          dark: '#090d16',
          panel: '#0f172a',
          border: '#1e293b',
          blue: '#0284c7',
          cyan: '#06b6d4',
          neonCyan: '#00f2ff',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'scan-line': 'scanLine 2.2s ease-in-out infinite',
        'radar-spin': 'radarSpin 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'hologram': 'hologram 4s ease-in-out infinite alternate',
      },
      keyframes: {
        scanLine: {
          '0%': { top: '0%', opacity: '0.9' },
          '50%': { top: '96%', opacity: '0.9' },
          '100%': { top: '0%', opacity: '0.9' },
        },
        radarSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hologram: {
          '0%': { filter: 'drop-shadow(0 0 10px rgba(0,255,135,0.4))' },
          '100%': { filter: 'drop-shadow(0 0 24px rgba(6,182,212,0.6))' },
        }
      },
      boxShadow: {
        'neon-green': '0 0 25px -5px rgba(0, 255, 135, 0.4)',
        'neon-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
