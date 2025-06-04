/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter var',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66abff',
          400: '#338fff',
          500: '#0073ff',
          600: '#005ccc',
          700: '#004599',
          800: '#002e66',
          900: '#001733',
        },
        accent: {
          50: '#f2e6ff',
          100: '#e6ccff',
          200: '#cc99ff',
          300: '#b366ff',
          400: '#9933ff',
          500: '#8000ff',
          600: '#6600cc',
          700: '#4d0099',
          800: '#330066',
          900: '#1a0033',
        },
        success: {
          50: '#e6fff0',
          100: '#ccffe0',
          200: '#99ffc2',
          300: '#66ffa3',
          400: '#33ff85',
          500: '#00ff66',
          600: '#00cc52',
          700: '#00993d',
          800: '#006629',
          900: '#003314',
        },
        warning: {
          50: '#fff8e6',
          100: '#fff1cc',
          200: '#ffe399',
          300: '#ffd466',
          400: '#ffc633',
          500: '#ffb800',
          600: '#cc9300',
          700: '#996e00',
          800: '#664a00',
          900: '#332500',
        },
        error: {
          50: '#ffe6e6',
          100: '#ffcccc',
          200: '#ff9999',
          300: '#ff6666',
          400: '#ff3333',
          500: '#ff0000',
          600: '#cc0000',
          700: '#990000',
          800: '#660000',
          900: '#330000',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'glow': '0 0 15px 2px rgba(0, 115, 255, 0.4)',
        'glow-accent': '0 0 15px 2px rgba(128, 0, 255, 0.4)',
      },
    },
  },
  plugins: [],
};