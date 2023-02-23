import type { FC } from "react";
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
  return (
    <div className="mt-2 h-fit bg-black/25 p-5 shadow-md">
      <div className="flex flex-row text-xl">
        <p className="text-3xl text-white">{name} -&nbsp;</p>
        <p className="mt-auto">
          <span className="text-action-500">{language}</span> for
          <span className="text-white">&nbsp;{duration} minutes</span>
        </p>
      </div>
      <p className="mb-2">{date.toISOString()}</p>
      <div className="mb-2">{description}</div>
      <Stars rating={rating} />
    </div>
  );
};

export default DiaryRecord;
