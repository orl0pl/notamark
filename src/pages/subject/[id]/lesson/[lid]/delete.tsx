import { Button, Center } from "@/components/common";
import { mdiArrowLeft, mdiDeleteForever, mdiKey, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import tw from "tailwind-styled-components";
import FormComponent from "@/components/form";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/spinner";
import SERVER_HOST from "../../../../../../url-config";
import { WithId } from "mongodb";
import { Lesson } from "../../../../../../lib/types";
import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getServerSideProps({ locale }: { locale: string }) {
  //if (process.env.NODE_ENV === "development") {
  await i18n?.reloadResources();
  //}
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      // Will be passed to the page component as props
    },
  };
}
async function getLesson(id: string) {
  const resLesson = await fetch(
    (SERVER_HOST || "http://localhost:3000") + "/api/lesson/" + id,
  );
  const lesson: WithId<Lesson> | null = await resLesson.json();
  return lesson;
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
  const [lesson, setLesson] = useState<WithId<Lesson> | "loading" | null>(
    "loading",
  );
  useEffect(() => {
    setId(router.query.id?.toString() || "loading");
  }, [router.query.id]);
  useEffect(() => {
    if (router.query.lid) {
      getLesson(router.query.lid.toString())
        .then((x) => {
          setLesson(x);
        })
        .catch(() => setLesson(null));
    }
  }, [router.query.lid]);
  if (id == "loading" || lesson == "loading") {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (lesson == null) {
    return (
      <Center>
        <span className="error-text">{t("lesson.notfound")}</span>
      </Center>
    );
  } else {
    return (
      <FormComponent
        icon={mdiDeleteForever}
        formHeader={t("lesson.delete.confirm", { topic: lesson.topic })}
        inputs={[
          { placeholder: t("user.login"), name: "login" },
          {
            placeholder: t("user.password"),
            name: "password",
            type: "password",
          },
          { name: "id", type: "hidden", value: router.query.lid?.toString() },
        ]}
        submitTitle={t("lesson.delete.button")}
        submitUrl="/api/lesson/delete/"
        redirectUrl={`/subject/${router.query.id?.toString()}`}
      />
    );
  }
}
