import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { DailyList } from "~/components/TrackablesList";
import { api } from "~/trpc/server";
import { fillPrefetchedTrackablesList } from "~/utils/fillPrefetched";

const SHOW_DAYS = 7;

const Page = async () => {
  const trackables = await api.trackablesRouter.getAllTrackables({
    limits: {
      type: "last",
      days: SHOW_DAYS,
    },
  });

  const queryClient = new QueryClient();

  fillPrefetchedTrackablesList(queryClient, trackables);

  return (
    <div className="content-container flex w-full flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DailyList daysToShow={SHOW_DAYS} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
