import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Button } from "./common";
import Icon from "@mdi/react";
import { mdiTranslate } from "@mdi/js";

export default function LanguageChangeButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;
  return (
    <>
      <Button
        $type="outline"
        type="button"
        onClick={() => {
          router.push({ pathname, query }, asPath, {
            locale: router.locale === "pl" ? "en" : "pl",
          });
        }}
      >
        <Icon className="w-5" path={mdiTranslate} />
        {router.locale === "pl" ? "English" : "Polski"}
      </Button>
    </>
  );
}
