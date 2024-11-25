import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { api } from "~/trpc/react";
import { apiS } from "~/trpc/server";

const sf = createServerFn().handler(() => apiS.userRouter.getMe());

export const Route = createFileRoute("/_authed/posts")({
  component: PostsComponent,

  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: async () => {
        const r = await sf();

        return r;
      },
    });
  },
});

function PostsComponent() {
  const u = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return api.userRouter.getMe.query();
    },
    staleTime: Infinity,
  });

  return <div>hello auth. user is {JSON.stringify(u)}</div>;
}
