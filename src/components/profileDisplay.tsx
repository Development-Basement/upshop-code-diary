import { useSession } from "next-auth/react";
import { type FC } from "react";
import { MdAdminPanelSettings, MdEdit } from "react-icons/md";
import { dayts } from "../utils/day";

export type ProfileDisplayProps = {
  id: string;
  name: string;
  createdAt: Date;
  isAdmin: boolean;
  onEditClick: (userId: string) => void;
};

const ProfileDisplay: FC<ProfileDisplayProps> = ({
  id,
  name,
  createdAt,
  isAdmin,
  onEditClick,
}) => {
  const { data: userData } = useSession();
  const isSelf = userData?.user.id === id;
  return (
    <div
      className={`mt-2 h-fit snap-start bg-tsbg1 p-5 shadow-thin-under-strong outline-1 outline-bgdark1 ${
        isSelf ? "outline" : ""
      }`}
    >
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
          disabled={isSelf}
          title="Edit user"
          onClick={() => onEditClick(id)}
        >
          <MdEdit className="text-2xl" />
        </button>
      </div>
      <p className="text-sm">created on {dayts(createdAt).toString()}</p>
    </div>
  );
};

export default ProfileDisplay;
