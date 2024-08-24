const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        "text-color-base": "text-neutral-950 dark:text-neutral-50",
      });
    }),
  ],
};
