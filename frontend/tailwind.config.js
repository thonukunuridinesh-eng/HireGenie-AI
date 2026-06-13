/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca"
        },
        dark: {
          950: "#020617",
          900: "#0f172a",
          800: "#1e293b"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.35)",
        soft: "0 20px 60px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        "premium-gradient":
          "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 32%), radial-gradient(circle at top right, rgba(14,165,233,0.22), transparent 30%), linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)"
      }
    }
  },
  plugins: []
};