/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/locales/*.json',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
