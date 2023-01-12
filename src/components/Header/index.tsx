import Button from "@components/_UI/Button";
import Dropdown from "@components/_UI/Dropdown";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <div className="flex h-12 flex-shrink-0 justify-center bg-black  font-bold text-white">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>Track Your Life</Link>

        {sessionData && (
          <div className="relative flex items-center gap-2">
            <p
              onClick={() => {
                setDropdown(!dropdown);
              }}
              className="cursor-pointer"
            >
              {sessionData?.user?.name}
            </p>
            <Dropdown
              isOpened={dropdown}
              content={[<SigOutButton key={"so"} />]}
              className="w-fit"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
