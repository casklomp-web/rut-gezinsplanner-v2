/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90A4',
          50: '#E8F4F6',
          100: '#D1E9ED',
          200: '#A3D3DB',
          300: '#75BDC9',
          400: '#4A90A4',
          500: '#3A7A8C',
          600: '#2A5A68',
          700: '#1A3A44',
          800: '#0A1A20',
          900: '#000000',
        },
        success: {
          DEFAULT: '#7CB342',
          50: '#F1F8E9',
          100: '#DcedC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#7CB342',
          500: '#689F38',
          600: '#558B2F',
          700: '#33691E',
        },
        background: '#F8F9FA',
        foreground: '#2D3436',
        muted: '#636E72',
        border: '#DFE6E9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
