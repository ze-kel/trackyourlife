import { ITrackable } from "src/types/trackable";
import Link from "next/link";
import TrackableProvider from "src/helpers/trackableContext";
import { api } from "src/utils/api";
import MiniTrackable from "./miniTrackable";

const Trackable = ({ id }: { id: ITrackable["id"] }) => {
  const { data } = api.trackable.getTrackableById.useQuery(id);

  if (!data) return <div>loading</div>;

  return (
    <TrackableProvider trackable={data}>
      <article className="border-b border-neutral-200 py-2 last:border-0">
        <Link href={`/trackable/${id}`}>
          <h3 className="w-fit cursor-pointer text-xl ">
            {data.settings.name || "Unnamed trackable"}
          </h3>
        </Link>
        <MiniTrackable className="my-4" />
      </article>
    </TrackableProvider>
  );
};

const TrackablesList = ({ list }: { list: ITrackable["id"][] }) => {
  if (!list) return <div>no list</div>;

  return (
    <div className="grid gap-5">
      {list.map((id) => (
        <Trackable id={id} key={id} />
      ))}
    </div>
  );
};

export default TrackablesList;
