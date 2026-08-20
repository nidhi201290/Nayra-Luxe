/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      screens: {
        tablet: '481px',
        desktop: '1025px',
      },
      colors: {
        gold: { primary: '#AA7717', light: '#D49B33' },
        ink: '#000000',
        ivory: '#FAF5EC',
        charcoal: { DEFAULT: '#2B2B2B', muted: '#6B6B6B' },
        border: '#E7DFD1',
        blush: '#F4E3D8',
        success: '#3F7D58',
        error: '#B3261E',
        sale: '#B3261E',
        warning: '#B8860B',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-sora)', '-apple-system', 'sans-serif'],
        body: ['var(--font-fira-sans)', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Sizes/weights matched against mehere.shop's live computed styles (Sora headings, Fira Sans body)
        display: ['3rem', { lineHeight: '1.5', fontWeight: '700' }],
        h1: ['2.25rem', { lineHeight: '1.5', fontWeight: '700' }],
        h2: ['1.75rem', { lineHeight: '1.4', fontWeight: '700' }],
        h3: ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        h4: ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.5', fontWeight: '500' }],
        button: ['0.875rem', { lineHeight: '1', fontWeight: '600' }],
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(43,43,43,0.06)',
        md: '0 4px 12px rgba(43,43,43,0.10)',
        lg: '0 12px 32px rgba(43,43,43,0.14)',
      },
      maxWidth: {
        content: '1280px',
      },
      transitionDuration: {
        DEFAULT: '220ms',
      },
    },
  },
  plugins: [],
};
