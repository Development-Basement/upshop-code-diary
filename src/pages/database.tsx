import { type GetServerSidePropsContext, type NextPage } from "next";
import DbExport from "../components/dbExport";
import DbImport from "../components/dbImport";
import PageWrapper from "../components/pageWrapper";
import { getServerAuthSession } from "../server/auth";

const Database: NextPage = () => {
  return (
    <PageWrapper showHeader={true}>
      <div className="flex h-full w-full flex-col gap-4">
        <div className="flex flex-row items-center bg-bgdark2 p-4">
          <h1 className="text-2xl uppercase">database management</h1>
        </div>
        <DbExport />
        <DbImport />
      </div>
    </PageWrapper>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default Database;
