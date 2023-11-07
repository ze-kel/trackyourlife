"use client";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@components/_UI/Dropdown";
import Link from "next/link";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import type { User } from "lucia";
import { useRouter } from "next/navigation";
import { RadioTabs, RadioTabItem } from "@/components/ui/radio-tabs";
import { useTheme } from "next-themes";

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

const Header = ({ user }: { user?: User }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-14 flex-shrink-0 justify-center border-b-2 border-neutral-300 bg-neutral-50 font-bold text-neutral-800 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>
          <h2 className="font-medium">Track Your Life</h2>
        </Link>

        {user && (
          <Dropdown placement="bottom-end">
            <DropdownContent className="flex flex-col items-end justify-end gap-2">
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
              <SigOutButton key={"so"} />
            </DropdownContent>

            <DropdownTrigger>
              <div className="relative flex cursor-pointer items-center transition-colors hover:text-neutral-600 dark:hover:text-neutral-50">
                <p className="font-medium">{user ? user.username : ""}</p>
                <ChevronDownIcon className={clsx("w-6 transition-transform")} />
              </div>
            </DropdownTrigger>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Header;
