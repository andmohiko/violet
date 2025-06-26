module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  content: [
    // Tailwind CSS のコンテンツを指定
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
