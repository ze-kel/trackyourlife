"use client";

import TrackableContext from "src/helpers/trackableContext";
import TrackableSettings from "src/components/TrackableSettings";
import TrackableName from "src/components/TrackableName";
import DeleteButton from "src/components/DeleteButton";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getTrackable } from "src/app/trackables/[id]/getTrackable";
import type { ITrackable } from "@t/trackable";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

const TrackableSettingsPageClient = ({
  trackable,
}: {
  trackable: ITrackable;
}) => {
  const { data } = useQuery(["trackable", trackable.id], {
    queryFn: async () => {
      return await getTrackable(trackable.id);
    },
    initialData: trackable,
  });
  return (
    data && (
      <TrackableContext trackable={data}>
        <div className="content-container flex h-full max-h-full w-full flex-col">
          <div className=" mb-4 flex w-full items-center justify-between">
            <TrackableName />
            <Link href={`/trackables/${trackable.id}/`} className="mr-2 ">
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteButton />
          </div>
          <TrackableSettings />
        </div>
      </TrackableContext>
    )
  );
};

export default TrackableSettingsPageClient;
