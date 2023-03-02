import { type GetServerSidePropsContext, type NextPage } from "next";
import Head from "next/head";
import DiaryRecord from "../components/diaryRecord";
import PageWrapper from "../components/pageWrapper";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";

const Home: NextPage = ({}) => {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.records.listRecords.useInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  // useInfiniteQuery return data in groups the size of the set limit... Annoying AF unless flatmapped into one long array...
  const records = data?.pages.flatMap((page) => page.records) ?? [];

  return (
    <PageWrapper showHeader={true}>
      <Head>
        <title>UpShop - Dashboard</title>
      </Head>
      <main className="flex h-full w-full flex-col gap-2">
        {records.map((record) => {
          return (
            <DiaryRecord
              key={record.id}
              id={record.id}
              userId={record.userId}
              userName={record.user.name}
              programmingLanguage={record.programmingLanguage}
              timeSpent={record.timeSpent}
              date={record.date}
              description={record.description}
              rating={record.rating}
            />
          );
        })}

        <div>
          {hasNextPage ? (
            <button
              disabled={isFetching}
              className="btn-primary btn mb-40 mt-4 w-full items-center rounded-md text-lg font-bold text-white"
              onClick={() => {
                void fetchNextPage();
              }}
            >
              Load more records
            </button>
          ) : (
            <span className="mb-40 mt-4 text-center">
              {"No more records :("}
            </span>
          )}
        </div>
      </main>
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

export default Home;
