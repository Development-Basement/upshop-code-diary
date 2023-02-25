import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FormEvent } from "react";
import textLogo from "../../public/textLogo.png";

const Dashboard: NextPage = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signIn("Credentials", {
      redirect: false,
      callbackUrl: "/",
      password: "123456",
      username: "admin",
    })
      .then(() => {})
      .catch(() => {});

    console.log("dfguidsgisryug");
  };

  return (
    <div className="h-full min-h-screen bg-gradient-to-b from-bgdark1 to-bgdark3">
      <div className="mx-auto flex h-screen w-2/5 min-w-[38rem] flex-col items-center justify-center">
        <Image src={textLogo} alt="textLogo" width={300} />
        <p className="mb-5 text-sm">keep track of your coding progress</p>
        <form
          className="flex w-72 flex-col gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            type="text"
            placeholder="username"
            className="input-bordered input-primary input w-full max-w-xs"
          />
          <input
            type="password"
            placeholder="password"
            className="input-bordered input-primary input w-full max-w-xs"
          />
          <button type="submit" className="btn-primary btn mt-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
