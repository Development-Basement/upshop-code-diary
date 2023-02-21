import { type NextPage } from "next";
import DiaryRecord from "../../components/diaryRecord";
import PageWrapper from "../../components/pageWrapper";

const Dashboard: NextPage = () => {
  return (
    <PageWrapper>
      <DiaryRecord/>
    </PageWrapper>
  );
};

export default Dashboard;
