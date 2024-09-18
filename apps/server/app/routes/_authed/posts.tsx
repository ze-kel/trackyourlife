import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { api } from "~/trpc/react";
import { apiS } from "~/trpc/server";

export const Route = createFileRoute("/_authed/posts")({
  component: PostsComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: async () => {
        console.log("server call");
        const r = await apiS.userRouter.getMe();
        console.log("server call res", r);

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

  return <div>hello auth. user is {JSON.stringify(u.data)}</div>;
}
