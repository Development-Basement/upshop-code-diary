import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState, type FormEvent } from "react";
import textLogo from "../../public/textLogo.png";

const Dashboard: NextPage = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // the void (async () => {}) just doesn't work for me... Anywhere I put it, it does nothing...
    signIn("credentials", {
      redirect: false,
      password: passwordRef.current?.value,
      username: usernameRef.current?.value,
    })
      .then((res) => {
        if (res?.ok) {
          // void ( async () => await router.push("/") ) was not working, I don't know why...
          router.push("/").catch(() => {});
        } else {
          setError("user not found, double check your credentials");
          if (usernameRef.current) {
            usernameRef.current.value = "";
          }
          if (passwordRef.current) {
            passwordRef.current.value = "";
          }
        }
      })
      .catch(() => {});
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
          <button type="submit" className="btn-primary btn mt-2">
            Login
          </button>
        </form>
        {error}
      </div>
    </div>
  );
};

export default Dashboard;
