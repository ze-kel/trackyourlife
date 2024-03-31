"use client";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@components/Dropdown";
import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import type { User } from "lucia";
import { usePathname, useRouter } from "next/navigation";
import { RadioTabs, RadioTabItem } from "@/components/ui/radio-tabs";
import { useTheme } from "next-themes";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "usehooks-ts";

const SigOutButton = () => {
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/user/logout", { method: "POST", credentials: "include" });
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      onClick={() => void signOut()}
      className="w-full text-center"
    >
      Sign Out
    </Button>
  );
};

const topLinks = [
  {
    name: "Today",
    link: "/",
  },
  {
    name: "Trackables",
    link: "/trackables",
  },
  {
    name: "Create",
    link: "/create",
  },
  {
    name: "Settings",
    link: "/settings",
  },
];

const Links = ({
  variant,
  variantActive,
}: {
  variant: ButtonProps["variant"];
  variantActive: ButtonProps["variant"];
}) => {
  const pathName = usePathname();

  return (
    <div className="flex w-full flex-col items-center gap-2 font-medium md:w-fit md:flex-row">
      {topLinks.map((v) => (
        <Link key={v.link} href={v.link} className="block w-full">
          <Button
            className="w-full"
            variant={v.link === pathName ? variantActive : variant}
          >
            {v.name}
          </Button>
        </Link>
      ))}
    </div>
  );
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <RadioTabs value={theme} onValueChange={setTheme}>
      <RadioTabItem value="light" id="light">
        Light
      </RadioTabItem>
      <RadioTabItem value="system" id="system">
        System
      </RadioTabItem>
      <RadioTabItem value="dark" id="dark">
        Dark
      </RadioTabItem>
    </RadioTabs>
  );
};

const HeaderMenu = ({ username }: { username?: string }) => {
  const isDesktop = useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });

  const Trigger = (
    <div className="relative flex cursor-pointer items-center px-4 transition-colors hover:text-neutral-600 dark:hover:text-neutral-50">
      <p className="font-medium">{username || ""}</p>
      <ChevronDownIcon className={"w-6 transition-transform"} />
    </div>
  );

  const Content = (
    <div className="flex flex-col gap-2">
      <ThemeSwitcher />
      <SigOutButton key={"so"} />
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <Links variant={"ghost"} variantActive={"secondary"} />
      </div>
      {isDesktop ? (
        <>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>{Trigger}</DropdownTrigger>
            <DropdownContent>{Content}</DropdownContent>
          </Dropdown>
        </>
      ) : (
        <Drawer>
          <DrawerTrigger>{Trigger}</DrawerTrigger>
          <DrawerContent className="flex flex-col items-center gap-2">
            <DrawerHeader>
              <DrawerTitle>{username || ""}</DrawerTitle>
            </DrawerHeader>

            <div className="m-auto flex w-full max-w-80 flex-col gap-2 px-4 pb-4">
              <Links variant={"outline"} variantActive={"outline"} />
              {Content}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

const Header = ({ user }: { user?: User }) => {
  return (
    <div className="flex h-14 flex-shrink-0 justify-center border-b-2 border-neutral-300 bg-neutral-50 font-bold text-neutral-800 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="content-container flex h-full w-full items-center justify-between px-0">
        <Link
          href={"/"}
          className="flex h-full items-center justify-center px-4"
        >
          <h2 className="text-lg font-bold tracking-wider">TYL</h2>
        </Link>

        {user && <HeaderMenu username={user.username}></HeaderMenu>}
      </div>
    </div>
  );
};

export default Header;
