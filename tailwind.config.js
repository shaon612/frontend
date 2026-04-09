/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // বাংলা ফন্ট সাপোর্ট
        bangla: ['Hind Siliguri', 'Noto Sans Bengali', 'sans-serif'],
      },
      colors: {
        fuel: {
          green: '#16a34a',
          red: '#dc2626',
          yellow: '#ca8a04',
          orange: '#ea580c',
          blue: '#1d4ed8',
          bg: '#f0fdf4',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
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
      },
    },
  },
  plugins: [],
}
