import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14121F',
        paper: '#F8F7FC',
        purple: '#7C3AED',
        orange: '#F97316',
        gold: '#FBBF24',
      },
      boxShadow: {
        float: '0 24px 80px rgba(45, 20, 105, 0.22)',
        card: '0 10px 30px rgba(27, 21, 61, 0.1)',
        store: '0 20px 55px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
};

export default config;
