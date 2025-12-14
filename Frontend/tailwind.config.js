/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-smooth": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-50%)" },
        }
      },
      animation: {
        "bounce-smooth": "bounce-smooth 0.6s ease-in-out infinite",
        "bounce-smooth-200": "bounce-smooth 0.6s ease-in-out 0.2s infinite",
        "bounce-smooth-400": "bounce-smooth 0.6s ease-in-out 0.2s infinite",
      },
    },
  },
  plugins: [],
};
