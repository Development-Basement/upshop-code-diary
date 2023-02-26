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

  const [signOutDisabled, setSignOutDisabled] = useState(false);

  // Idk, it's not really neccesary to do it this way for a few links, but doesn't hurt either...
  const unprotectedLinks = {
    Dashboard: "/",
  };

  const adminProtectedLinks = {
    Admin: "/admin",
  };

  const currentURL = router.asPath;

  const handleSignOut = async () => {
    setSignOutDisabled(true);
    await signOut({ redirect: false });
    await router.push("/signin");
    setSignOutDisabled(false);
  };

  return (
    <div className="sticky top-0 mb-2 flex h-20 w-full items-center bg-bgdark1 px-5 text-lg text-white shadow-thin-under-strong">
      <Image src="/logoV3.png" alt="logo" width={40} height={40} className="" />
      <div className="ml-auto flex gap-8">
        {/* Admin links */}
        {isAdmin &&
          Object.entries(adminProtectedLinks).map((link) => (
            <Link
              key={link[0]}
              href={link[1]}
              className={`${"link"} ${
                currentURL == link[1] ? "underline" : "no-underline"
              }`}
            >
              {link[0]}
            </Link>
          ))}

        {/* General links */}
        {Object.entries(unprotectedLinks).map((link) => (
          <Link
            key={link[0]}
            href={link[1]}
            className={`${"link"} ${
              currentURL == link[1] ? "underline" : "no-underline"
            }`}
          >
            {link[0]}
          </Link>
        ))}

        {/* Action buttons */}
        <button className="link-primary link no-underline">Create</button>
        <button
          disabled={signOutDisabled}
          onClick={() => void handleSignOut()}
          title="Sign out"
          className="text-red-500 outline-2 outline-offset-2 outline-current hover:text-red-700 focus:outline disabled:text-gray-500"
        >
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Header;
