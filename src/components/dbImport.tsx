import { type FC } from "react";

const DbImport: FC = () => {
  return (
    <div className="w-full bg-tsbg1 p-5">
      <h1 className="mb-4 text-2xl text-white">Upload backup</h1>
      <button className="btn-primary btn">Select from disk</button>
    </div>
  );
};

export default DbImport;
