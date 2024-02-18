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
        },
        secondary: {
        },
        success: {
        },
        warning: {
        },
        error: {
        },
        neutral: {
        },

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
