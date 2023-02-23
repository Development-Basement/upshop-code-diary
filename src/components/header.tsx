import { useSession } from "next-auth/react";
import Image from "next/image";
import type { FC } from "react";
import logo from "../../public/LogoV3.png";

const Header: FC = () => {
  // TODO: add admin links if the user is an admin
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin ?? false;

  return (
    <div className="sticky top-0 mb-2 flex h-16 w-full items-center bg-zinc-600 px-3 text-lg text-white shadow-lg">
      <Image src={logo} alt="logo" width={40} className="" />
      <div className="ml-auto flex gap-8">
        {/* These should be links, probably with h-full, so they can be selected easier? */}
        <button className="">Dashboard</button>
        {/* create is an action, maybe make it different? */}
        <button className="">Create</button>
        <button className=""></button>
      </div>
    </div>
  );
};

export default Header;
