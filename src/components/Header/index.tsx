import Dropdown from "@components/_UI/Dropdown";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import IconChevronDown from "@heroicons/react/20/solid/ChevronDownIcon";
import clsx from "clsx";
import { useUserSettingsSafe } from "src/helpers/userSettingsContext";
import type { IUserSettings } from "@t/user";
import Selector from "@components/_UI/Selector";

const SigOutButton = () => {
  return (
    <div
      onClick={() => void signOut()}
      className="mt-1 w-full cursor-pointer whitespace-nowrap py-1 text-center text-sm font-normal hover:bg-neutral-200 dark:hover:bg-neutral-800"
    >
      Sign Out
    </div>
  );
};

const DarkModeSelector = () => {
  const { userSettings, changeSettings } = useUserSettingsSafe();

  const mode = userSettings.theme || "system";

  const changeMode = (theme: IUserSettings["theme"]) => {
    changeSettings({ ...useSession, theme });
  };

  return (
    <Selector
      options={[
        { label: "Dark", value: "dark" },
        { label: "System", value: "system" },
        { label: "Light", value: "light" },
      ]}
      setter={changeMode}
      active={mode}
    />
  );
};

const Header = () => {
  const { data: sessionData } = useSession();
  const [dropdown, setDropdown] = useState(false);

  const dropV = (
    <div className="relative flex cursor-pointer items-center transition-colors hover:text-neutral-600 dark:hover:text-neutral-50">
      <p className="font-medium">{sessionData?.user?.name}</p>
      <IconChevronDown
        className={clsx(
          "w-6 transition-transform",
          dropdown ? "rotate-180" : ""
        )}
      />
    </div>
  );

  const dropH = (
    <div className="flex flex-col items-end justify-end">
      <DarkModeSelector />
      <SigOutButton key={"so"} />
    </div>
  );

  return (
    <div className="flex h-12 flex-shrink-0 justify-center border-b border-neutral-300 bg-neutral-50 font-bold text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
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
