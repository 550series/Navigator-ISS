/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        space: {
          950: "#060a12",
          900: "#0a0e17",
          800: "#0c1e3a",
          700: "#112240",
          600: "#1a3355",
          500: "#234568",
          400: "#2d5a8a",
        },
        cyber: {
          blue: "#00d4ff",
          "blue-dim": "#00a8cc",
          amber: "#ff8c00",
          "amber-dim": "#cc7000",
          red: "#ff3b3b",
          "red-dim": "#cc2f2f",
          green: "#00ff88",
          "green-dim": "#00cc6d",
          purple: "#a855f7",
          cyan: "#22d3ee",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan-line": "scan-line 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "data-flow": "data-flow 3s linear infinite",
        "blink": "blink 1s step-end infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "border-flow": "border-flow 4s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "rotate-slow": "rotate 20s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "data-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.2), inset 0 0 5px rgba(0, 212, 255, 0.1)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.4), inset 0 0 10px rgba(0, 212, 255, 0.2)" },
        },
        "border-flow": {
          "0%": { borderColor: "rgba(0, 212, 255, 0.3)" },
          "50%": { borderColor: "rgba(0, 212, 255, 0.6)" },
          "100%": { borderColor: "rgba(0, 212, 255, 0.3)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at center, rgba(0,212,255,0.1) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-sm": "0 0 5px rgba(0, 212, 255, 0.15)",
        "glow-md": "0 0 10px rgba(0, 212, 255, 0.2)",
        "glow-lg": "0 0 20px rgba(0, 212, 255, 0.3)",
        "glow-amber": "0 0 10px rgba(255, 140, 0, 0.2)",
        "glow-red": "0 0 10px rgba(255, 59, 59, 0.2)",
        "glow-green": "0 0 10px rgba(0, 255, 136, 0.2)",
        "inner-glow": "inset 0 0 10px rgba(0, 212, 255, 0.1)",
      },
    },
  },
  plugins: [],
};
