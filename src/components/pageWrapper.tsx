import { type FC } from "react";
import Header from "./header";

type Children = {
  children?: React.ReactNode;
  showHeader: boolean;
};

const PageWrapper: FC<Children> = ({ children, showHeader }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-gradient-to-b from-bgdark1 to-bgdark3">
      {showHeader && <Header />}
      <div className="flex h-full w-[38rem] flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
