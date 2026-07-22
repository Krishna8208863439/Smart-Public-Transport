/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbff',
          100: '#d5f5ff',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        cyber: {
          bg: '#0B0F19',
          card: 'rgba(17, 24, 39, 0.75)',
          border: 'rgba(255, 255, 255, 0.1)',
          neonTeal: '#00F2FE',
          neonCyan: '#4FACFE',
          neonAmber: '#FFB199',
          neonGreen: '#00E676',
          neonPurple: '#A855F7',
          neonRed: '#FF2E93',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(79, 172, 254, 0.4)',
        'glow-teal': '0 0 20px rgba(0, 242, 254, 0.4)',
        'glow-green': '0 0 20px rgba(0, 230, 118, 0.4)',
        'glow-amber': '0 0 20px rgba(255, 177, 153, 0.4)',
        'glow-red': '0 0 25px rgba(255, 46, 147, 0.6)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'radar': 'radar 3s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
