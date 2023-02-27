import { type FC } from "react";
import Stars from "./stars";

// FIXME: duration will be string
// TODO: print durations and dates using day.js
export type DiaryRecordProps = {
  name: string;
  language: string;
  duration: number;
  date: Date;
  description: string;
  rating: number;
};

const DiaryRecord: FC<DiaryRecordProps> = ({
  name,
  language,
  duration,
  date,
  description,
  rating,
}) => {

  const dateObj = new Date(date);

  return (
    <div className="mt-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
      <div className="flex flex-row text-xl">
        <p className="text-3xl text-white">{name} -&nbsp;</p>
        <p className="mt-auto">
          <span className="text-action-500">{language}</span> for
          <span className="text-white">&nbsp;{duration} minutes</span>
        </p>
      </div>
      <p className="mb-2">{`${dateObj.getDate()}. ${dateObj.getMonth()}. ${dateObj.getFullYear()} ${dateObj.toLocaleTimeString([], {hour12: true, hour: "numeric", minute: "2-digit"})}`}</p>
      <div className="mb-2">{description}</div>
      <Stars rating={rating} />
    </div>
  );
};

export default DiaryRecord;
