"use server";
import type { ITrackable } from "src/types/trackable";
import Link from "next/link";
import MiniTrackable from "./miniTrackable";
import { useMemo } from "react";
import FavButton from "@components/FavButton";

const sortList = (list: ITrackable[]): ITrackable[] => {
  const newList = [...list];

  newList.sort((a, b) => {
    if (a.settings.favorite && !b.settings.favorite) return -1;
    if (!a.settings.favorite && b.settings.favorite) return 1;

    const aName = a.settings.name || "";
    const bName = b.settings.name || "";

    return aName.localeCompare(bName);
  });

  return newList;
};

const TrackablesList = ({ list }: { list: ITrackable[] }) => {
  const sortedList = useMemo(() => sortList(list), [list]);

  return (
    <div className="grid gap-5">
      {sortedList.map((tr) => (
        <article
          key={tr.id}
          className="border-b border-neutral-200 py-2 last:border-0 dark:border-neutral-800"
        >
          <div className="flex justify-between">
            <Link href={`/trackables/${tr.id}`} className="block w-fit">
              <h3 className="w-fit cursor-pointer text-xl font-light">
                {tr.settings.name}
              </h3>
            </Link>
            <FavButton trackable={tr} />
          </div>
          <MiniTrackable trackable={tr} className="my-4" />
        </article>
      ))}
    </div>
  );
};

export default TrackablesList;
