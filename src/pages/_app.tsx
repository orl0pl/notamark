import "../styles/globals.css";
import React, { useEffect, useState } from "react";
import { Roboto_Flex } from "next/font/google";
import {
  ThemeProvider as MD3ThemeProvider,
  useTheme as useMD3Theme,
} from "md3-react";
import Head from "next/head";

const roboto = Roboto_Flex({
  subsets: ["latin"],
  weight: /*"variable"*/ ["400", "500"],
});
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import GlobalStyle from "@/styles/globalStyle";
import { useTheme } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  useThemeSync();
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
// const AppWithThemeLoaded = (props: AppProps) => {
//   const { setTheme, theme } = useTheme();
//   const {toggleTheme, theme: md3Theme} = useMD3Theme();
//   console.log(toggleTheme.toString(), 'ths')
//   useEffect(() => {
//     localStorage.setItem("theme", theme || "light");
//     console.log(theme, 'lustawiony')
//   }, [theme]);
//   useEffect(()=>{
//     console.log(toggleTheme.toString(), 'sths')
//     const ltheme = localStorage.getItem('theme')
//     console.log(theme === "dark" ? "dark" : "light", 'new2')
//     console.log(ltheme === "dark" ? "dark" : "light", 'lnew2')
//     console.log(md3Theme, 'md3 przed')
//     console.log(theme, 'l')
//     console.log(theme === 'dark' ? 'dark' : 'light', 'ustawiony')
//     toggleTheme(theme === 'dark' ? 'dark' : 'light')
//     toggleTheme(ltheme === 'dark' ? 'dark' : 'light')
//     console.log(md3Theme, 'md3 po')

//   }, [theme, toggleTheme, md3Theme])

//   return <MD3ThemeProvider><MyApp {...props} /></MD3ThemeProvider>;
// };

function useThemeSync() {
  const { theme: nextThemesTheme, setTheme: setNextThemesTheme } = useTheme();
  const { toggleTheme: toggleMD3Theme, theme: md3Theme, updateSourceColor, sourceColor } = useMD3Theme();
  const [updated, setIsUpdated] = useState(false)
  const [colUpdated, setColIsUpdated] = useState(false)

  useEffect(()=>{
    console.log(updateSourceColor.toString(), colUpdated, sourceColor)
    if(!colUpdated){
      updateSourceColor('#519d5e');
      setColIsUpdated(true)
    }
  }, [colUpdated, sourceColor, updateSourceColor])
  useEffect(() => {
    if(!updated){
      if(toggleMD3Theme.toString() !== '()=>{}'){
        if (md3Theme !== nextThemesTheme) {
          toggleMD3Theme(nextThemesTheme === "dark" ? "dark" : "light");
          setIsUpdated(true)
        }
      }
    }
    console.log(md3Theme, nextThemesTheme, toggleMD3Theme.toString(), updated, 'test')
    
  }, [md3Theme, nextThemesTheme, toggleMD3Theme, updated]);
}

function AppWithThemeLoaded(props: AppProps) {
  return (
    <MD3ThemeProvider>
      <MyApp {...props} />
    </MD3ThemeProvider>
  );
}

const AppWithI18n = appWithTranslation(AppWithThemeLoaded);

const AppWithAuth = (props: AppProps) => (
  <ThemeProvider attribute="class">
    <SessionProvider session={props.pageProps.session}>
      <AppWithI18n {...props} />
    </SessionProvider>
  </ThemeProvider>
);

export default AppWithAuth;
