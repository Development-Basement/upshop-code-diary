import { type NextPage } from "next";
import Image from "next/image";
import textLogo from "../../public/textLogo.png";

const Dashboard: NextPage = () => {
  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-bgdark1 to-bgdark3">
      <div className="mx-auto flex h-screen w-2/5 min-w-[38rem] flex-col items-center justify-center">
        <Image src={textLogo} alt="textLogo" width={300} />
        <p className="mb-5 text-sm">keep track of your coding progress</p>
        <form className="flex w-72 flex-col gap-2">
          <input
            type="username"
            placeholder="username"
            className="input-bordered input-primary input w-full max-w-xs"
          />
          <input
            type="password"
            placeholder="password"
            className="input-bordered input-primary input w-full max-w-xs"
          />
          <button className="btn-primary btn mt-2">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
