import type { FC } from "react";

type Children = {
  children?: React.ReactNode;
};

const PageWrapper: FC<Children> = ({ children }) => {
  return <div className="mx-auto h-full w-2/5 min-w-[38rem]">{children}</div>;
};

export default PageWrapper;
