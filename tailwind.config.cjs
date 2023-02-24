const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        action: colors.green,
        bgdark1: colors.zinc[700],
        bgdark2: colors.zinc[800],
        bgdark3: colors.zinc[900],
        textdarkopaque: colors.zinc[400],
        tsbg1: "rgba(0, 0, 0, 0.25)",
        tsbg2: "rgba(0, 0, 0, 0.35)",
        tsbg3: "rgba(0, 0, 0, 0.5)",
      },
      boxShadow: {
        "thin-under-strong": "0 0px 4px 4px rgba(0,0,0,0.25)",
      },
    },
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
    themes: [
      {
        light: {
          primary: "#22c55e",
          secondary: "#a855f7",
          accent: "#2dd4bf",
          neutral: "#525252",
          "base-100": "#f4f4f5",
          info: "#60a5fa",
          success: "#34d399",
          warning: "#facc15",
          error: "#f87171",
        },
      },
      {
        dark: {
          primary: "#22c55e",
          secondary: "#a855f7",
          accent: "#14b8a6",
          neutral: "#27272a",
          "base-100": "#3f3f46",
          info: "#3b82f6",
          success: "#34d399",
          warning: "#eab308",
          error: "#ef4444",
        },
      },
    ], // TODO: change to custom themes with the same names
    darkTheme: "dark",
  },
};
