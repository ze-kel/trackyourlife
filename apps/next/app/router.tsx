import {
  dehydrate,
  hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { H3EventContext } from "vinxi/server";

import UserSettingsProvider from "~/components/Providers/UserSettingsProvider";
import { DefaultCatchBoundary } from "~/components2/DefaultCatchBoundary";
import { NotFound } from "~/components2/NotFound";
import { routeTree } from "./routeTree.gen";

export function createRouter(event?: H3EventContext) {
  const queryClient = new QueryClient();

  if (event) {
    queryClient.setQueryData(["user"], event.user);
  }

  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
      user: event?.user,
      session: event?.session,
    },

    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    dehydrate: () => {
      return {
        queryClientState: dehydrate(queryClient),
      };
    },
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          <UserSettingsProvider>{children}</UserSettingsProvider>
        </QueryClientProvider>
      );
    },
    hydrate: (dehydratedState) => {
      hydrate(queryClient, dehydratedState.queryClientState);
    },
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
