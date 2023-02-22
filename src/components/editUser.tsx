import type { FC } from "react";

const EditUser: FC = () => {
  return (
    <div className="my-2 h-fit bg-black bg-opacity-25 p-5 shadow-md">
      <form className="flex w-full flex-col">
        <input
          type="username"
          placeholder="username"
          className="input-bordered input-primary input mb-2"
        />
        <p className="ml-3 mb-2 text-sm">created at:</p>
        <input
          type="password"
          placeholder="new password"
          className="input-bordered input-primary input mb-2"
        />
        <input
          type="password"
          placeholder="repeat new password"
          className="input-bordered input-primary input mb-2"
        />
        <div className="flex flex-row">
          <button className="btn-error btn">Delete</button>
          <button className="btn-disabled btn mr-2 ml-auto">Discard</button>
          <button className="btn-primary btn">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
