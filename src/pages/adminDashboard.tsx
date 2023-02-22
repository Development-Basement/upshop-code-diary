import { type NextPage } from "next";
import AdminHeader from "../components/adminHeader";
import PageWrapper from "../components/pageWrapper";

const AdminDashboard: NextPage = () => {
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
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
