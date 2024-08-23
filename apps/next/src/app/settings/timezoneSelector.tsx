"use client";

import type { TimeZone } from "timezones-list";
import { useEffect, useState } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useMediaQuery } from "usehooks-ts";

import { clamp } from "@tyl/helpers";
import { getDateInTimezone } from "@tyl/helpers/timezone";
import { cn } from "@tyl/ui";
import { Button } from "@tyl/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@tyl/ui/drawer";

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "~/components/Dropdown";
import { useUserSettings } from "~/components/Providers/UserSettingsProvider";

export const CurrentTime = () => {
  const [value, setValue] = useState("");

  const { settings } = useUserSettings();

  useEffect(() => {
    const timeout = setInterval(() => {
      setValue(format(getDateInTimezone(settings.timezone), "HH:mm:ss")), 1000;
    });
    return () => clearTimeout(timeout);
  });

  return (
    <div className="flex flex-col text-xl opacity-50">
      <div>{value}</div>
    </div>
  );
};

const SearchableList = ({
  list,
  update,
}: {
  list: TimeZone[];
  value?: TimeZone;
  update: (v: TimeZone) => unknown;
}) => {
  const [search, setSearch] = useState("");
  const [fList, setFList] = useState(list);

  const [selectOffset, setSelectOffset] = useState(0);

  useEffect(() => {
    setFList(
      list.filter((v) => v.name.toLowerCase().includes(search.toLowerCase())),
    );

    setSelectOffset(0);
  }, [search, list]);

  const commitSelected = () => {
    if (fList[selectOffset]) {
      update(fList[selectOffset] as TimeZone);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for timezone"
        className="flex h-9 w-full bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus:border-none focus:outline-none"
        autoFocus
        value={search}
        onKeyUp={(e) => {
          if (e.key === "ArrowDown") {
            setSelectOffset(clamp(selectOffset + 1, 0, fList.length));
          }

          if (e.key === "ArrowUp") {
            setSelectOffset(clamp(selectOffset - 1, 0, fList.length));
          }
          if (e.key === "Enter") {
            commitSelected();
          }
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="h-0.5 w-full bg-neutral-900"></div>
      <div className="customScrollBar customScrollBarBig max-h-64 overflow-y-scroll">
        {fList.map((zone, i) => (
          <div
            key={zone.tzCode}
            className={cn(
              "cursor-pointer px-2 py-1 text-left text-neutral-900 dark:text-neutral-100",
              i === selectOffset && "bg-neutral-200 dark:bg-neutral-800",
            )}
            onClick={() => {
              update(zone);
            }}
          >
            {zone.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export const TimezoneSelector = ({ list }: { list: TimeZone[] }) => {
  const [open, setOpen] = useState(false);

  const { settings, updateSettingsPartial } = useUserSettings();

  const value = settings.timezone;

  const update = (zone: TimeZone) => {
    void updateSettingsPartial({ timezone: zone });
  };

  const isDesktop = useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });

  const Trigger = (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="mt-2 w-full max-w-[400px] justify-between"
      >
        <span className="truncate">
          {value ? value.name : "Default (UTC+0)"}
        </span>
        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </div>
  );

  if (!isDesktop)
    return (
      <Drawer
        open={open}
        onOpenChange={setOpen}
        shouldScaleBackground={false}
        disablePreventScroll
      >
        <DrawerTrigger asChild>{Trigger}</DrawerTrigger>

        <DrawerContent>
          <SearchableList
            list={list}
            value={value}
            update={(v) => {
              update(v);
              setOpen(false);
            }}
          />
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger>{Trigger}</DropdownTrigger>

      <DropdownContent className="max-w-[400px] p-0">
        <SearchableList
          list={list}
          value={value}
          update={(v) => {
            update(v);
            setOpen(false);
          }}
        />
      </DropdownContent>
    </Dropdown>
  );
};
