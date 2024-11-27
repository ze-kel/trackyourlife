import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { Button } from "~/@shad/button";
import { useAppSession } from "~/auth/session";
import { ensureUser, useUser } from "~/query/user";

const sf = createServerFn({ method: "GET" }).handler(async () => {
  const a = await useAppSession();

  return a.data;
});

export const Route = createFileRoute("/app/")({
  component: PostsComponent,

  loader: async ({ context }) => {
    await ensureUser(context.queryClient);
  },
});

function PostsComponent() {
  const u = useUser();

  return <div>hello auth. user is {JSON.stringify(u.data)}</div>;
}
