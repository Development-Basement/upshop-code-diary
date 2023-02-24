import type { FC } from "react";

const DbManagement: FC = () => {
  return (
    <>
      <div className="bg-zinc-800 p-4">
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

export default DbManagement;
