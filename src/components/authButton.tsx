import { signIn, signOut, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Button } from './common';
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
            <Button
            $type='outline'
              type="button"
              onClick={() => {
                signOut();
              }}
            >
              {t('auth.signOut')}
            </Button>
            </>
        )
    }
    else {
        return (
            <Button
            $type='tonal'
            type="button"
            onClick={() => {
              signIn();
            }}
          >
            {t('auth.signIn')}
          </Button>
        )
    }
           
}