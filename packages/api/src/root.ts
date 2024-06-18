import { trackablesRouter } from "./router/trackables";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  trackablesRouter,
  userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
