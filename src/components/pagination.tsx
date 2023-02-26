import { type FC } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type PaginationProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLastPage: boolean;
  isFirstPage?: boolean;
};

const Pagination: FC<PaginationProps> = ({
  page,
  setPage,
  isLastPage,
  isFirstPage,
}) => {
  return (
    <div className="ml-auto flex w-min flex-row items-center justify-end rounded-md bg-tsbg1 outline outline-2 outline-bgdark1">
      <button
        className="btn-ghost btn-square btn-sm btn rounded-none rounded-l-md disabled:bg-transparent"
        disabled={isFirstPage ?? page === 0}
        onClick={() => setPage(page - 1)}
      >
        <MdChevronLeft className="text-2xl" />
      </button>
      <span className="h-full select-none justify-center text-center text-lg">
        <p className="mx-2">{page + 1}</p>
      </span>
      <button
        className="btn-ghost btn-square btn-sm btn rounded-none rounded-r-md disabled:bg-transparent"
        disabled={isLastPage}
        onClick={() => setPage(page + 1)}
      >
        <MdChevronRight className="text-2xl" />
      </button>
    </div>
  );
};

export default Pagination;
