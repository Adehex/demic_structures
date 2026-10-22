export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        // "ink" is the brand's dark tone — now a deep forest green instead of black.
        ink: {
          950: '#0B2A1F',
          900: '#103A2B',
          800: '#174636',
          700: '#2A5A49',
          600: '#4A6B5E',
          400: '#88A497',
        },
        // Warm, faintly sage-tinted neutrals so light sections sit with the greens.
        bone: {
          50: '#FAFBF7',
          100: '#EEF3EB',
          200: '#DAE3D5',
        },
        // Fresh mid-greens for accents and light feature bands.
        leaf: {
          DEFAULT: '#2F8A57',
          dark: '#1F6B41',
          soft: '#DDEEDF',
        },
        moss: {
          50: '#F1F6EF',
          100: '#E2ECDD',
          200: '#C6D8BF',
        },
        signal: {
          DEFAULT: '#F7B500',
          dark: '#B98600',
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
