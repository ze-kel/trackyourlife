import Button from "@components/_UI/Button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex h-12 flex-shrink-0 justify-center bg-black  font-bold text-white">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>Track Your Life</Link>

        {sessionData && (
          <div className="flex items-center gap-2">
            <p> {sessionData?.user?.name}</p>
            <Button onClick={() => void signOut()} size="s" theme="inverted">
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
