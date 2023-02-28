import { Dialog, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState, type FC } from "react";
import { FiLogOut } from "react-icons/fi";
// Next font not working with headless Dialog by default, idk why, just set it manually in Dialog.Pannel
import { inter } from "../pages/_app";

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
    await router.push("/login");
    setSignOutDisabled(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div className="sticky top-0 flex w-full items-center bg-bgdark1 px-5 py-4 text-lg text-white shadow-thin-under-strong">
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {/* The screen darkening part */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full max-w-md overflow-hidden rounded-2xl bg-bgdark1 p-6 text-left align-middle font-sans ${inter.variable} text-white shadow-xl transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Create new record
                  </Dialog.Title>

                  <div className="mt-4 flex w-full justify-end">
                    <button
                      type="button"
                      className="btn-primary btn text-white"
                      onClick={closeModal}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Image src="/logoV3.png" alt="logo" width={40} height={40} className="" />
      <div className="ml-auto flex gap-8">
        {/* Admin links */}
        {isAdmin &&
          Object.entries(adminProtectedLinks).map((link) => (
            <Link
              key={link[0]}
              href={link[1]}
              className={`${"link"} ${
                currentURL === link[1] ? "underline" : "no-underline"
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
              currentURL === link[1] ? "underline" : "no-underline"
            }`}
          >
            {link[0]}
          </Link>
        ))}

        {/* Action buttons */}
        <button
          className="link-primary link no-underline"
          onClick={() => openModal()}
        >
          Create
        </button>
        <button
          disabled={signOutDisabled}
          onClick={() => void handleSignOut()}
          title="Sign out"
          className="text-red-500 outline-2 outline-offset-2 outline-current focus:outline disabled:text-gray-500 hover:text-red-700"
        >
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Header;
