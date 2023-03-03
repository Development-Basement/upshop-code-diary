import { type FC } from "react";

export type StarProps = {
  rating: number;
  setRating?: (val: number) => void;
};

const Stars: FC<StarProps> = ({ rating, setRating }) => {
  // clamp rating between 0 and 5 (inclusive) in whole numbers
  rating = Math.round(rating);
  rating = Math.max(0, rating);
  rating = Math.min(5, rating);

  const isDisabled = setRating === undefined;
  return (
    <div className="rating">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          type="radio"
          className={`mask mask-star-2 bg-action-500 ${
            isDisabled ? "cursor-default" : "cursor-pointer"
          } ${i === 0 ? "sr-only" : ""}`}
          readOnly={isDisabled}
          disabled={isDisabled}
          checked={rating === i}
          onClick={() => {
            if (!isDisabled) {
              setRating(rating === i ? 0 : i);
            }
          }}
          onChange={() => {}}
          value={i}
          key={i}
        />
      ))}
    </div>
  );
};

export default Stars;
