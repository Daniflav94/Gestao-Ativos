/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          danger: {DEFAULT: '#b81414'}, 
          warning: {DEFAULT: '#ff8900'},
          primary: {DEFAULT: '#4b457f'}
        },
      },
     }
    }) ],
};
