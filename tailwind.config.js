/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        civic: {
          bg: '#F8F8F5',
          card: '#FFFFFF',
          navy: '#294563',
          slate: '#7189A4',
          sage: '#7C9B85',
          text: '#263442',
          muted: '#687786',
          border: '#E3E7E8',
          surface: '#F0F2EF',
          success: '#4F8665',
          warning: '#B9853F',
          critical: '#B85D5D',
        },
        admin: {
          bg: '#111A24',
          sidebar: '#172332',
          card: '#1C2C3D',
          border: '#304153',
          text: '#F3F5F6',
          muted: '#A8B5C1',
          accent: '#8EA8C2',
          success: '#7C9B85',
          warning: '#D1A15D',
          critical: '#C77A7A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Kannada', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '2px 2px 6px rgba(41, 69, 99, 0.04), -2px -2px 6px rgba(255, 255, 255, 0.9)',
        'soft': '4px 4px 12px rgba(41, 69, 99, 0.05), -4px -4px 12px rgba(255, 255, 255, 0.85)',
        'soft-lg': '6px 6px 18px rgba(41, 69, 99, 0.06), -6px -6px 18px rgba(255, 255, 255, 0.9)',
        'soft-inset': 'inset 2px 2px 5px rgba(41, 69, 99, 0.06), inset -2px -2px 5px rgba(255, 255, 255, 0.8)',
        'admin-card': '0 4px 12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}

