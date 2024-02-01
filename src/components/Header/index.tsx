"use client";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@components/Dropdown";
import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import type { User } from "lucia";
import { useRouter } from "next/navigation";
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
  const Trigger = (
    <div className="relative flex cursor-pointer items-center transition-colors hover:text-neutral-600 dark:hover:text-neutral-50">
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

  const isDesktop = useMediaQuery("(min-width:768px)");
  if (!isDesktop)
    return (
      <Drawer>
        <DrawerTrigger>{Trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{username || ""}</DrawerTitle>
          </DrawerHeader>
          <div className="m-auto w-fit pb-4">{Content}</div>
        </DrawerContent>
      </Drawer>
    );

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>{Trigger}</DropdownTrigger>
      <DropdownContent>{Content}</DropdownContent>
    </Dropdown>
  );
};

const Header = ({ user }: { user?: User }) => {
  return (
    <div className="flex h-14 flex-shrink-0 justify-center border-b-2 border-neutral-300 bg-neutral-50 font-bold text-neutral-800 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>
          <h2 className="font-medium">Track Your Life</h2>
        </Link>

        {user && <HeaderMenu username={user.username}></HeaderMenu>}
      </div>
    </div>
  );
};

export default Header;
