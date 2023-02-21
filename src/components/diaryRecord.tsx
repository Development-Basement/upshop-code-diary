import type { FC } from "react";
import Stars from "./stars";

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
    <div className="mt-2 h-fit bg-black bg-opacity-25 p-5 shadow-md">
      <div className="flex flex-row text-xl">
        <p className="text-3xl text-white">{name} -&#160;</p>
        <p className="mt-auto">
          <span className="text-green-500">{language}</span> for
          <span className="text-white">&#160;{duration} minutes</span>
        </p>
      </div>
      <p className="mb-2">{date.toISOString()}</p>
      <div className="mb-2">{description}</div>
      <Stars rating={rating} />
    </div>
  );
};

export default DiaryRecord;
