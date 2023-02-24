import { type NextPage } from "next";
import { useContext } from "react";
import { ThemeContext } from "../contexts/themeContext";

const Home: NextPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-200 dark:bg-bgdark2">
      <div className="flex flex-col gap-8">
        <p className="w-fit text-center text-2xl capitalize text-slate-700 dark:text-slate-200">
          Honestly quite{" "}
          <span className="font-bold uppercase text-error">incredible</span>.
        </p>
        <button
          className="btn outline-dotted outline-4 outline-offset-2 outline-slate-500"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          toggle theme``
        </button>
      </div>
    </div>
  );
};

export default Home;
