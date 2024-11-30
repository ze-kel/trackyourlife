import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import twConfig from "@tyl/tailwind-config";

export default {
  darkMode: ["class"],
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [...twConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [twConfig],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
    },
  },
} satisfies Config;
