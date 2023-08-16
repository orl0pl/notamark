import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
export default function AuthButton() {
    const { t } = useTranslation();
    const { data: session } = useSession();
    const router = useRouter();
    const { pathname, asPath, query } = router;
    if (session) {
        return (
            <>
            <h4>
              {t('welcome')} {JSON.stringify(session.user)}
            </h4>
            <button
              type="button"
              onClick={() => {
                signOut();
              }}
            >
              {t('auth.signOut')}
            </button>
            </>
        )
    }
    else {
        return (
            <button
            type="button"
            onClick={() => {
              signIn();
            }}
          >
            {t('auth.signIn')}
          </button>
        )
    }
           
}