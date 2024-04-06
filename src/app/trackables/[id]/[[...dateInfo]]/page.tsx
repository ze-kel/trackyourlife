import DeleteButton from "@components/DeleteButton";
import TrackableView from "@components/TrackableView";
import { Button } from "@/components/ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RSAGetTrackable } from "src/app/api/trackables/serverActions";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { validateRequest } from "src/auth/lucia";
import { fillPrefetchedTrackable } from "src/app/trackables/helpers";
import { TrackableNameEditable } from "@components/TrackableName";
import TrackableProvider from "@components/Providers/TrackableProvider";

const getYearSafe = (y: string | undefined) => {
  if (!y || y.length !== 4) return new Date().getFullYear();

  const n = Number(y);
  if (n < 1970 || n > 2100) return new Date().getFullYear();
  return n;
};

const getMonthSafe = (y: string | undefined) => {
  if (!y) return new Date().getMonth();

  const n = Number(y);
  if (n < 1 || n > 12) return new Date().getMonth();
  // JS months are zero indexed
  return n - 1;
};

const getDataForTrackable = async (
  id: string,
  yearParam?: string,
  monthParam?: string,
) => {
  const queryClient = new QueryClient();

  const safeYear = getYearSafe(yearParam);
  const safeMonth = getMonthSafe(monthParam);

  const yearValid = Number(yearParam) === safeYear;
  const monthValid = Number(monthParam) === safeMonth + 1;

  // Year view, prefetch full year
  if (yearValid && !monthValid) {
    const trackable = await RSAGetTrackable({
      trackableId: id,
      limits: {
        type: "year",
        year: safeYear,
      },
    });
    return { trackable, queryClient, year: safeYear };
  }

  // Either both are valid, or we use special link that always gets us to current month
  if ((monthValid && yearValid) || yearParam === "today") {
    const trackable = await RSAGetTrackable({
      trackableId: id,
      limits: {
        type: "month",
        year: safeYear,
        month: safeMonth,
      },
    });
    return { trackable, queryClient, year: safeYear, month: safeMonth };
  }

  // Nothing is valid. Show year view. We still prefetch current month, just to get trackable settings and info.
  const trackable = await RSAGetTrackable({
    trackableId: id,
    limits: {
      type: "month",
      year: safeYear,
      month: safeMonth,
    },
  });
  return { trackable, queryClient };
};

const Trackable = async ({
  params,
}: {
  params: { id: string; dateInfo: string[] };
}) => {
  const { session } = await validateRequest();
  if (!session) redirect("/login");

  const { trackable, queryClient, month, year } = await getDataForTrackable(
    params.id,
    params.dateInfo?.[0],
    params.dateInfo?.[1],
  );

  fillPrefetchedTrackable(queryClient, trackable);

  try {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TrackableProvider id={params.id}>
          <div className="content-container flex h-full max-h-full w-full flex-col">
            <div className="flex w-full items-center justify-between">
              <TrackableNameEditable />
              <div className="flex gap-2">
                <Link
                  href={`/trackables/${params.id}/settings`}
                  className="mr-2"
                >
                  <Button name="settings" variant="outline" size="icon">
                    <GearIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <DeleteButton id={params.id} />
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            <TrackableView m={month} y={year} />
          </div>
        </TrackableProvider>
      </HydrationBoundary>
    );
  } catch (e) {
    redirect("/");
  }
};

export default Trackable;
