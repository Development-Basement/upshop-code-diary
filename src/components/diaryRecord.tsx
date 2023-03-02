import { useSession } from "next-auth/react";
import { type FC } from "react";
import { AiFillEdit } from "react-icons/ai";
import Stars from "./stars";

// FIXME: duration will be string
// TODO: print durations and dates using day.js
export type DiaryRecordProps = {
  userId: string;
  name: string;
  language: string;
  duration: string;
  date: Date;
  description: string;
  rating: number;
};

const DiaryRecord: FC<DiaryRecordProps> = ({
  userId,
  name,
  language,
  duration,
  date,
  description,
  rating,
}) => {
  const { data: session } = useSession();

  return (
    <div className="mt-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row text-xl">
          <p className="text-3xl text-white">{name} -&nbsp;</p>
          <p className="mt-auto">
            <span className="text-action-500">{language}</span> for
            <span className="text-white">&nbsp;{duration}</span>
          </p>
        </div>
        {userId === session?.user.id && (
          <button>
            <AiFillEdit />
          </button>
        )}
      </div>
      <p className="mb-2">{`${date.getDate()}. ${date.getMonth()}. ${date.getFullYear()}`}</p>
      <div className="mb-2">{description}</div>
      <Stars rating={rating} />
    </div>
  );
};

export default DiaryRecord;
