import { useSession } from "next-auth/react";
import { useState, type FC } from "react";
import { dayts } from "../utils/day";

const DbExport: FC = () => {
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: session } = useSession();
  const url = `/api/db/${session?.user.id ?? ""}/export`;
  const fileName = `${session?.user.id ?? ""}-${dayts().format(
    "YYYY-MM-DD",
  )}.csv`;

  return (
    <div className="w-full bg-tsbg1 p-5">
      <h1 className="mb-4 text-2xl capitalize text-white">download backup</h1>
      <p className="mb-4">
        Downloading backup will create a file containing all records you have
        posted. Generating this file{" "}
        <span className="font-semibold">might take a while!</span> After it is
        generated, it will start downloading automatically.
      </p>
      <a
        className="btn-primary btn"
        download={fileName}
        href={url}
        role="button"
      >
        download
      </a>
    </div>
  );
};

export default DbExport;
