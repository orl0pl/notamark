import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

const AppWithI18n = appWithTranslation(MyApp);

const AppWithAuth = (props: AppProps) => (
  <SessionProvider session={props.pageProps.session}>
    <AppWithI18n {...props} />
  </SessionProvider>
);

export default AppWithAuth;