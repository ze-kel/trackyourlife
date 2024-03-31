import { DailyList } from "@components/TrackablesList";
import { RSAGetAllTrackables } from "src/app/api/trackables/serverActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fillPrefetchedData } from "src/app/trackables/helpers";

const SHOW_DAYS = 7;

const Page = async () => {
  const trackables = await RSAGetAllTrackables({
    limits: {
      type: "last",
      days: SHOW_DAYS,
    },
  });

  const queryClient = new QueryClient();

  const ids: string[] = [];

  for (const tr of trackables) {
    ids.push(tr.id);
    fillPrefetchedData(queryClient, tr);
  }

  return (
    <div className="content-container flex w-full flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DailyList list={ids} daysToShow={SHOW_DAYS} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
