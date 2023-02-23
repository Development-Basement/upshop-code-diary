import { FC } from "react";

const UploadBackup: FC = () => {
  return (
    <div className="absolute top-0 left-0 h-full min-h-screen w-full bg-zinc-800/75 backdrop-blur-sm">
      <div className="mx-auto flex h-screen w-[32rem] flex-col items-center justify-center">
        <div className="w-full bg-zinc-600 p-5">
          <h1 className="mb-4 text-2xl text-white">Upload backup</h1>
          <button className="btn-primary btn">Select from disk</button>
        </div>
      </div>
    </div>
  );
};

export default UploadBackup;
