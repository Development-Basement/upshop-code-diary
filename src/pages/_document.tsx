import { Head, Html, Main, NextScript } from "next/document";
import { DEFAULT_THEME } from "../contexts/themeContext";

export default function Document() {
  // we can also add head here
  return (
    <Html
      data-theme={DEFAULT_THEME}
      className={DEFAULT_THEME === "dark" ? "dark" : undefined}
    >
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
