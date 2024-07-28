import { getRouterManifest } from "@tanstack/start/router-manifest";
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/start/server";

import { createRouter } from "./router";

const a = createStartHandler({
  createRouter,
  getRouterManifest,
});

const b = a(defaultStreamHandler);

export default b;
