import { useTranslation } from "next-i18next";
import { WithId } from "mongodb";
var moment = require('moment');
import * as timeago from 'timeago.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: 'blocking' //indicates the type of fallback
	}
}
import TopBar from "@/components/topBar";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import SubjectCard from "@/components/card";
import { GetStaticPaths } from "next";
import SubjectList from "@/components/subjectList";
import { Subject } from "../api/subjects";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";

async function getSubject(id: string) {
	const resSubject = await fetch('http://localhost:3000/api/subject/' + id)
	const subject: WithId<Subject> | null = await resSubject.json()
	return subject
}

export async function getStaticProps({ locale }: { locale: string }) {
	const resSubjects = await fetch('http://localhost:3000/api/subjects')
	const subjects: WithId<Subject>[] = await resSubjects.json()
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			subjects
			// Will be passed to the page component as props
		},
	};
}

export default function Home({ subjects }: { subjects: WithId<Subject>[] }) {
	const { t } = useTranslation();
	const router = useRouter();
	const [subject, setSubject] = useState<WithId<Subject> | 'loading' | null>('loading')

	useEffect(()=>{
		getSubject(router.query.id?.toString()||"").then((x)=>{
			setSubject(x)
		})
	}, [subject])
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar />

			<ListDetailContainer>
				<ListDetailSide className="hidden sm:flex">
					<ListDetailTitle>{t('notes.subjects')}</ListDetailTitle>
					<ListDetailBody>
						<SubjectList selectedId={router.query.id?.toString() || ""} subjects={subjects || []} />
					</ListDetailBody>
				</ListDetailSide>
				<ListDetailSide>
					<ListDetailTitle>{t('notes.lessons.insubject')} </ListDetailTitle>
					{
						subject === 'loading' ? <div className="flex flex-1 justify-center items-center">
							<Spinner/>
						</div> :
						(subject !== null ? <ListDetailBody>{subject?.name}</ListDetailBody> : "Coś poszło nie tak")
						
					}
					
				</ListDetailSide>
			</ListDetailContainer>
		</main>
	);
}
