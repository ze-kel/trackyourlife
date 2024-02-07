import Link from "next/link";
import { DailyList } from "@components/TrackablesList";
import { Button } from "@/components/ui/button";
import { RSAGetAllTrackables } from "src/app/api/trackables/serverActions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { subMonths } from "date-fns";

const Page = async () => {
  const curDate = new Date();

  const year = curDate.getFullYear();
  const month = curDate.getMonth();

  const trackables = await RSAGetAllTrackables({
    limits: {
      type: "month",
      year,
      month,
    },
  });

  const queryClient = new QueryClient();

  const ids: string[] = [];

  for (const tr of trackables) {
    ids.push(tr.id);
    queryClient.setQueryData(["trackable", tr.id], tr);
    queryClient.setQueryData(["trackable", tr.id, year, month], tr.data);
    queryClient.setQueryData(["trackable", tr.id, "settings"], tr.settings);
  }

  // Prefetch previous month if needed
  if (curDate.getDate() < 7) {
    const prevDate = subMonths(curDate, 1);

    const year = prevDate.getFullYear();
    const month = prevDate.getMonth();

    const trackablesPrevious = await RSAGetAllTrackables({
      limits: {
        type: "month",
        year,
        month,
      },
    });

    for (const tr of trackablesPrevious) {
      queryClient.setQueryData(["trackable", tr.id, year, month], tr.data);
    }
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
          <DailyList list={ids} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
