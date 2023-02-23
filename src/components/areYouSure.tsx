import { FC } from "react";

const AreYouSure: FC = () => {
  return (
    <div className="absolute top-0 left-0 h-full min-h-screen w-full bg-zinc-800/75 backdrop-blur-sm">
      <div className="mx-auto flex h-screen w-[32rem] flex-col items-center justify-center">
        <div className="w-full bg-zinc-600 p-5">
          <h1 className="mb-4 text-2xl text-white">Are You Sure?</h1>
          <p className="mb-4">
            Uploading backup will inevitably erase all current data and replace
            them with data provided in given backup!
          </p>
          <div className="flex flex-row">
            <button className="btn-primary btn">Discard</button>
            <button className="btn-error btn ml-auto">
              Yes, upload backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreYouSure;
