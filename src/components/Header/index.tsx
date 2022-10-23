import CreateButton from "@components/CreateButton";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex h-12 flex-shrink-0 justify-center bg-black  font-bold text-white">
      <div className="flex h-full w-full max-w-5xl items-center justify-between">
        <Link href={"/"}>Track Your Life</Link>
        <CreateButton />
      </div>
    </div>
  );
};

export default Header;
