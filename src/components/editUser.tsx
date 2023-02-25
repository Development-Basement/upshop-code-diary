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
      <div className="flex flex-row items-center bg-bgdark2 p-4">
        <h1 className="text-2xl">USER MANAGEMENT</h1>
        <button className="btn-primary btn mr-2 ml-auto">Add New User</button>
      </div>
      <div className="my-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
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

export default EditUser;
