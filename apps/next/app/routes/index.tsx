import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { lucia } from "@tyl/auth";
import { Button } from "@tyl/ui/button";

import { api } from "../trpc/react";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context }) => {
    const res = await api.trackablesRouter.dbReadTest.query();

    context.queryClient.setQueryData(["sample"], res);

    return res;
  },
});

const SigOutButton = () => {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
    setLoading(false);

    navigate({ to: "/login" });
  };

  return (
    <Button
      variant="outline"
      isLoading={isLoading}
      onClick={() => void signOut()}
      className="w-full text-center"
    >
      Sign Out
    </Button>
  );
};

function Home() {
  const u = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return api.userRouter.getMe.query();
    },
    staleTime: Infinity,
  });

  const [n, setN] = useState(0);

  return (
    <div className="p-2">
      <h3>
        Welcome Hoasdsasd12321sdme!!!
        {JSON.stringify(u.data)}
      </h3>

      <Link to={"/login"}>LOGIN</Link>

      <SigOutButton />

      <button onClick={() => setN((v) => v + 1)}>{n}</button>
    </div>
  );
}
