import baseConfig from "@tyl/eslint-config/base";
import reactConfig from "@tyl/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
