import { Link, linkOptions } from "@tanstack/react-router";
import {
  Calendar1Icon,
  CirclePlusIcon,
  LogsIcon,
  PanelLeftClose,
  PanelLeftOpen,
  SettingsIcon,
} from "lucide-react";

import { Button } from "~/@shad/components/button";
import { useSidebar } from "~/@shad/components/sidebar";
import { cn } from "~/@shad/utils";

export const CoreLinks = [
  linkOptions({
    to: "/app",
    label: (
      <>
        <Calendar1Icon />
        Today
      </>
    ),
  }),
  linkOptions({
    to: "/app/trackables",
    label: (
      <>
        <LogsIcon />
        Trackables
      </>
    ),
  }),
  linkOptions({
    to: "/app/create",
    label: (
      <>
        <CirclePlusIcon />
        Create
      </>
    ),
    variant: "ghost",
  }),
  linkOptions({
    to: "/app/settings",
    label: (
      <>
        <SettingsIcon />
        Settings
      </>
    ),
  }),
];

const SidebarToggle = ({ className }: { className?: string }) => {
  const { toggleSidebar, state, isMobile, openMobile } = useSidebar();
  return (
    <Button variant="outline" onClick={toggleSidebar} className={className}>
      {(isMobile && !openMobile) || state === "collapsed" ? (
        <>
          <PanelLeftOpen size={16} />
        </>
      ) : (
        <PanelLeftClose size={16} />
      )}
    </Button>
  );
};

const Header = () => {
  return (
    <div
      className={cn(
        "sticky top-3 z-[50] mx-auto flex max-w-[900px] justify-center font-bold",
        "mt-3 px-3",
      )}
    >
      <div className="absolute h-full w-full -translate-y-1/2 bg-neutral-50 opacity-90 dark:bg-neutral-950"></div>
      <div className="bg-sidebar border-sidebar-border relative flex h-full w-full items-center justify-between rounded-md border px-4 py-2">
        <SidebarToggle className="" />
        <div className="flex items-center gap-2">
          <Link
            to={"/app"}
            className={cn(
              "flex h-full items-center justify-center",
              //state === "expanded" ? "lg:hidden" : "",
            )}
          >
            <h2 className="text-2xl font-bold tracking-wider">TYL</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
