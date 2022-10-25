import { ITrackable } from "@t/trackable";
import Link from "next/link";
import TrackableProvider from "src/helpers/trackableContext";
import MiniTrackable from "./miniTrackable";

const Trackable = ({ trackable }: { trackable: ITrackable }) => {
  return (
    <TrackableProvider trackable={trackable}>
      <article className="border-b border-zinc-200 p-2 last:border-0">
        <Link href={`/trackable/${trackable._id}`}>
          <h3 className="w-fit cursor-pointer text-xl ">
            {trackable.settings.name}
          </h3>
        </Link>
        <MiniTrackable className="my-4" />
      </article>
    </TrackableProvider>
  );
};

const TrackablesList = ({ list }: { list: ITrackable[] }) => {
  return (
    <div className="content-container overflow-scroll">
      <div className="grid gap-5">
        {list.map((item) => (
          <Trackable trackable={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};

export default TrackablesList;
