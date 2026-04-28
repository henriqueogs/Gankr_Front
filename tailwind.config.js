/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        midnight: {
          50: "#f5f6fb",
          100: "#e0e4ff",
          200: "#bac0ff",
          300: "#8d97ff",
          400: "#6771f6",
          500: "#4c55de",
          600: "#373db6",
          700: "#262a84",
          800: "#15194f",
          900: "#090c2b",
          950: "#050814",
        },
        nebula: {
          100: "#e2f1ff",
          200: "#bcd9ff",
          300: "#8fbaff",
          400: "#6a9bff",
          500: "#527ef4",
          600: "#3f63d3",
          700: "#2d47a5",
          800: "#1b2d71",
          900: "#0d163e",
        },
        aurum: {
          200: "#fff1c6",
          300: "#fee29a",
          400: "#fcd77f",
          500: "#f4be4e",
        },
      },
      boxShadow: {
        glow: "0 20px 45px rgba(124, 58, 237, 0.35)",
        soft: "0 10px 35px rgba(5, 8, 20, 0.55)",
      },
      borderRadius: {
        shell: "32px",
      },
      spacing: {
        18: "4.5rem",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
