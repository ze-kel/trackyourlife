"use client";

import DeleteButton from "@components/DeleteButton";
import TrackableName from "@components/TrackableName";
import TrackableView from "@components/TrackableView";
import type { ITrackable } from "@t/trackable";
import Link from "next/link";
import TrackableContext from "src/helpers/trackableContext";
import { GearIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { getTrackable } from "src/app/trackables/[id]/getTrackable";
import { Button } from "@/components/ui/button";

const Trackable = ({ trackable }: { trackable: ITrackable }) => {
  const { data } = useQuery(["trackable", trackable.id], {
    queryFn: async () => {
      return await getTrackable(trackable.id);
    },
    initialData: trackable,
  });

  return (
    data && (
      <>
        <TrackableContext trackable={data}>
          <div className="content-container flex h-full max-h-full w-full flex-col">
            <div className="mb-4 flex w-full items-center justify-between">
              <TrackableName />
              <Link href={`/trackables/${data.id}/settings`} className="mr-2">
                <Button variant="outline" size="icon">
                  <GearIcon className="h-4 w-4" />
                </Button>
              </Link>
              <DeleteButton />
            </div>

            <TrackableView />
          </div>
        </TrackableContext>
      </>
    )
  );
};

export default Trackable;
