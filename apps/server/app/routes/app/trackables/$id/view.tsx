import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import TrackableView from "~/components/TrackableView";
import { Route as PRoute } from "../$id";

export const Route = createFileRoute("/app/trackables/$id/view")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { month, year } = Route.useSearch();

  return (
    <TrackableView
      month={month}
      year={year}
      setDates={(y, m) => {
        navigate({
          search: (prev) => ({ ...prev, year: y, month: m }),
        });
      }}
    />
  );
}
