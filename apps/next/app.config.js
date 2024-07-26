import { fileURLToPath } from "url";
import { defineConfig } from "@tanstack/start/config";
import { input } from "vinxi/plugins/config";
import {
  appendHeader,
  defineMiddleware,
  getCookie,
  getHeader,
} from "vinxi/server";

//import middleware from "./app/middleware";

/** @returns {import('vinxi').RouterSchemaInput} */
function trpcRouter({ plugins = () => [] } = {}) {
  return {
    name: "server",
    base: "/trpc",
    type: "http",
    handler: fileURLToPath(new URL("./handler.js", import.meta.url)),
    target: "server",
    //    middleware: "./app/middleware.ts",
    plugins: () => [
      input(
        "$vinxi/trpc/router",
        fileURLToPath(new URL("./app/trpc.ts", import.meta.url)),
      ),
    ],
  };
}

const base = defineConfig({
  routers: {
    server: {},
    ssr: {},
  },
});

base.addRouter(trpcRouter());
base.hooks.addHooks(
  defineMiddleware({
    onRequest() {
      console.log("onRequest");
    },
  }),
);

export default base;
