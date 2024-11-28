import { createFileRoute } from "@tanstack/react-router";

import TrackablesList from "~/components/TrackablesList";
import { fillPrefetchedTrackablesList } from "~/query/fillPrefetched";
import { trpc } from "~/trpc/react";

const SHOW_DAYS = 6;

export const Route = createFileRoute("/app/trackables/")({
  component: PostsComponent,

  loader: async ({ context }) => {
    const trackables = await trpc.trackablesRouter.getAllTrackables.query({
      limits: {
        type: "last",
        days: SHOW_DAYS,
      },
    });
    fillPrefetchedTrackablesList(context.queryClient, trackables);
  },
});

function PostsComponent() {
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
