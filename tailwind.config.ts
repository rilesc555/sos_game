import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'animate-score-pulse-single',
    'animate-score-pulse-double'
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'sos-flash': {
          '0%': { transform: 'scale(1.1)', opacity: '0' },
          '20%': { transform: 'scale(1.05)', opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' }
        },
        'score-pulse-single': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' }
        },
        'score-pulse-double': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '20%': { transform: 'scale(1.03)', boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
          '40%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
          '60%': { transform: 'scale(1.05)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)' },
          '80%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' }
        }
      },
      animation: {
        'sos-flash': 'sos-flash 1s ease-in-out forwards',
        'score-pulse-single': 'score-pulse-single 0.5s ease-in-out',
        'score-pulse-double': 'score-pulse-double 1s ease-in-out'
      }
    },
  },
  plugins: [],
} satisfies Config;
