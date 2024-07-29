import React from "react";
import { createFileRoute } from "@tanstack/react-router";

import TrackablesList from "~/components/TrackablesList";
import { fillPrefetchedTrackablesList } from "~/helpers";
import { api } from "~/trpc/react";

const SHOW_DAYS = 6;

export const Route = createFileRoute("/trackables/")({
  component: Home,

  loader: async ({ context }) => {
    /*
    const trackables = await api.trackablesRouter.getAllTrackables.query({
      limits: { type: "last", days: SHOW_DAYS },
    });

    fillPrefetchedTrackablesList(context.queryClient, trackables);
    */
  },
});

function Home() {
  return (
    <div className="content-container flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold lg:text-3xl">Your Trackables</h2>
      </div>
      <div className="mt-2">
        <TrackablesList daysToShow={SHOW_DAYS}></TrackablesList>
      </div>
    </div>
  );
}
