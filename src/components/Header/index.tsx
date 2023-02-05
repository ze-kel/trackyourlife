import Dropdown from "@components/_UI/Dropdown";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import IconChevronDown from "@heroicons/react/20/solid/ChevronDownIcon";
import clsx from "clsx";

const SigOutButton = () => {
  return (
    <div onClick={() => void signOut()} className="whitespace-nowrap">
      Sign Out
    </div>
  );
};

const Header = () => {
  const { data: sessionData } = useSession();
  const [dropdown, setDropdown] = useState(false);

  const dropV = (
    <div className="relative flex cursor-pointer items-center text-neutral-200 transition-colors hover:text-neutral-50">
      <p className="font-medium  ">{sessionData?.user?.name}</p>
      <IconChevronDown
        className={clsx(
          "w-6 transition-transform",
          dropdown ? "rotate-180" : ""
        )}
      />
    </div>
  );

  const dropH = <SigOutButton key={"so"} />;

  return (
    <div className="flex h-12 flex-shrink-0 justify-center bg-neutral-900 font-bold text-neutral-200 dark:border-b dark:border-neutral-800 dark:bg-neutral-900">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>
          <h2 className="font-light">Track Your Life</h2>
        </Link>

        {sessionData && (
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
