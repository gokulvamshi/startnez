/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Design System: DevMatch Modern / HackConnect tokens
        primary: {
          DEFAULT: '#2563eb', // Interactive Blue
          hover: '#1d4ed8',
          subtle: '#eff6ff',
          deep: '#004ac6',
          container: '#2563eb',
          'on-container': '#eeefff'
        },
        secondary: {
          DEFAULT: '#10b981', // Vibrant Emerald (Online/Matched)
          hover: '#059669',
          subtle: '#ecfdf5',
          dark: '#006c49'
        },
        tertiary: {
          DEFAULT: '#6366f1', // Indigo / Pitch / High value
          subtle: '#f5f3ff',
          deep: '#3e3fcc'
        },
        canvas: {
          light: '#f8fafc',
          dark: '#090d16'
        },
        surface: {
          light: '#ffffff',
          'light-muted': '#f1f5f9',
          'light-border': '#e2e8f0',
          dark: '#0f172a',
          'dark-muted': '#1e293b',
          'dark-border': '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        headline: ['Geist', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px'
      },
      boxShadow: {
        'level-1': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'level-2': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'level-3': '0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)',
        'dark-1': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'dark-2': '0 4px 12px -2px rgba(0, 0, 0, 0.6)',
        'dark-3': '0 16px 36px -6px rgba(0, 0, 0, 0.8)'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
