import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute } from "@tanstack/react-router";

import { DayCellWrapperZero } from "~/components/DayCell";
import { DayCellProvider } from "~/components/Providers/DayCellProvider";
import { Schema } from "~/schema";

export const Route = createFileRoute("/app/testing")({
  component: RouteComponent,
});

const MockTrackableComponent = ({ id }: { id: string }) => {
  const zero = useZero<Schema>();

  const q = zero.query.TYL_trackable.one().where("id", id);

  const qs = zero.query.TYL_trackableRecord.where("trackableId", id).limit(100);

  const [trackableData, trackableDataDetail] = useQuery(q);

  const [recordsData, recordsDetail] = useQuery(qs);

  if (!trackableData) {
    return <div></div>;
  }

  return (
    <div>
      <div>{trackableData?.id}</div>

      <div className="grid grid-cols-7">
        {recordsData.map((v) => {
          const date = new Date(v.date);
          return (
            <div>
              <DayCellProvider
                type={trackableData.type}
                settings={trackableData.settings}
              >
                <DayCellWrapperZero
                  className="h-10"
                  value={v.value}
                  type={trackableData.type}
                  day={date.getDate()}
                  month={date.getMonth()}
                  year={date.getFullYear()}
                  settings={trackableData.settings}
                  onChange={(val) =>
                    zero.mutate.TYL_trackableRecord.upsert({
                      trackableId: v.trackableId,
                      value: val,
                      date: v.date,
                      user_id: v.user_id,
                    })
                  }
                />
              </DayCellProvider>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function RouteComponent() {
  if (import.meta.env.SSR) {
    return <div></div>;
  }

  const zero = useZero<Schema>();

  const q = zero.query.TYL_trackable;

  const [trackableData, trackableDataDetail] = useQuery(q);

  return (
    <div>
      {trackableData.map((v) => (
        <div>
          <MockTrackableComponent id={v.id} />
        </div>
      ))}
    </div>
  );
}
