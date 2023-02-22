import type { FC } from "react";

export type ProfileDisplayProps = {
  name: string;
  created: Date;
  key: number;
};

const ProfileDisplay: FC<ProfileDisplayProps> = ({ name, created }) => {
  return (
    <div className="mt-2 h-fit bg-black bg-opacity-25 p-5 shadow-md">
      <h2 className="mb-1 text-lg text-white">{name}</h2>
      <p className="text-sm">created at: {created.toISOString()}</p>
    </div>
  );
};

export default ProfileDisplay;
