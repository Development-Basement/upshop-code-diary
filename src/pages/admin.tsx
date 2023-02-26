import { type GetServerSidePropsContext, type NextPage } from "next";
import DbManagement from "../components/dbManagement";
import Header from "../components/header";
import ManageUsers from "../components/manageUsers";
import PageWrapper from "../components/pageWrapper";
import { getServerAuthSession } from "../server/auth";

const AdminDashboard: NextPage = () => {
  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-bgdark1 to-bgdark3">
      <Header />
      <PageWrapper>
        <DbManagement />
        <ManageUsers />
      </PageWrapper>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  if (!session.user.isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default AdminDashboard;
