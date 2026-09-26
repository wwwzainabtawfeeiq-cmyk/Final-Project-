/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // هوية نكهة البصرة
        'dark-green': '#1B4332',
        'emerald-deep': '#0F2419',
        'gold': '#C9A227',
        'gold-bright': '#F5D76E',
        'cream': '#FAF6ED',
        'deep-black': '#0A0A0A',
      },
      fontFamily: {
        // العناوين الفخمة
        'ruqaa': ['Aref Ruqaa', 'serif'],
        // النصوص
        'tajawal': ['Tajawal', 'sans-serif'],
        // الأرقام
        'cairo': ['Cairo', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'shine': 'shine 3s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'slide-up-fade': 'slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 162, 39, 0.4), 0 0 40px rgba(201, 162, 39, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(201, 162, 39, 0.6), 0 0 60px rgba(201, 162, 39, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'gold': '0 0 25px rgba(201, 162, 39, 0.3)',
        'gold-lg': '0 0 50px rgba(201, 162, 39, 0.4)',
        'gold-sm': '0 0 15px rgba(201, 162, 39, 0.25)',
      },
    },
  },
  plugins: [],
};
