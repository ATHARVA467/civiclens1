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
          surface: '#F1F3EF',
          card: '#FFFFFF',
          navy: '#294563',
          slate: '#7189A4',
          sage: '#7C9B85',
          text: '#253342',
          muted: '#687887',
          border: '#E7E9E5',
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
        },
        cyber: {
          bg: '#070B14',
          surface: '#0B0F19',
          card: '#0E1726',
          border: '#1E293B',
          glow: 'rgba(6, 182, 212, 0.25)',
          cyan: '#06B6D4',
          electric: '#38BDF8',
          violet: '#8B5CF6',
          purple: '#A855F7',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          text: '#F3F4F6',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Kannada', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Manrope', 'Inter', 'sans-serif'],
        kannada: ['Noto Sans Kannada', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '2px 2px 6px rgba(41, 69, 99, 0.04), -2px -2px 6px rgba(255, 255, 255, 0.9)',
        'soft': '4px 4px 12px rgba(41, 69, 99, 0.05), -4px -4px 12px rgba(255, 255, 255, 0.85)',
        'soft-lg': '6px 6px 18px rgba(41, 69, 99, 0.06), -6px -6px 18px rgba(255, 255, 255, 0.9)',
        'soft-inset': 'inset 2px 2px 5px rgba(41, 69, 99, 0.06), inset -2px -2px 5px rgba(255, 255, 255, 0.8)',
        'admin-card': '0 4px 12px rgba(0, 0, 0, 0.25)',
        'cyber-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(56, 189, 248, 0.12)',
        'cyber-glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'cyber-glow-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
        'cyber-glow-electric': '0 0 25px rgba(56, 189, 248, 0.4)',
      }
    },
  },
  plugins: [],
}

