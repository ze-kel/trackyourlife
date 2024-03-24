import Link from "next/link";
import TrackablesList from "@components/TrackablesList";
import { Button } from "@/components/ui/button";
import { RSAGetAllTrackables } from "src/app/api/trackables/serverActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fillPrefetchedData } from "src/app/trackables/helpers";

const SHOW_DAYS = 6;

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold md:text-3xl">Your Trackables</h2>
        <Link href={"/create"}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mt-2">
          <TrackablesList list={ids} daysToShow={SHOW_DAYS}></TrackablesList>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
