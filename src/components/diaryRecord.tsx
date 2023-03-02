import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState, type FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEdit } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { DiaryRecord as DiaryRecordType } from "../server/api/routers/records";
import { DiaryRecordParser } from "../types/record";
import { api } from "../utils/api";
import { dayts } from "../utils/day";
import Stars from "./stars";

interface DiaryRecordProps extends DiaryRecordType {
  userId: string;
  userName: string;
}

const DiaryRecord: FC<DiaryRecordProps> = (props) => {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
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

interface EditRecordProps extends DiaryRecordProps {
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const EditRecord: FC<EditRecordProps> = (props) => {
  const DiaryRecordSchema = DiaryRecordParser.omit({ id: true });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
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
  }, [dateValue]);

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

  const utils = api.useContext();
  const { mutate: updateRecord } = api.records.updateRecord.useMutation();

  const onSubmit: SubmitHandler<DiaryRecordType> = (data) => {
    updateRecord(
      {
        id: props.id,
        record: data,
      },
      {
        onSuccess: () => {
          console.log("invalidate");
          void utils.records.listRecords.invalidate();
          void utils.records.listRecordsFromUser.invalidate();
          console.log("invalidated");
        },
      },
    );

    props.setIsEditing(false);
  };

  useEffect(() => {
    setValue("rating", ratingValue);
  }, [ratingValue, setValue]);

  return (
    <div className="mt-2 h-fit bg-tsbg3 p-5 shadow-thin-under-strong">
      <div className="flex w-full items-center justify-between">
        <p className="flex items-center gap-2 text-3xl text-slate-400">
          Editing
          <span className=" text-white">{props.userName}s</span>
          record
        </p>
        <button onClick={() => props.setIsEditing(false)}>
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

          <div className="">
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

          <div className="">
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

          <div className="">
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
              <span className="text-sm text-red-500">must be provided!</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Stars rating={ratingValue} setRating={setRatingValue} />

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
          <button type="submit" className="btn-primary btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

interface ViewRecordProps extends EditRecordProps {
  serverUserId: string;
}

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
            onClick={() => {
              props.setIsEditing(true);
            }}
          >
            <AiFillEdit />
          </button>
        )}
      </div>
      <p className="mb-2">{`${props.date.getDate()}. ${
        props.date.getMonth() + 1
      }. ${props.date.getFullYear()}`}</p>
      <div className="mb-2">{props.description}</div>
      <Stars rating={props.rating} />
    </div>
  );
};
