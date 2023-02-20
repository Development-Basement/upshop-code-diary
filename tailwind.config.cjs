const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    // @ts-expect-error // daisyui is not typed :(
    require("daisyui"),
    require("@headlessui/tailwindcss"),
  ],
  darkMode: "class", // add "dark" class to parent element to enable dark mode
  daisyui: {
    // first theme is default -> light (so we can toggle it to dark later)
    themes: ["light", "dark"], // TODO: change to custom themes with the same names
    darkTheme: "dark",
  },
};
