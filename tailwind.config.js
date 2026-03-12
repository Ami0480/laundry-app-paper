/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          50:  '#fafaf8',
          100: '#f5f4f0',
          200: '#eceae3',
          300: '#dddad0',
        },
        ink: {
          DEFAULT: '#0f0f0f',
          muted: '#6b6b6b',
          light: '#a3a3a3',
        },
      },
      boxShadow: {
        paper: '2px 4px 16px 0 rgba(0,0,0,0.06)',
        'paper-lg': '4px 8px 32px 0 rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}
