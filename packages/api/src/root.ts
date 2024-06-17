import { trackablesRouter } from "./router/trackables";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  trackablesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
