import { Button, Center } from "@/components/common";
import { mdiAccountEdit, mdiArrowLeft, mdiKey, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent from "@/components/form";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import { useTranslation } from "next-i18next";

import SERVER_HOST from "../../../url-config";
import { WithId } from "mongodb";
import { Subject } from "../../../lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),

      // Will be passed to the page component as props
    },
  };
}

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(router.query.token?.toString());
  const { t } = useTranslation();
  useEffect(() => {
    setId(router.query.token?.toString() || "loading");
  }, [router.query.token]);
  if (id == "loading") {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else {
    return (
      <FormComponent
        icon={mdiAccountEdit}
        formHeader={t("user.form")}
        inputs={[
          { placeholder: t("user.login"), name: "newLogin" },
          {
            placeholder: t("user.password"),
            name: "newPassword",
            type: "password",
          },
          {
            name: "token",
            type: "hidden",
            value: router.query.token?.toString(),
          },
        ]}
        submitTitle={t("user.form")}
        redirectUrl="/"
        submitUrl="/api/ticket/resolve"
      />
    );
  }
}
