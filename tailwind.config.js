/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apple-inspired color palette (Refined)
        primary: {
          50: '#F5F9FF', // Very subtle blue tint
          100: '#EBF5FF',
          200: '#D1E9FF',
          300: '#A6D6FF',
          400: '#7AB8FF',
          500: '#007AFF', // Apple System Blue
          600: '#0062CC',
          700: '#004999',
          800: '#003166',
          900: '#001833',
        },
        gray: {
          50: '#F5F5F7', // Apple System Gray 6 (Light)
          100: '#E5E5EA', // Apple System Gray 5 (Light)
          200: '#D1D1D6', // Apple System Gray 4 (Light)
          300: '#C7C7CC', // Apple System Gray 3 (Light)
          400: '#AEAEB2', // Apple System Gray 2 (Light)
          500: '#8E8E93', // Apple System Gray (Light)
          600: '#636366', // Apple System Gray (Dark)
          700: '#48484A', // Apple System Gray 2 (Dark)
          800: '#3A3A3C', // Apple System Gray 3 (Dark)
          900: '#1C1C1E', // Apple System Gray 6 (Dark)
        },
        accent: { // Teal/Green for success/growth
          50: '#F0FDF9',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        background: '#F5F5F7', // Apple Main Background
        surface: '#FFFFFF',
        danger: '#FF3B30', // Apple Red
        warning: '#FF9500', // Apple Orange
        success: '#34C759', // Apple Green
        info: '#5AC8FA',    // Apple Blue/Cyan
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['SF Pro Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['80px', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-2': ['64px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-3': ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-1': ['28px', { lineHeight: '1.2', letterSpacing: '0', fontWeight: '600' }],
        'title-2': ['22px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'title-3': ['20px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '400' }],
        'callout': ['16px', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '400' }],
        'subhead': ['15px', { lineHeight: '1.5', letterSpacing: '-0.01em', fontWeight: '500' }],
        'footnote': ['13px', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '400' }],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '18px', // Apple-like curvature
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'apple': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'apple-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'apple-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
        xl: '20px',
        '2xl': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}; 