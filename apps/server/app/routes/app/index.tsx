import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { DailyList } from "~/components/TrackablesList";
import { apiS } from "~/trpc/server";
import { fillPrefetchedTrackablesList } from "~/utils/fillPrefetched";

const SHOW_DAYS = 7;

const sf = createServerFn({ method: "GET" }).handler(async () => {
  const a = await apiS.trackablesRouter.getAllTrackables({
    limits: {
      type: "last",
      days: SHOW_DAYS,
    },
  });

  return a;
});

export const Route = createFileRoute("/app/")({
  component: PostsComponent,

  loader: async ({ context }) => {
    const trackables = await sf();
    await fillPrefetchedTrackablesList(context.queryClient, trackables);
  },
});

function PostsComponent() {
  return (
    <div className="content-container flex w-full flex-col">
      <DailyList daysToShow={SHOW_DAYS} />
    </div>
  );
}
