import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-center bg-black py-3 font-bold text-white">
      <Link href={"/"}>Track Your Life</Link>
    </div>
  );
};

export default Header;
