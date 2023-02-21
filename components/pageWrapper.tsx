import type { FC } from "react";

type Props = {
  children?: React.ReactNode;
};

const PageWrapper: FC<Props> = ({ children }) => {
  return <div className="mx-auto w-2/5">{children}</div>;
};

export default PageWrapper;
