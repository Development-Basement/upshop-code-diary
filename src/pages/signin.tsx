import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState, type FormEvent } from "react";
import textLogo from "../../public/textLogo.png";
import PageWrapper from "../components/pageWrapper";

const Dashboard: NextPage = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        redirect: false,
        password: passwordRef.current?.value,
        username: usernameRef.current?.value,
      });
      if (res?.ok) {
        await router.push("/");
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setError("Invalid credentials!");
    if (passwordRef.current) {
      passwordRef.current.value = "";
    }
  };

  return (
    <PageWrapper showHeader={false}>
      <div className="mx-auto flex h-screen w-2/5 min-w-[38rem] flex-col items-center justify-center">
        <Image src={textLogo} alt="textLogo" width={300} />
        <p className="mb-5 text-sm">keep track of your coding progress</p>
        <form
          className="flex w-72 flex-col gap-2"
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
        >
          <input
            ref={usernameRef}
            type="text"
            placeholder="username"
            className="input-bordered input-primary input w-full max-w-xs"
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="password"
            className="input-bordered input-primary input w-full max-w-xs"
          />
          {/* TODO: add cross to setError back to "" (hide it) */}
          {error && <div className="alert alert-error rounded-md">{error}</div>}
          <button type="submit" className="btn-primary btn mt-2">
            Login
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
