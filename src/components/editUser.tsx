import type { FC } from "react";
import { useState } from "react";
import ProfileDisplay from "./profileDisplay";

type ProfileDisplayProps = {
  name: string;
  created: Date;
};

const EditUser: FC = () => {
  const [profiles, _setProfiles] = useState<ProfileDisplayProps[]>([
    {
      name: "Richard Materna",
      created: new Date("2022-3-25"),
    },
    {
      name: "Adam Hrnčárek",
      created: new Date("2022-3-25"),
    },
    {
      name: "Albert Pátík",
      created: new Date("2022-3-25"),
    },
  ]);
  return (
    <>
      <div className="flex flex-row items-center bg-zinc-800 p-4">
        <h1 className="text-2xl">USER MANAGEMENT</h1>
        <button className="btn-primary btn mr-2 ml-auto">Add New User</button>
      </div>
      <div className="my-2 h-fit bg-black/25 p-5 shadow-md">
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
      {profiles.map((profile, i) => {
        return (
          <ProfileDisplay
            name={profile.name}
            created={profile.created}
            key={i}
          />
        );
      })}
    </>
  );
};

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

export default EditUser;
