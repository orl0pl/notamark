import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Button } from "./common";
export default function AuthButton() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const { pathname, asPath, query } = router;
  if (session) {
    return (
      <>
        <Button
          $type="outline"
          type="button"
          onClick={() => {
            signOut();
          }}
        >
          {t("auth.signOut")}
        </Button>
        Zalogowano jako
        <div className="secondary-container on-secondary-container-text rounded-full w-8 h-8 flex flex-wrap justify-center content-center ">
          {session?.user?.name?.at(0)?.toUpperCase()}
        </div>
      </>
    );
  } else {
    return (
      <Button
        $type="tonal"
        type="button"
        onClick={() => {
          signIn();
        }}
      >
        {t("auth.signIn")}
      </Button>
    );
  }
}
