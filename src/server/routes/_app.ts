/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from "../trpc";
import { trackableRouter } from "./trackable";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "all good!"),

  trackable: trackableRouter,
});

export type AppRouter = typeof appRouter;
