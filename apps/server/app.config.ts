import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    watchOptions: {
      ignored: ["**/node_modules/@tyl*/**"],
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ["oslo", "@node-rs/argon2", "@node-rs/bcrypt"],
    },
    plugins: [tsConfigPaths()],
  },
});
