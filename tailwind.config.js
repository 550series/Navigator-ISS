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
          950: "#050810",
          900: "#0a0e17",
          850: "#0d1525",
          800: "#0c1e3a",
          700: "#112240",
          600: "#1a3355",
          500: "#234568",
          400: "#2d5a8a",
          300: "#3a7ab5",
        },
        cyber: {
          blue: "#00d4ff",
          "blue-light": "#33ddff",
          "blue-dim": "#00a8cc",
          "blue-deep": "#006680",
          amber: "#ff8c00",
          "amber-light": "#ffa333",
          "amber-dim": "#cc7000",
          red: "#ff3b3b",
          "red-light": "#ff6666",
          "red-dim": "#cc2f2f",
          green: "#00ff88",
          "green-light": "#33ffaa",
          "green-dim": "#00cc6d",
          purple: "#a855f7",
          "purple-light": "#c084fc",
          cyan: "#22d3ee",
          "cyan-light": "#67e8f9",
        },
        holo: {
          blue: "rgba(0, 212, 255, 0.1)",
          amber: "rgba(255, 140, 0, 0.1)",
          red: "rgba(255, 59, 59, 0.1)",
          green: "rgba(0, 255, 136, 0.1)",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
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
        "shimmer": "shimmer 2s linear infinite",
        "hologram": "hologram 4s ease-in-out infinite",
        "matrix": "matrix 0.5s linear infinite",
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
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "hologram": {
          "0%, 100%": { opacity: "0.8", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(-2px)" },
        },
        "matrix": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 -100%" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at center, rgba(0,212,255,0.08) 0%, transparent 70%)",
        "conic-glow": "conic-gradient(from 0deg, transparent, rgba(0,212,255,0.1), transparent)",
        "shimmer": "linear-gradient(90deg, transparent, rgba(0,212,255,0.05), transparent)",
      },
      boxShadow: {
        "glow-xs": "0 0 3px rgba(0, 212, 255, 0.1)",
        "glow-sm": "0 0 5px rgba(0, 212, 255, 0.15)",
        "glow-md": "0 0 10px rgba(0, 212, 255, 0.2)",
        "glow-lg": "0 0 20px rgba(0, 212, 255, 0.25)",
        "glow-xl": "0 0 30px rgba(0, 212, 255, 0.3)",
        "glow-amber": "0 0 10px rgba(255, 140, 0, 0.2)",
        "glow-red": "0 0 10px rgba(255, 59, 59, 0.2)",
        "glow-green": "0 0 10px rgba(0, 255, 136, 0.2)",
        "glow-purple": "0 0 10px rgba(168, 85, 247, 0.2)",
        "inner-glow": "inset 0 0 10px rgba(0, 212, 255, 0.1)",
        "inner-glow-sm": "inset 0 0 5px rgba(0, 212, 255, 0.08)",
        "neon": "0 0 5px rgba(0, 212, 255, 0.5), 0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)",
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
