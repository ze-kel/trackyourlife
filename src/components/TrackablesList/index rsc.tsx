"use server";
import type { ITrackable } from "src/types/trackable";
import Link from "next/link";
import MiniTrackable from "./miniTrackable";
import { getTrackable } from "src/helpers/apiHelpers";

const Trackable = async ({ id }: { id: ITrackable["id"] }) => {
  const trackable = await getTrackable(id);

  return (
    <article className="border-b border-neutral-200 py-2 last:border-0 dark:border-neutral-800">
      <Link href={`/trackables/${id}`} className="block w-fit">
        <h3 className="w-fit cursor-pointer text-xl font-light">
          {trackable.settings.name || "Unnamed trackable"}
        </h3>
      </Link>
      <MiniTrackable className="my-4" />
    </article>
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
