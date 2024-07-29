import type { AnyRouter } from "@tanstack/react-router";
import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";

import { createRouter } from "./router";

const startHandler = createStartHandler({
  createRouter,
  getRouterManifest,
});

const handler = startHandler(defaultStreamHandler);

export default handler;
