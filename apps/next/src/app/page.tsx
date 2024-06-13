import { DailyList } from "~/components/TrackablesList";
import { RSAGetAllTrackables } from "src/app/api/trackables/serverActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fillPrefetchedTrackablesList } from "src/app/trackables/helpers";

const SHOW_DAYS = 7;

const Page = async () => {
  const trackables = await RSAGetAllTrackables({
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
