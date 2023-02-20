/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.cjs",

  trailingComma: "all",
  proseWrap: "always",
};
