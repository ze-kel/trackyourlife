import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

const confg = defineConfig({
  server: {
    preset: "node-server",
    watchOptions: {
      ignored: ["**/node_modules/@tyl*/**"],
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ["oslo", "@node-rs/argon2", "@node-rs/bcrypt"],
      esbuildOptions: {
        target: "es2022",
      },
    },

    build: {
      target: "es2022",
    },
    plugins: [tsConfigPaths({ projects: ["./tsconfig.json"] })],
  },
});

export default confg;
