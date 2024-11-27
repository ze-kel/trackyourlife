import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import TrackablesList from "~/components/TrackablesList";
import { apiS } from "~/trpc/server";
import { fillPrefetchedTrackablesList } from "~/utils/fillPrefetched";

const SHOW_DAYS = 6;

const sf = createServerFn({ method: "GET" }).handler(async () => {
  const a = await apiS.trackablesRouter.getAllTrackables({
    limits: {
      type: "last",
      days: SHOW_DAYS,
    },
  });

  return a;
});

export const Route = createFileRoute("/app/trackables/")({
  component: PostsComponent,

  loader: async ({ context }) => {
    const trackables = await sf();
    await fillPrefetchedTrackablesList(context.queryClient, trackables);
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
