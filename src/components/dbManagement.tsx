import type { FC } from "react";

const DbManagement: FC = () => {
  return (
    <>
      <div className="bg-bgdark1 p-4">
        <h1 className="mb-4 text-2xl">BACKUP MANAGEMENT</h1>
        <div className="flex flex-row">
          <button className="btn-primary btn mr-2">Save backup</button>
          <button className="btn-primary btn">Upload backup</button>
        </div>
      </div>
      <hr className="my-3 border-2 border-solid border-zinc-800" />
    </>
  );
};

const UploadBackup: FC = () => {
  return (
    <div className="absolute top-0 left-0 h-full min-h-screen w-full bg-tsbg3 backdrop-blur-sm">
      <div className="mx-auto flex h-screen w-[32rem] flex-col items-center justify-center">
        <div className="w-full bg-tsbg1 p-5">
          <h1 className="mb-4 text-2xl text-white">Upload backup</h1>
          <button className="btn-primary btn">Select from disk</button>
        </div>
      </div>
    </div>
  );
};

const AreYouSure: FC = () => {
  return (
    <div className="absolute top-0 left-0 h-full min-h-screen w-full bg-tsbg3 backdrop-blur-sm">
      <div className="mx-auto flex h-screen w-[32rem] flex-col items-center justify-center">
        <div className="w-full bg-tsbg1 p-5">
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

export default DbManagement;
