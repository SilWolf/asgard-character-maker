/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-joy-color-scheme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
