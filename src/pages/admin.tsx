import { type NextPage } from "next";
import DbManagement from "../components/dbManagement";
import EditUser from "../components/editUser";
import Header from "../components/header";
import PageWrapper from "../components/pageWrapper";

const AdminDashboard: NextPage = () => {
  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-bgdark1 to-bgdark3">
      <Header />
      <PageWrapper>
        <DbManagement />
        <EditUser />
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
