/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pride: {
          black: "#080809",
          blackLight: "#0f0f12",
          graphite: {
            900: "#141418",
            800: "#1a1a21",
            700: "#24242c",
            600: "#32323c",
            500: "#444452",
          },
          red: {
            DEFAULT: "#dc2626",
            glow: "#ff1e27",
            dark: "#991b1b",
            crimson: "#b91c1c",
            deep: "#450a0a",
          },
          gold: {
            DEFAULT: "#d97706",
            muted: "#92400e",
          },
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 0 25px -5px rgba(220, 38, 38, 0.45)',
        'red-glow-lg': '0 0 45px -5px rgba(220, 38, 38, 0.65)',
        'red-inner': 'inset 0 0 20px rgba(220, 38, 38, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
