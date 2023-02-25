import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { FiLogOut } from "react-icons/fi";

const Header: FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin ?? false;

  const router = useRouter();

  const [submitDisabled, setSubmitDisabled] = useState(false);

  //Idk, it's not really neccesary to do it this way for few link like this but doesn't hurt either...
  const unprotectedLinks = {
    Dashboard: "/",
  };

  const adminProtectedLinks = {
    Admin: "/admin",
  };

  return (
    <div className="sticky top-0 mb-2 flex w-full items-center bg-bgdark1 px-5 py-4 text-lg text-white shadow-thin-under-strong">
      <Image src="/logoV3.png" alt="logo" width={40} height={40} className="" />
      <div className="ml-auto flex gap-8">
        {/* Admin links */}
        {isAdmin &&
          Object.entries(adminProtectedLinks).map((link) => (
            <Link key={link[0]} href={link[1]}>
              {link[0]}
            </Link>
          ))}

        {/* General links */}
        {Object.entries(unprotectedLinks).map((link) => (
          <Link key={link[0]} href={link[1]}>
            {link[0]}
          </Link>
        ))}

        {/* Action buttons */}
        <button className="">Create</button>
        <button
        disabled={submitDisabled}
          onClick={() =>
            void (async () => {
              setSubmitDisabled(true);
              await signOut({ redirect: false });
              await router.push("/signin");
            })
          }
          className=""
        >
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Header;
