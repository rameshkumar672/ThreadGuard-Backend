/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          900: '#060B14', // Very dark background
          800: '#0D1524', // Card background
          700: '#141F32', // Hover state
          600: '#1B2943', // Border color
          primary: '#00F0FF',    // Neon cyan
          secondary: '#7000FF',  // Neon purple
          danger: '#FF003C',     // Neon red
          success: '#00FF66',    // Neon green
          warning: '#FFD700',    // Neon yellow
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
