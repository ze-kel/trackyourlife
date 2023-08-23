"use client";
import Dropdown from "@components/_UI/Dropdown";
import Link from "next/link";
import { useState } from "react";
import IconChevronDown from "@heroicons/react/20/solid/ChevronDownIcon";
import clsx from "clsx";
import Button from "@components/_UI/Button";
import type { User } from "lucia";
import { useRouter } from "next/navigation";

const SigOutButton = () => {
  const router = useRouter();

  const signOut = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.refresh();
  };

  return (
    <Button
      theme="transparent"
      size="s"
      onClick={() => void signOut()}
      className="mt-1 w-full text-center"
      fill
    >
      Sign Out
    </Button>
  );
};

const Header = ({ user }: { user?: User }) => {
  const [dropdown, setDropdown] = useState(false);

  const dropV = (
    <div className="relative flex cursor-pointer items-center transition-colors hover:text-neutral-600 dark:hover:text-neutral-50">
      <p className="font-medium">{user ? user.username : ""}</p>
      <IconChevronDown
        className={clsx(
          "w-6 transition-transform",
          dropdown ? "rotate-180" : "",
        )}
      />
    </div>
  );

  const dropH = (
    <div className="flex flex-col items-end justify-end">
      <SigOutButton key={"so"} />
    </div>
  );

  return (
    <div className="flex h-14 flex-shrink-0 justify-center border-b-2 border-neutral-300 bg-neutral-50 font-bold text-neutral-800 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>
          <h2 className="font-medium">Track Your Life</h2>
        </Link>

        {user && (
          <Dropdown
            mainPart={dropV}
            hiddenPart={dropH}
            visible={dropdown}
            setVisible={setDropdown}
            placement="bottom-end"
          />
        )}
      </div>
    </div>
  );
};

export default Header;
