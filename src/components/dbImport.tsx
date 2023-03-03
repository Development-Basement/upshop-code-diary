import { Dialog, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment, useRef, useState, type FC } from "react";
import { inter } from "../pages/_app";

const DbImport: FC = () => {
  const cancelButtonRef = useRef(null);
  const dataCellRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const link = `/api/db/${session?.user.id ?? ""}/import`;

  const closeModal = () => {
    setModalOpen(false);
    setError("");
  };

  const onImport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setImporting(true);
    e.preventDefault();
    try {
      if (!dataCellRef.current?.files?.[0]) throw new Error("No file selected");
      const body = new FormData();
      body.append("file", dataCellRef.current.files[0]);
      const res = await fetch(link, {
        method: "POST",
        body,
      });
      if (!res.ok) {
        throw new Error("Error with request, code is " + res.status.toString());
      }
      closeModal();
    } catch (cause) {
      if (cause instanceof Error) {
        setError(cause.message);
      } else {
        console.error(cause);
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="w-full bg-tsbg1 p-5">
      <h1 className="mb-4 text-2xl capitalize text-white">import backup</h1>
      <p className="mb-4">
        Importing a backup will{" "}
        <span className="font-semibold text-white">
          replace all current user data!
        </span>{" "}
        This action is{" "}
        <span className="font-semibold text-white">irreversible!</span> Make
        sure you have a backup of your current data before proceeding!
      </p>
      <p className="mb-4 font-semibold text-white">
        Unfortunately, this feature{" "}
        <span className="text-error">does not work yet</span>. Sorry! If you
        really need to import data, please contact us, or do it manually through
        the API.
      </p>
      <form
        className="flex gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setModalOpen(true);
        }}
      >
        <input
          ref={dataCellRef}
          type="file"
          name="import"
          className="file-input-primary file-input w-full"
          required
          accept="text/csv"
        />
        <button className="btn-outline btn-error btn" type="submit">
          import
        </button>
      </form>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog
          initialFocus={cancelButtonRef}
          onClose={() => {
            closeModal();
          }}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel
              className={`${inter.variable} w-full max-w-lg overflow-hidden rounded-2xl bg-bgdark1 p-8 text-left align-middle font-sans text-white shadow-xl transition-all`}
            >
              <Dialog.Title as="h3" className="text-xl font-medium leading-6">
                Are you sure you want to overwrite current record data?
              </Dialog.Title>
              <div className="mt-4 mb-6">
                <p className="text-sm text-neutral-content">
                  This action cannot be undone! Make sure you have a backup.
                </p>
                <p className="mt-2 font-semibold text-error">
                  Unfortunately, this feature does not work yet. Sorry! If you
                  really need to import data, please contact us, or do it
                  manually through the API.
                </p>
              </div>
              {error && (
                <p className="mb-2 text-sm text-error">
                  There was an error importing records: {error}
                </p>
              )}
              <div className="flex place-content-between">
                <button
                  ref={cancelButtonRef}
                  onClick={() => closeModal()}
                  className="btn-primary btn order-last"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => void onImport(e)}
                  className={`btn-error btn mr-auto ${
                    importing ? "loading" : ""
                  }`}
                  disabled={true || importing}
                >
                  {importing ? "importing..." : "confirm"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DbImport;
