import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute } from "@tanstack/react-router";

import { Schema } from "~/schema";

export const Route = createFileRoute("/app/testing")({
  component: RouteComponent,
});

function RouteComponent() {
  if (import.meta.env.SSR) {
    return <div></div>;
  }

  const zero = useZero<Schema>();

  const q = zero.query.TYL_trackable;

  const [trackableData, trackableDataDetail] = useQuery(q);

  return (
    <div>
      {trackableData.map((v) => (
        <div></div>
      ))}
    </div>
  );
}
