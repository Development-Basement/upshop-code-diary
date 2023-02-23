import { type NextPage } from "next";
import { useState } from "react";
import AdminHeader from "../components/adminHeader";
import AreYouSure from "../components/areYouSure";
import EditUser from "../components/editUser";
import PageWrapper from "../components/pageWrapper";
import ProfileDisplay from "../components/profileDisplay";
import UploadBackup from "../components/uploadBackup";

type ProfileDisplayProps = {
  name: string;
  created: Date;
};

const AdminDashboard: NextPage = () => {
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
    <div className="h-full min-h-screen bg-gradient-to-b from-zinc-600 to-zinc-900">
      <AdminHeader />
      <PageWrapper>
        <div className="bg-zinc-800 p-4">
          <h1 className="mb-4 text-2xl">BACKUP MANAGEMENT</h1>
          <div className="flex flex-row">
            <button className="btn-primary btn mr-2">Save backup</button>
            <button className="btn-primary btn">Upload backup</button>
          </div>
        </div>
        <hr className="my-3 border-2 border-solid border-zinc-800" />
        <div className="flex flex-row items-center bg-zinc-800 p-4">
          <h1 className="text-2xl">USER MANAGEMENT</h1>
          <button className="btn-primary btn mr-2 ml-auto">Add New User</button>
        </div>
        <EditUser />
        {profiles.map((profile, i) => {
          return (
            <ProfileDisplay
              name={profile.name}
              created={profile.created}
              key={i}
            />
          );
        })}
      </PageWrapper>
      <UploadBackup />
      <AreYouSure />
    </div>
  );
};

export default AdminDashboard;
