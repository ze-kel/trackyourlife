import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { api } from "../trpc/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [a, setA] = useState("");

  const f = async () => {
    const r = await api.trackablesRouter.dbReadTest.query();

    setA(r);
  };

  useEffect(() => {
    console.log("hello");
    f();
  }, []);

  const [n, setN] = useState(0);

  return (
    <div className="p-2">
      <h3>Welcome Hoasdsasd12321sdme!!!</h3>

      {JSON.stringify(a)}

      <button onClick={() => setN((v) => v + 1)}>{n}</button>
    </div>
  );
}
