import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useLayoutEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

export const YearSelector = ({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) => {
  const isDesktop = useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
    defaultValue: false,
  });

  const [valueInternal, setValueInternal] = useState(String(value));

  useLayoutEffect(() => {
    if (String(value) !== valueInternal) {
      setValueInternal(String(value));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const blurHandler = () => {
    setDrawerOpen(false);
    const n = Number(valueInternal);

    if (Number.isNaN(n) || n < 1970 || n > 2100) {
      setValueInternal(String(value));
      return;
    }

    onChange(n);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!value) return <></>;

  if (!isDesktop)
    return (
      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        shouldScaleBackground={false}
        disablePreventScroll
      >
        <DrawerTrigger>
          <Input
            value={valueInternal}
            className="peer relative z-10 w-20 bg-neutral-50 text-center dark:bg-neutral-950"
            readOnly
          />
        </DrawerTrigger>

        <DrawerContent>
          <DrawerTitle className="m-auto mt-5">Year:</DrawerTitle>
          <div className="p-6">
            <input
              autoFocus={true}
              inputMode={"decimal"}
              type={"text"}
              value={valueInternal}
              onChange={(e) => setValueInternal(e.target.value)}
              onBlur={blurHandler}
              className={cn(
                "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all",
                "text-neutral-800 dark:text-neutral-300",
                "text-2xl",
                "h-20 rounded focus:outline-neutral-300 dark:focus:outline-neutral-600",
              )}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <div className="group relative">
      <Input
        value={valueInternal}
        onChange={(e) => setValueInternal(e.target.value)}
        onBlur={blurHandler}
        onKeyDown={() => {}}
        className="peer relative z-10 w-20 bg-neutral-50 text-center dark:bg-neutral-950"
      />
      <>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => {
            if (value) onChange(value + 1);
          }}
          className="absolute right-[1rem] top-1/2 flex w-12 -translate-y-1/2  translate-x-full items-center justify-end bg-neutral-50 pr-2 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-neutral-950 "
        >
          <ChevronRightIcon />
        </Button>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => {
            if (value) onChange(value - 1);
          }}
          className="absolute left-[1rem] top-1/2 flex w-12 -translate-x-full  -translate-y-1/2 items-center justify-start bg-neutral-50 pl-2 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-neutral-950"
        >
          <ChevronLeftIcon />
        </Button>
      </>
    </div>
  );
};
