/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-delay': 'fadeIn 1s ease-out 0.3s forwards',
        'fade-in-delay-2': 'fadeIn 1s ease-out 0.4s forwards',
        'slide-up': 'slideUp 1s ease-out forwards',
        'slide-up-delay': 'slideUp 1s ease-out 0.1s forwards',
        'title-fill': 'titleFill 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        titleFill: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'custom-bezier': 'cubic-bezier(0.17, 0.85, 0.438, 0.99)',
        'smooth-bezier': 'cubic-bezier(0.225, 1, 0.316, 0.99)',
      },
    },
  },
  safelist: [
    'w-[2px]',
    'h-[2px]',
    'w-[1px]',
    'h-[1px]',
    { pattern: /w-\[.+\]/ },
    { pattern: /h-\[.+\]/ }
  ],
  fontFamily: {
    oswald: ['Oswald', 'sans-serif'],
    openSans: ['Open Sans', 'sans-serif'],
  },
  plugins: [],
};
export default config;
