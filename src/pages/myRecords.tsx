import { type GetServerSidePropsContext, type NextPage } from "next";
import DiaryRecord from "../components/diaryRecord";
import PageWrapper from "../components/pageWrapper";
import { getServerAuthSession } from "../server/auth";
import { api } from "../utils/api";

const MyRecords: NextPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    api.records.listUserRecords.useInfiniteQuery(
      { limit: 10 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  // useInfiniteQuery return data in groups the size of the set limit... Annoying AF unless flatmapped into one long array...
  const records = data?.pages.flatMap((page) => page.records) ?? [];

  return (
    <PageWrapper showHeader={true}>
      <main className="flex h-full w-full flex-col gap-2">
        {records.map((record) => {
          return (
            <DiaryRecord
              key={record.id}
              id={record.id}
              userId={record.user.id}
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
          <button
            disabled={isFetching || !hasNextPage}
            className={`btn-primary btn mt-4 mb-20 w-full items-center rounded-md text-lg font-bold ${
              isFetching ? "loading" : ""
            }`}
            onClick={() => {
              void fetchNextPage();
            }}
          >
            {hasNextPage ? "Load more records" : "No more records :("}
          </button>
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

export default MyRecords;
