import { fileURLToPath } from "url";
import { defineConfig } from "@tanstack/start/config";
import { input } from "vinxi/plugins/config";

//import middleware from "./app/middleware";

/** @returns {import('vinxi').RouterSchemaInput} */
function trpcRouter({ plugins = () => [] } = {}) {
  return {
    name: "server",
    base: "/trpc",
    type: "http",
    handler: fileURLToPath(new URL("./handler.js", import.meta.url)),
    target: "server",
    plugins: () => [
      input(
        "$vinxi/trpc/router",
        fileURLToPath(new URL("./app/trpc.ts", import.meta.url)),
      ),
    ],
  };
}

const base = defineConfig({});

base.addRouter(trpcRouter());

export default base;
