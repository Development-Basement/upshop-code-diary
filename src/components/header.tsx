import Image from "next/image";
import type { FC } from "react";
import logo from "../../public/LogoV3.png";

const Header: FC = () => {
  return (
    <div className="sticky top-0 mb-2 flex h-16 w-full items-center bg-zinc-600 px-3 text-lg text-white shadow-lg">
      <Image src={logo} alt="logo" width={40} className="" />
      <button className="ml-auto">Dashboard</button>
      <button className="mx-4">Create</button>
      <button className="mr-4"></button>
    </div>
  );
};

export default Header;
