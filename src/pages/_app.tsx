import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ThemeContextProvider } from "../contexts/themeContext";
import "../styles/globals.css";
import { api } from "../utils/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeContextProvider>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
