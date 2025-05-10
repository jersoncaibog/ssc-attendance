/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sscTheme: '#006B65',
        border: {
          light: '#E5E5E5',
          dark: '#BBBBBB',
          focus: '#545454'
        },
        header: '#4C4C4C',
        background: {
          light: '#F3F4F8',
          dark: '#E3E5EA'
        },
        button_primary: '#363636',
        textbox: {
          placeholder: '#8B8B8B'
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 