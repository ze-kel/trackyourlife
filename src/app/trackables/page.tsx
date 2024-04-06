import TrackablesList from "@components/TrackablesList";
import { RSAGetAllTrackables } from "src/app/api/trackables/serverActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fillPrefetchedTrackablesList } from "src/app/trackables/helpers";

const SHOW_DAYS = 6;

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="content-container flex w-full flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold lg:text-3xl">
            Your Trackables
          </h2>
        </div>
        <div className="mt-2">
          <TrackablesList daysToShow={SHOW_DAYS}></TrackablesList>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Page;
