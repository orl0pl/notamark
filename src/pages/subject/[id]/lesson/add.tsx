import { Button, Center } from "@/components/common";
import { mdiArrowLeft, mdiKey, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent from "@/components/form";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import { useTranslation } from "next-i18next";

import SERVER_HOST from "../../../../../url-config";
import { WithId } from "mongodb";
import { Subject } from "../../../../../lib/types";
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

async function formSubmit(event: FormEvent<HTMLFormElement>) {
  console.log(event.currentTarget);
  const formData = new FormData(event.currentTarget);
  const response = await fetch("/api/lesson/add", {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  alert(json);
}

export default function Page() {
  const router = useRouter();
  const [id, setId] = useState(router.query.id?.toString());
  const { t } = useTranslation();
  useEffect(() => {
    setId(router.query.id?.toString() || "loading");
  }, [router.query.id]);
  if (id == "loading") {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else {
    return (
      <FormComponent
        icon={mdiPlus}
        formHeader={t("lesson.add")}
        inputs={[
          { placeholder: t("user.login"), name: "login" },
          {
            placeholder: t("user.password"),
            name: "password",
            type: "password",
          },
          { placeholder: t("lesson.topic"), name: "topic" },
          { name: "id", type: "hidden", value: router.query.id?.toString() },
        ]}
        submitTitle={t("add")}
        submitUrl="/api/lesson/add"
        redirectUrl={`/subject/${router.query.id?.toString()}/`}
      />
    );
  }
}
