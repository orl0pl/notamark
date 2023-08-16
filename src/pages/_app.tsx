import '../styles/globals.css';
import { Roboto_Flex } from 'next/font/google'
const roboto = Roboto_Flex({ subsets: ['latin']})
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider, useSession } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  const { data: session } = useSession();
  console.log(session?.user?.preferences?.dark)
  return <main className={`roboto.className${session?.user?.preferences?.dark ? ' dark' : ''}`}><Component {...pageProps} /></main>;
}

const AppWithI18n = appWithTranslation(MyApp);

const AppWithAuth = (props: AppProps) => (
  <SessionProvider session={props.pageProps.session}>
    <AppWithI18n {...props} />
  </SessionProvider>
);

export default AppWithAuth;