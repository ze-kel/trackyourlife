import { ITrackable } from "@t/trackable";
import Link from "next/link";

const Trackable = ({ trackable }: { trackable: ITrackable }) => {
  return (
    <Link href={`/trackable/${trackable._id}`}>
      <div className="h-24 w-48 cursor-pointer rounded-lg border-2 border-blue-200 p-2">
        {trackable.settings.name}
      </div>
    </Link>
  );
};

const TrackablesList = ({ list }: { list: ITrackable[] }) => {
  return (
    <div className="grid grid-cols-4 gap-4 ">
      {list.map((item) => (
        <Trackable trackable={item} key={item._id} />
      ))}
    </div>
  );
};

export default TrackablesList;
