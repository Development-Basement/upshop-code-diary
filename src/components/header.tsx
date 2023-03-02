import { Dialog, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState, type FC } from "react";
import { FiLogOut } from "react-icons/fi";
// Next font not working with headless Dialog by default, idk why, just set it manually in Dialog.Pannel
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { inter } from "../pages/_app";
import { type DiaryRecord } from "../server/api/routers/records";
import { DiaryRecordParser } from "../types/record";
import { api } from "../utils/api";
import { dayts } from "../utils/day";

const Header: FC = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin ?? false;

  const router = useRouter();

  const [signOutDisabled, setSignOutDisabled] = useState(false);

  // Idk, it's not really neccesary to do it this way for a few links, but doesn't hurt either...
  const unprotectedLinks = {
    Dashboard: "/",
    "My records": "/myRecords",
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
    reset();
    setRatingValue(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setIsOpen(false);
  }

  function openModal() {
    reset();
    setRatingValue(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setIsOpen(true);
  }

  const DiaryRecordSchema = DiaryRecordParser.omit({ id: true });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    trigger,
  } = useForm<DiaryRecord>({
    resolver: zodResolver(DiaryRecordSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setValue(
      "timeSpent",
      dayts
        .duration({ hours: hours, minutes: minutes, seconds: seconds })
        .toISOString(),
    );
    void trigger("timeSpent");
  }, [hours, minutes, seconds, setValue, trigger]);

  const [ratingValue, setRatingValue] = useState(0);

  const handleRatingValueUpdate = (newValue: number) => {
    if (newValue === ratingValue) {
      setRatingValue(0);
    } else {
      setRatingValue(newValue);
    }
  };

  useEffect(() => {
    setValue("rating", ratingValue);
  }, [ratingValue, setValue]);

  const onSubmit = (data: DiaryRecord) => {
    const timezoneOffset = data.date.getTimezoneOffset();
    if (timezoneOffset > 0) {
      data.date = dayts(data.date).subtract(timezoneOffset, "minutes").toDate();
    } else {
      data.date = dayts(data.date).add(timezoneOffset, "minutes").toDate();
    }
    createRecord({
      date: data.date,
      rating: data.rating,
      timeSpent: data.timeSpent,
      description: data.description,
      programmingLanguage: data.programmingLanguage,
    });

    closeModal();
  };

  const { mutate: createRecord } = api.records.createRecord.useMutation();

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

                  <form
                    className="mt-4 flex flex-col gap-4"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onSubmit={handleSubmit((data) => onSubmit(data))}
                  >
                    {/* Language */}
                    <div className="flex flex-col gap-1">
                      <input
                        id="language"
                        className={`${
                          errors.programmingLanguage
                            ? "input-error"
                            : "input-primary"
                        } input w-full`}
                        placeholder="language"
                        {...register("programmingLanguage")}
                      />

                      <div className="">
                        <label
                          htmlFor="language"
                          className=" mr-1 text-sm font-light text-slate-400"
                        >
                          Programming Language
                        </label>

                        {errors.programmingLanguage && (
                          <span className="text-sm text-red-500">
                            must be specified!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-1">
                      <input
                        id="date"
                        type="Date"
                        className={`${
                          errors.date ? "input-error" : "input-primary"
                        } input w-full`}
                        {...register("date", { valueAsDate: true })}
                      />

                      <div className="">
                        <label
                          htmlFor="date"
                          className=" mr-1 text-sm font-light text-slate-400"
                        >
                          Date
                        </label>

                        {errors.date && (
                          <span className="text-sm text-red-500">
                            must be specified!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Time spent */}
                    <div className="flex flex-col gap-1">
                      <div className="grid max-w-full grid-cols-3 gap-2">
                        <div className="flex flex-col gap-0.5">
                          <label
                            htmlFor="hours"
                            className="text-sm font-light text-slate-400"
                          >
                            Hours
                          </label>
                          <input
                            id="hours"
                            type="number"
                            min={0}
                            value={hours}
                            onChange={(e) => setHours(Number(e.target.value))}
                            className={`${
                              errors.timeSpent ? "input-error" : "input-primary"
                            } input`}
                          />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label
                            htmlFor="minutes"
                            className="text-sm font-light text-slate-400"
                          >
                            Minutes
                          </label>
                          <input
                            id="minutes"
                            type="number"
                            min={0}
                            max={59}
                            value={minutes}
                            onChange={(e) => setMinutes(Number(e.target.value))}
                            className={`${
                              errors.timeSpent ? "input-error" : "input-primary"
                            } input`}
                          />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label
                            htmlFor="seconds"
                            className="text-sm font-light text-slate-400"
                          >
                            Seconds
                          </label>
                          <input
                            id="seconds"
                            type="number"
                            min={0}
                            max={59}
                            value={seconds}
                            onChange={(e) => setSeconds(Number(e.target.value))}
                            className={`${
                              errors.timeSpent ? "input-error" : "input-primary"
                            } input`}
                          />
                        </div>
                      </div>

                      <div className="">
                        <label
                          htmlFor="timeSpent"
                          className=" mr-1 text-sm font-light text-slate-400"
                        >
                          Duration
                        </label>

                        {errors.timeSpent && (
                          <span className="text-sm text-red-500">
                            cannot be zero!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                      <textarea
                        id="description"
                        rows={4}
                        className={`${
                          errors.description ? "input-error" : "input-primary"
                        } input w-full`}
                        placeholder="my description"
                        {...register("description")}
                      />

                      <div className="">
                        <label
                          htmlFor="description"
                          className=" mr-1 text-sm font-light text-slate-400"
                        >
                          Description
                        </label>

                        {errors.description && (
                          <span className="text-sm text-red-500">
                            must be provided!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-1">
                      <div className="rating">
                        <input
                          type="radio"
                          name="rating-4"
                          className="hidden"
                          checked={ratingValue === 0}
                          onChange={() => handleRatingValueUpdate(0)}
                        />
                        <input
                          type="radio"
                          name="rating-4"
                          className="mask mask-star-2 bg-green-500"
                          checked={ratingValue === 1}
                          // onChange={() => handleRatingValueUpdate(1)}
                          onClick={() => handleRatingValueUpdate(1)}
                        />
                        <input
                          type="radio"
                          name="rating-4"
                          className="mask mask-star-2 bg-green-500"
                          checked={ratingValue === 2}
                          // onChange={() => handleRatingValueUpdate(2)}
                          onClick={() => handleRatingValueUpdate(2)}
                        />
                        <input
                          type="radio"
                          name="rating-4"
                          className="mask mask-star-2 bg-green-500"
                          checked={ratingValue === 3}
                          // onChange={() => handleRatingValueUpdate(3)}
                          onClick={() => handleRatingValueUpdate(3)}
                        />
                        <input
                          type="radio"
                          name="rating-4"
                          className="mask mask-star-2 bg-green-500"
                          checked={ratingValue === 4}
                          // onChange={() => handleRatingValueUpdate(4)}
                          onClick={() => handleRatingValueUpdate(4)}
                        />
                        <input
                          type="radio"
                          name="rating-4"
                          className="mask mask-star-2 bg-green-500"
                          checked={ratingValue === 5}
                          // onChange={() => handleRatingValueUpdate(5)}
                          onClick={() => handleRatingValueUpdate(5)}
                        />
                      </div>
                      <div className="">
                        <label
                          htmlFor="rating"
                          className=" mr-1 text-sm font-light text-slate-400"
                        >
                          {`Rating: ${ratingValue}/5 (click again on currently selected rating for 0)`}
                        </label>
                      </div>
                    </div>

                    {errors.rating && <span>{errors.rating.message}</span>}

                    <div className="flex w-full justify-end">
                      <button
                        type="submit"
                        className="btn-primary btn text-white"
                      >
                        Create
                      </button>
                    </div>
                  </form>
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
