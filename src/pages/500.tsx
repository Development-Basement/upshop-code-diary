import { NextPage } from "next";
import Link from "next/link";
import PageWrapper from "../components/pageWrapper";

const custom500: NextPage = () => {
  return (
    <PageWrapper showHeader={false}>
      <main className="flex w-1/2 flex-col items-center justify-center gap-8 pb-14">
        <span className="flex flex-col items-center justify-center">
          <span className="text-[8rem] font-bold text-white">500</span>
          <p>
            {
              "There has been an internal error on the server, please make sure you followed all the instructions or try again later :("
            }
          </p>
        </span>
        <Link href="/" className="font-semibold text-white underline">
          Go back to dashboard
        </Link>
      </main>
    </PageWrapper>
  );
};

export default custom500;
