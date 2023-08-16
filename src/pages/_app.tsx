import "../styles/globals.css";
import React, { useEffect } from "react";
import { Roboto_Flex } from "next/font/google";

const roboto = Roboto_Flex({ subsets: ["latin"] });
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import GlobalStyle from "@/styles/globalStyle";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<GlobalStyle />
			<main className={`${roboto.className} background on-background-text`}>
				<Component {...pageProps} />
			</main>
		</>
	);
}
const AppWithThemeLoaded = (props: AppProps) => {
  const { data: session } = useSession();
  const {setTheme, theme} = useTheme()
  if(session?.user?.preferences?.dark !== undefined && session?.user?.preferences?.dark){
    console.log('theme found:',(session?.user?.preferences?.dark !== undefined && session?.user?.preferences?.dark) ? 'dark' : 'light');
  }
  else {
    console.log('theme not found using:', theme)
  }
	
  if(session?.user?.preferences?.dark !== undefined && session?.user?.preferences?.dark){
    setTheme(session?.user?.preferences?.dark ? 'dark' : 'light')
  }

  useEffect(() => {
	localStorage.setItem('theme', theme || "light")
  }, [theme])
  
  
  return <MyApp {...props}/>
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
