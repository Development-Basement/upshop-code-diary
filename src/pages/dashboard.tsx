import { type NextPage } from "next";
import { useState } from "react";
import type { DiaryRecordProps } from "../components/diaryRecord";
import DiaryRecord from "../components/diaryRecord";
import Header from "../components/header";
import PageWrapper from "../components/pageWrapper";

const Dashboard: NextPage = () => {
  const [recordProps, _setRecordProps] = useState<DiaryRecordProps[]>([
    {
      name: "Albert Pátík",
      language: "C#",
      duration: 25,
      date: new Date(2022, 3, 22),
      description:
        "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      rating: 3,
    },
    {
      name: "Adam Hrnčárek",
      language: "Typescript",
      duration: 60,
      date: new Date(2022, 3, 22),
      description:
        "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      rating: 4,
    },
    {
      name: "Richard Materna",
      language: "tRPC",
      duration: 40,
      date: new Date(2022, 3, 22),
      description:
        "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet",
      rating: 0,
    },
  ]);

  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-bgdark1 to-bgdark3">
      <Header />
      <PageWrapper>
        {recordProps.map((record, i) => {
          return (
            <DiaryRecord
              key={i}
              name={record.name}
              language={record.language}
              duration={record.duration}
              date={record.date}
              description={record.description}
              rating={record.rating}
            />
          );
        })}
      </PageWrapper>
    </div>
  );
};

export default Dashboard;
