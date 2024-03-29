import { useTranslation } from "next-i18next";
var moment = require("moment");
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TopBar from "@/components/topBar";

import {
  ListDetailBody,
  ListDetailContainer,
  ListDetailSide,
  ListDetailTitle,
} from "@/components/listDetail";
import React, { useEffect, useState } from "react";
import ThemeButton from "@/components/localStorageThemeSwitch";
import LanguageChangeButton from "@/components/languageChange";
import AuthButton from "@/components/authButton";
import Icon from "@mdi/react";
import { mdiAbTesting, mdiArrowLeft } from "@mdi/js";
import { Button, Center } from "@/components/common";
import connectToDatabase from "../../mongodb";
import { WithId } from "mongodb";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SubjectList from "@/components/subjectList";
import { i18n } from "next-i18next";
import { FetchState, Subject } from "../../lib/types";
import SERVER_HOST from "../../url-config";
import Head from "next/head";
import clientPromise from "../../lib/dbConnect";
import Spinner from "@/components/spinner";
// export const getServerSideProps: GetServerSideProps<{
// 	subjects?: WithId<Subject>[]
//   }> = async (context) => {
// 	const res = await fetch('http://localhost:3000/api/subjects')
// 	const subjects = await res.json()
// 	return { props: { subjects } }
//   }

export async function getStaticProps({ locale }: { locale: string }) {
  const client = await clientPromise;
  const rawSubjects = await client
    .db("notamark")
    .collection("subjects")
    .find({})
    .toArray();
  const subjects = rawSubjects as WithId<Subject>[];
  var subjectsString = JSON.parse(JSON.stringify(subjects));
  if (process.env.NODE_ENV === "development") {
    await i18n?.reloadResources();
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      //subjectsString,
      // Will be passed to the page component as props
    },
  };
}
export async function getSubjects() {
  const resSubjects = await fetch(SERVER_HOST + "/api/subjects");
  const subjects: WithId<Subject>[] | null = await resSubjects.json();
  return subjects;
}
export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const { data: session } = useSession();
  const [subjects, setSubjects] =
    useState<FetchState<WithId<Subject>[]>>("loading");
  useEffect(() => {
    if (subjects === null || subjects === "loading") {
      getSubjects().then((subjectsRes) => {
        setSubjects(subjectsRes);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
      <Head>
        <title>{t("notes.view")}</title>
      </Head>
      <TopBar />

      <ListDetailContainer>
        <ListDetailSide>
          <ListDetailTitle>{t("notes.subjects")}</ListDetailTitle>
          <ListDetailBody>
            {/* {subjects.map((subject) => {
							return (
								<SubjectCard
									key={subject._id}
				
									hrefId={parseInt(subject._id)}
									lastUpdateTime={"2023.08.17"}
									lessonsCount={14}
									subjectName="Xdd"
								/>
							);
						})} */}
            {subjects === "loading" ? (
              <Center>
                <Spinner />
              </Center>
            ) : subjects === null ? (
              <Center>{t("error.any")}</Center>
            ) : (
              <SubjectList subjects={subjects || []} />
            )}
          </ListDetailBody>
        </ListDetailSide>
        <ListDetailSide className="hidden sm:flex">
          <ListDetailTitle>{t("subject.clicktoview")} </ListDetailTitle>
          <ListDetailBody></ListDetailBody>
        </ListDetailSide>
      </ListDetailContainer>
    </main>
  );
}
