import { NextPage } from "next";
import Link from "next/link";
import PageWrapper from "../components/pageWrapper";

const custom404: NextPage = () => {
  return (
    <PageWrapper showHeader={false}>
      <main className="flex w-1/2 flex-col items-center justify-center gap-8 pb-14">
        <span className="flex flex-col items-center justify-center">
          <span className="text-[8rem] font-bold text-white">404</span>
          <p>{"Ops, it seems that what you’re looking for doesn’t exist..."}</p>
        </span>
        <Link href="/" className="font-semibold text-white underline">
          Go back to dashboard
        </Link>
      </main>
    </PageWrapper>
  );
};

export default custom404;
