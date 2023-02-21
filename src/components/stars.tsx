import type { FC } from "react";

export type StarProps = {
  rating: number;
};

const Stars: FC<StarProps> = ({ rating }) => {
  // clamp rating between 1 and 5 (inclusive) in whole numbers
  rating = Math.round(rating);
  rating = Math.max(1, rating);
  rating = Math.min(5, rating);
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <input
          type="radio"
          // eslint-disable-next-line tailwindcss/classnames-order
          className="mask mask-star-2 cursor-default bg-success"
          disabled
          checked={rating === i}
          key={i}
        />
      ))}
    </div>
  );
};

export default Stars;
