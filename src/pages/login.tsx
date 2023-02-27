import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import textLogo from "../../public/textLogo.png";
import PageWrapper from "../components/pageWrapper";

const Dashboard: NextPage = () => {
  const schema = z.object({
    password: z.string().min(1),
    username: z.string().min(1),
  });
  type FormFields = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        password: data.password,
        username: data.username,
      });
      if (res?.ok) {
        await router.push("/");
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setError("Invalid credentials!");
    setLoading(false);
  };

  return (
    <PageWrapper showHeader={false}>
      <Head>
        <title>UpShop - Sign in</title>
      </Head>
      <Image src={textLogo} alt="textLogo" width={300} />
      <p className="mb-5 text-sm">keep track of your coding progress</p>
      <form
        className="flex w-72 flex-col gap-2"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <input
          type="text"
          placeholder="username"
          className={`input-bordered input w-full max-w-xs ${
            errors.username ? "input-error" : "input-primary"
          }`}
          {...register("username")}
        />
        <input
          type="password"
          placeholder="password"
          className={`input-bordered input w-full max-w-xs ${
            errors.password ? "input-error" : "input-primary "
          }`}
          {...register("password")}
        />
        {(errors.username || errors.password || error) && (
          <div className="-mt-1 flex flex-col gap-2 text-error">
            {(errors.username || errors.password) && (
              <p>Both fields must be specified!</p>
            )}
            {error && <p>{error}</p>}
          </div>
        )}
        <button
          type="submit"
          className={`btn-primary btn mt-2 ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "logging in..." : "log in"}
        </button>
      </form>
    </PageWrapper>
  );
};

export default Dashboard;
