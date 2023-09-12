import "../styles/globals.css";
import React, { useEffect } from "react";
import { Roboto_Flex } from "next/font/google";
import Head from "next/head";

const roboto = Roboto_Flex({
  subsets: ["latin"],
  weight: "variable" /*["400", "500", "600", "700"]*/,
});
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import GlobalStyle from "@/styles/globalStyle";
import { useTheme } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />

      <main className={`${roboto.className} background on-background-text`}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <Component {...pageProps} />
      </main>
    </>
  );
}
const AppWithThemeLoaded = (props: AppProps) => {
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    localStorage.setItem("theme", theme || "light");
  }, [theme]);

  return <MyApp {...props} />;
};

const AppWithI18n = appWithTranslation(AppWithThemeLoaded);

const AppWithAuth = (props: AppProps) => (
  <ThemeProvider attribute="class">
    <SessionProvider session={props.pageProps.session}>
      <AppWithI18n {...props} />
    </SessionProvider>
  </ThemeProvider>
);

export default AppWithAuth;
