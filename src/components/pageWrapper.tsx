import { type FC } from "react";
import Header from "./header";

type Children = {
  children?: React.ReactNode;
  showHeader: boolean;
};

const PageWrapper: FC<Children> = ({ children, showHeader }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-b from-bgdark1 to-bgdark3">
      {showHeader && <Header />}
      <div className="flex h-full max-h-full w-[40rem] flex-col items-center justify-center overflow-auto px-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600 scrollbar-thumb-rounded-full">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
