import { createFileRoute } from "@tanstack/react-router";

import { DailyList } from "~/components/TrackablesList";
import { fillPrefetchedTrackablesList } from "~/query/fillPrefetched";
import { trpc } from "~/trpc/react";

const SHOW_DAYS = 7;

export const Route = createFileRoute("/app/")({
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
      <DailyList daysToShow={SHOW_DAYS} />
    </div>
  );
}
