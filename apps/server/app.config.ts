import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

const base = defineConfig({
  vite: {
    plugins: [tsConfigPaths()],
  },
});

base.addRouter({
  name: "trpc",
  base: "/trpc",
  type: "http",
  handler: "./handler.ts",
  target: "server",
});

export default base;
