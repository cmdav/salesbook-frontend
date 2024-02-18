/* eslint-disable no-undef */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Poppins']
      },
      colors: {
        brand: '#C35214',
        primary: {
          100: '#c35214',
          200: '#b04a12',
          300: '#9c4210',
          400: '#89390e',
          500: '#75310c',
          600: '#62290a',
          700: '#4e2108',
          800: '#3a1906',
          900: '#271004',
          1000: '#130802',
          1100: '#000000'
        },
        secondary: {
          100: '#c35214',
          200: '#c9632c',
          300: '#cf7543',
          400: '#d5865b',
          500: '#db9772',
          600: '#e1a98a',
          700: '#e7baa1',
          800: '#edcbb9',
          900: '#f3dcd0',
          1000: '#f9eee8',
          1100: '#ffffff'
        },
        success: {},
        warning: {},
        error: {},
        neutral: {},

        shades: {
          white: '#FFFFFFF',
          black: '#000000'
        },
        text: {
          white: {
            100: '#FFFFFF',
            200: '#C2C2C4',
            300: '#9D9EA1'
          },
          black: {
            100: '#1D2433',
            200: '#98A2B3',
            300: '#D0D5DD'
          }
        }
      },
      utilities: {
        '.tick': {
          display: 'inline-block',
          width: '1.55rem',
          height: '0.5rem',
          border: '2px solid currentColor',
          borderTop: 'none',
          borderRight: 'none',
          transform: 'rotate(-45deg)',
          marginRight: '0.25rem'
        }
      }
    }
  },
  plugins: []
}
