import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import twConfig from "@tyl/tailwind-config";

export default {
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...twConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [twConfig],
} satisfies Config;
