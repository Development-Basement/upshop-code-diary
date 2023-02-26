import { type FC } from "react";
import { MdAdminPanelSettings, MdEdit } from "react-icons/md";
import { dayts } from "../utils/day";

export type ProfileDisplayProps = {
  name: string;
  createdAt: Date;
  isAdmin: boolean;
};

const ProfileDisplay: FC<ProfileDisplayProps> = ({
  name,
  createdAt,
  isAdmin,
}) => {
  return (
    <div className="mt-2 h-fit bg-tsbg1 p-5 shadow-thin-under-strong">
      <div className="mb-2 flex flex-row items-center">
        {isAdmin && (
          <MdAdminPanelSettings
            className="mr-2 text-2xl text-info"
            title="Admin user"
          />
        )}
        <h2 className="text-lg text-white">{name}</h2>
        <button
          className="btn-ghost btn-square btn-sm btn ml-auto"
          disabled={isAdmin}
          title="Edit user"
        >
          <MdEdit className="text-2xl" />
        </button>
      </div>
      <p className="text-sm">created on {dayts(createdAt).toString()}</p>
    </div>
  );
};

export default ProfileDisplay;
