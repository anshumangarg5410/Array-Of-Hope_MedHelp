/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#e2e8f0",
        skyglass: "#8ec5ff",
        mintglass: "#73f2c1",
        glow: "#7c9cff",
        blush: "#ff90b3",
      },
      fontFamily: {
        sans: ["Satoshi", "Inter", "system-ui", "sans-serif"],
        display: ["Clash Display", "Satoshi", "sans-serif"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(76, 123, 255, 0.18)",
        soft: "0 12px 40px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 20% 20%, rgba(125, 211, 252, 0.22), transparent 30%), radial-gradient(circle at 80% 0%, rgba(129, 140, 248, 0.18), transparent 28%), radial-gradient(circle at 50% 80%, rgba(74, 222, 128, 0.12), transparent 30%)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
        slideUp: "slideUp 0.7s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
