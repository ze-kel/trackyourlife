import type { ITrackable } from "src/types/trackable";
import Link from "next/link";
import TrackableProvider from "src/helpers/trackableContext";
import { api } from "src/utils/api";
import MiniTrackable from "./miniTrackable";

const Trackable = ({ id }: { id: ITrackable["id"] }) => {
  const { data } = api.trackable.getTrackableById.useQuery(id, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (!data) return <div>Loading</div>;

  return (
    <TrackableProvider trackable={data}>
      <article className="border-b border-neutral-200 py-2 last:border-0 dark:border-neutral-800">
        <Link href={`/trackable/${id}`} className="block w-fit">
          <h3 className="w-fit cursor-pointer text-xl font-light">
            {data.settings.name || "Unnamed trackable"}
          </h3>
        </Link>
        <MiniTrackable className="my-4" />
      </article>
    </TrackableProvider>
  );
};

const TrackablesList = ({ list }: { list: ITrackable["id"][] }) => {
  if (!list) return <div></div>;

  return (
    <div className="grid gap-5">
      {list.map((id) => (
        <Trackable id={id} key={id} />
      ))}
    </div>
  );
};

export default TrackablesList;
