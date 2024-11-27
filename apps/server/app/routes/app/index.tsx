import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { DailyList } from "~/components/TrackablesList";
import { api } from "~/trpc/react";
import { apiS } from "~/trpc/server";
import { fillPrefetchedTrackablesList } from "~/utils/fillPrefetched";

const SHOW_DAYS = 7;

export const Route = createFileRoute("/app/")({
  component: PostsComponent,

  loader: async ({ context }) => {},
});

function PostsComponent() {
  return (
    <div className="content-container flex w-full flex-col">
      <DailyList daysToShow={SHOW_DAYS} />
    </div>
  );
}
