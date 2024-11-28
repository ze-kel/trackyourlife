import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  BarChartIcon,
  HeartFilledIcon,
  MixIcon,
  ValueIcon,
} from "@radix-ui/react-icons";
import { Link, useRouter } from "@tanstack/react-router";

import type { ITrackable } from "@tyl/validators/trackable";
import { sortTrackableList } from "@tyl/helpers/trackables";

import { Button } from "~/@shad/button";
import { Spinner } from "~/@shad/spinner";
import { CoreLinks } from "~/components/Header";
import { useTrackablesList } from "~/query/trackablesList";
import { useUserSettings } from "~/query/userSettings";

const iconsMap: Record<ITrackable["type"], ReactNode> = {
  boolean: <ValueIcon />,
  range: <MixIcon />,
  number: <BarChartIcon />,
};

const TrackablesMiniList = () => {
  const { data, isPending } = useTrackablesList();

  const router = useRouter();
  const pathname = router.basepath;

  const settings = useUserSettings();

  const favsSet = useMemo(() => {
    return new Set(settings.favorites);
  }, [settings]);

  if (isPending) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data || data.length === 0) return <div></div>;

  const sorted = sortTrackableList(data, settings.favorites);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((tr) => {
        return (
          <Link key={tr.id} href={`/app/trackables/${tr.id}/`}>
            <Button
              variant={pathname.includes(tr.id) ? "secondary" : "ghost"}
              size={"lg"}
              className="w-full justify-between px-3"
            >
              <div className="justify-baseline flex items-center gap-2 truncate">
                <div className="opacity-70">{iconsMap[tr.type]}</div>
                <div>{tr.name || "Unnamed"}</div>
              </div>
              <div>{favsSet.has(tr.id) && <HeartFilledIcon />}</div>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export const Sidebar = () => {
  const router = useRouter();
  const pathName = router.basepath;

  return (
    <div>
      <div className="flex flex-col gap-2">
        {CoreLinks.map((v) => (
          <Link key={v.link} href={v.link} className="block w-full">
            <Button
              className="w-full justify-start gap-4 px-3"
              size={"lg"}
              variant={v.link === pathName ? "secondary" : "ghost"}
            >
              <v.icon className="" />
              <div className="">{v.name}</div>
            </Button>
          </Link>
        ))}
      </div>

      <hr className="my-6 h-[1px] border-none bg-neutral-200 outline-none dark:bg-neutral-800" />

      <div>
        <TrackablesMiniList />
      </div>
    </div>
  );
};
