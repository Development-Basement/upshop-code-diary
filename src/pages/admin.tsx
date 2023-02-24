import { type NextPage } from "next";
import AdminHeader from "../components/adminHeader";
import DbManagement from "../components/dbManagement";
import EditUser from "../components/editUser";
import PageWrapper from "../components/pageWrapper";

const AdminDashboard: NextPage = () => {
  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-zinc-600 to-zinc-900">
      <AdminHeader />
      <PageWrapper>
        <DbManagement />
        <EditUser />
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
