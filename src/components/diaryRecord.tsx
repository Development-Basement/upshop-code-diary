import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState, type FC } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { inter } from "../pages/_app";
import { type DiaryRecord as DiaryRecordType } from "../server/api/routers/records";
import { DiaryRecordParser } from "../types/record";
import { api } from "../utils/api";
import { dayts } from "../utils/day";
import Stars from "./stars";

type DiaryRecordProps = {
  userId: string;
  userName: string;
} & DiaryRecordType;

const DiaryRecord: FC<DiaryRecordProps> = (props) => {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="snap-start snap-normal">
      {isEditing ? (
        <EditRecord {...props} setIsEditing={setIsEditing} />
      ) : (
        <ViewRecord
          {...props}
          serverUserId={session?.user.id ?? ""}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default DiaryRecord;

type EditRecordProps = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
} & DiaryRecordProps;

const EditRecord: FC<EditRecordProps> = (props) => {
  const DiaryRecordSchema = DiaryRecordParser.omit({ id: true });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
  } = useForm<DiaryRecordType>({
    resolver: zodResolver(DiaryRecordSchema),
    defaultValues: {
      rating: props.rating,
      programmingLanguage: props.programmingLanguage,
      date: props.date,
      description: props.description,
      timeSpent: props.timeSpent,
    },
  });

  const [dateValue, setDateValue] = useState(props.date);

  useEffect(() => {
    setValue("date", dateValue);
  }, [dateValue, setValue]);

  const [hours, setHours] = useState(dayts.duration(props.timeSpent).hours());
  const [minutes, setMinutes] = useState(
    dayts.duration(props.timeSpent).minutes(),
  );
  const [seconds, setSeconds] = useState(
    dayts.duration(props.timeSpent).seconds(),
  );

  useEffect(() => {
    setValue(
      "timeSpent",
      dayts
        .duration({ hours: hours, minutes: minutes, seconds: seconds })
        .toISOString(),
    );
    void trigger("timeSpent");
  }, [hours, minutes, seconds, setValue, trigger]);

  const [ratingValue, setRatingValue] = useState(props.rating);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const utils = api.useContext();
  const {
    mutate: updateRecord,
    error: updateError,
    isLoading: editingRecord,
  } = api.records.updateRecord.useMutation();
  const {
    mutate: deleteRecord,
    error: deleteError,
    isLoading: deletingRecord,
  } = api.records.deleteRecord.useMutation();

  const onSubmit: SubmitHandler<DiaryRecordType> = (data) => {
    updateRecord(
      {
        id: props.id,
        record: data,
      },
      {
        onSuccess: () => {
          void utils.records.listRecords.invalidate();
          void utils.records.listUserRecords.invalidate();
          props.setIsEditing(false);
        },
      },
    );
  };

  const onDeleteRecord = () => {
    deleteRecord(
      {
        id: props.id,
      },
      {
        onSuccess: () => {
          void utils.records.listRecords.invalidate();
          void utils.records.listUserRecords.invalidate();
          setDeleteModalOpen(false);
          props.setIsEditing(false);
        },
      },
    );
  };

  useEffect(() => {
    setValue("rating", ratingValue);
  }, [ratingValue, setValue]);

  return (
    <>
      <div className="mt-2 h-fit bg-tsbg3 p-5 shadow-thin-under-strong">
        <div className="flex w-full items-center justify-between">
          <p className="flex items-center gap-2 text-3xl text-slate-400">
            Editing
            <span className=" text-white">{props.userName}&apos;s</span>
            record
          </p>
          <button
            className="btn-ghost btn-square btn-sm btn"
            onClick={() => props.setIsEditing(false)}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>
        <form
          className="mt-4 flex flex-col gap-4"
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <div className="flex flex-col gap-1">
            <input
              id="language"
              className={`${
                errors.programmingLanguage ? "input-error" : "input-primary"
              } input w-full`}
              placeholder="language"
              {...register("programmingLanguage")}
            />
            <div className="-mt-1">
              <label
                htmlFor="language"
                className=" mr-1 text-sm font-light text-slate-400"
              >
                Programming Language
              </label>
              {errors.programmingLanguage && (
                <span className="text-sm text-red-500">
                  must be specified and at most 30 characters!
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <input
              id="date"
              type="Date"
              value={dayts(dateValue).format("YYYY-MM-DD")}
              onChange={(e) => setDateValue(new Date(e.target.value))}
              className={`${
                errors.date ? "input-error" : "input-primary"
              } input w-full`}
            />
            <div className="-mt-1">
              <label
                htmlFor="date"
                className=" mr-1 text-sm font-light text-slate-400"
              >
                Date
              </label>
              {errors.date && (
                <span className="text-sm text-red-500">must be specified!</span>
              )}
            </div>
          </div>
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
            <div className="-mt-1">
              <label
                htmlFor="timeSpent"
                className=" mr-1 text-sm font-light text-slate-400"
              >
                Duration
              </label>
              {errors.timeSpent && (
                <span className="text-sm text-red-500">cannot be zero!</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <textarea
              id="description"
              rows={2}
              className={`${
                errors.description ? "textarea-error" : "textarea-primary"
              } textarea w-full`}
              placeholder="my description"
              {...register("description")}
            />
            <div className="-mt-1">
              <label
                htmlFor="description"
                className=" mr-1 text-sm font-light text-slate-400"
              >
                Description
              </label>
              {errors.description && (
                <span className="text-sm text-red-500">must be provided!</span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Stars rating={ratingValue} setRating={setRatingValue} />
            <div className="-mt-1">
              <label
                htmlFor="rating"
                className=" mr-1 text-sm font-light text-slate-400"
              >
                {`Rating: ${ratingValue}/5 (click again on currently selected rating for 0)`}
              </label>
            </div>
          </div>
          {errors.rating && <span>{errors.rating.message}</span>}
          {updateError && (
            <p className="-mb-2 flex flex-col text-sm text-error">
              There was an error chaning the record: {updateError.message}
            </p>
          )}
          <div className="flex w-full justify-end">
            <button
              type="submit"
              className="btn-primary btn order-last ml-auto"
            >
              Update
            </button>
            <button
              className="btn-error btn"
              disabled={deleteModalOpen}
              onClick={(e) => {
                e.preventDefault();
                setDeleteModalOpen(true);
              }}
            >
              delete
            </button>
          </div>
        </form>
      </div>
      <Transition appear show={deleteModalOpen} as={Fragment}>
        <Dialog
          initialFocus={cancelButtonRef}
          onClose={() => {
            setDeleteModalOpen(false);
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
                Are you sure you want to delete this record?
              </Dialog.Title>
              <div className="mt-4 mb-6">
                <p className="text-sm text-neutral-content">
                  This action is permament and cannot be undone.
                </p>
                {deleteError && (
                  <p className="mt-2 text-sm text-error">
                    There was an error deleting the record:{" "}
                    {deleteError.message}
                  </p>
                )}
              </div>
              <div className="flex place-content-between">
                <button
                  ref={cancelButtonRef}
                  onClick={() => setDeleteModalOpen(false)}
                  className="btn-primary btn order-last"
                >
                  Cancel
                </button>
                <button
                  onClick={onDeleteRecord}
                  className={`btn-error btn mr-auto ${
                    deletingRecord ? "loading" : ""
                  }`}
                  disabled={deletingRecord}
                >
                  {deletingRecord ? "deleting..." : "confirm"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

type ViewRecordProps = {
  serverUserId: string;
} & EditRecordProps;

const ViewRecord: FC<ViewRecordProps> = (props) => {
  return (
    <div className="mt-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row text-xl">
          <p className="text-3xl text-white">{props.userName} -&nbsp;</p>
          <p className="mt-auto">
            <span className="text-action-500">{props.programmingLanguage}</span>{" "}
            for
            <span className="text-white">
              &nbsp;{dayts.duration(props.timeSpent).humanize()}
            </span>
          </p>
        </div>
        {props.userId === props.serverUserId && (
          <button
            className="btn-ghost btn-square btn-sm btn"
            onClick={() => {
              props.setIsEditing(true);
            }}
          >
            <MdEdit className="text-2xl" />
          </button>
        )}
      </div>
      <div className="mb-2">{`${props.date.getDate()}. ${
        props.date.getMonth() + 1
      }. ${props.date.getFullYear()}`}</div>
      <p className="mb-2 whitespace-pre-line">{props.description}</p>
      <Stars rating={props.rating} />
    </div>
  );
};
