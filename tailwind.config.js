export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0D0E0F',
          900: '#141516',
          800: '#1D1F21',
          700: '#2B2E31',
          600: '#4A4E52',
          400: '#8C9196',
        },
        bone: {
          50: '#FBFAF8',
          100: '#F4F2ED',
          200: '#E6E3DB',
        },
        signal: {
          DEFAULT: '#F7B500',
          dark: '#D19700',
          soft: '#FFF3D1',
        },
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
      maxWidth: {
        shell: '84rem',
      },
    },
  },
}
