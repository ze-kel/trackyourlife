import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";

import { trpc } from "~/trpc/react";

export const Route = createFileRoute("/app/test")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const a = await trpc.userRouter.getMe.query();
    return a;
  },
});

function RouteComponent() {
  const L = Route.useLoaderData();

  const a = useQuery({
    queryKey: ["aslkdjaslds"],
    queryFn: () => trpc.userRouter.getMe.query(),
  });

  return (
    <>
      <div>{JSON.stringify(L)}</div>
      <div>{JSON.stringify(a.data)}</div>
    </>
  );
}
