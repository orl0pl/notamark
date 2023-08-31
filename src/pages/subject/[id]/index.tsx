import { useTranslation } from "next-i18next";
import { WithId } from "mongodb";
import moment from "moment";
import * as timeago from "timeago.js";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: "blocking", //indicates the type of fallback
	};
};
import TopBar from "@/components/topBar";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import { GetStaticPaths } from "next";
import SubjectList from "@/components/subjectList";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import SubjectDetails from "@/components/subjectDetails";
import { Subject } from "../../../../lib/types";
import { Center } from "@/components/common";
import SERVER_HOST from "../../../../url-config"
import Head from "next/head";

async function getSubject(id: string) {
	const resSubject = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/subject/" + id);
	const subject: WithId<Subject> | null = await resSubject.json();
	return subject;
}

export async function getStaticProps({ locale }: { locale: string }) {
	const resSubjects = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/subjects");
	const subjects: WithId<Subject>[] = await resSubjects.json();
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			subjects,
			// Will be passed to the page component as props
		},
	};
}

export default function Home({ subjects }: { subjects: WithId<Subject>[] }) {
	const { t } = useTranslation();
	const router = useRouter();
	const [subject, setSubject] = useState<WithId<Subject> | "loading" | null>("loading");

	useEffect(() => {
		getSubject(router.query.id?.toString() || "").then((x) => {
			setSubject(x);
		});
	}, [router.query.id]);
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar addButtonTitle="Dodaj lekcję" addButtonAction={()=>{router.push(router.query.id?.toString()+'/lesson/add')}}/>
			<Head>
				<title>Przeglądaj notatki</title>
			</Head>
			<ListDetailContainer>
				<ListDetailSide className="hidden sm:flex">
					<ListDetailTitle>{t("notes.subjects")}</ListDetailTitle>
					<ListDetailBody>
						<SubjectList selectedId={router.query.id?.toString() || ""} subjects={subjects || []} />
					</ListDetailBody>
				</ListDetailSide>
				<ListDetailSide>
					{subject === "loading" ? (
						<Center><Spinner/></Center>
					) : subject !== null ? (
						<SubjectDetails subject={subject} />
					) : (
						<Center>
						<span className="error-text">{t("error.any")}</span>
					</Center>
					)}
				</ListDetailSide>
			</ListDetailContainer>
		</main>
	);
}
