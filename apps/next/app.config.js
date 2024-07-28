import { fileURLToPath } from "url";
import { defineConfig } from "@tanstack/start/config";
import { input } from "vinxi/plugins/config";

//import middleware from "./app/middleware";

/** @returns {import('vinxi').RouterSchemaInput} */
function trpcRouter({ plugins = () => [] } = {}) {
  return {
    name: "trpc",
    base: "/trpc",
    type: "http",
    handler: fileURLToPath(new URL("./handler.js", import.meta.url)),
    target: "server",
    plugins: [
      (v) => {
        console.log("PLUG", v);
      },
    ],
  };
}

const base = defineConfig({});

base.addRouter(trpcRouter());

base.config.routers.forEach((v) => {
  if ("middleware" in v) {
    v.middleware = "./app/middleware.ts";
  }
});

console.log(base.config.routers);

export default base;
