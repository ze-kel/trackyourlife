import CreateButton from "@components/CreateButton";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex h-12 flex-shrink-0 justify-center bg-black  font-bold text-white">
      <div className="content-container flex h-full w-full items-center justify-between">
        <Link href={"/"}>Track Your Life</Link>
        <CreateButton />
      </div>
    </div>
  );
};

export default Header;
