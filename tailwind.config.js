/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A1A',
        surface: '#121212',
        accent: '#FF6F00',
        'accent-hover': '#FF8C1A',
        white: '#FFFFFF',
        border: '#333333',
        muted: '#555555',
        'text-main': '#E0E0E0',
        'text-subtle': '#BBBBBB',
      },
      fontFamily: {
        heading: ['Oswald', 'Rajdhani', 'Inter', 'sans-serif'],
        body: ['Inter', 'Rajdhani', 'sans-serif'],
      },
      fontSize: {
        hero: '72px',
        h1: '48px',
        h2: '36px',
        h3: '24px',
        body: '16px',
        small: '14px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
      },
      borderRadius: {
        lg: '16px',
        sm: '6px',
      },
    },
  },
  plugins: [],
};
