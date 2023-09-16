/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "blob": {
          '0%': {
            transform: 'translate(0px, 0px) scale(1);'
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.2);'
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.8);'
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1);'
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "sliding-img-up-1": {
          '0%': {
            transform: 'translateY(0);'
          },
          '100%': {
            transform: 'translateY(-615px);'
          }
        },
        "sliding-img-up-2": {
          '0%': {
            transform: 'translateY(0);'
          },
          '100%': {
            transform: 'translateY(-928px);'
          }
        },
        "sliding-img-down-1": {
          '0%': {
            transform: 'translateY(-986px);'
          },
          '100%': {
            transform: 'translateY(0);'
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "sliding-img-up-1": "sliding-img-up-1 15s linear infinite",
        "sliding-img-down-1": "sliding-img-down-1 15s linear infinite",
        "sliding-img-up-2": "sliding-img-up-2 15s linear infinite",
        "blob": "blob 7s infinite"
      },
      textShadow: {
        '2xl': '0 0 10px rgba(255, 255, 255, 0.8), 0 0 1px rgba(255, 255, 255, 0.9)',
        '3xl': '0 0 20px rgba(255, 255, 255, 0.8), 0 0 3px rgba(255, 255, 255, 0.9)'
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('tailwindcss-textshadow')],
}