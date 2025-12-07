/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{astro,js,ts,jsx,tsx,mdx}',
    './src/content/**/*.json',
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
