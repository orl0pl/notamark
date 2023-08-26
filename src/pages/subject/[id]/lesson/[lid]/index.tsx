import { i18n, useTranslation } from "next-i18next";
import { WithId } from "mongodb";
import moment from "moment";
import * as timeago from "timeago.js";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import TopBar from "@/components/topBar";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import { GetStaticPaths } from "next";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import { Lesson, Note } from "../../../../../../lib/types";
import { Center } from "@/components/common";
import { NoteCard } from "@/components/card";
import SERVER_HOST from "../../../../../../url-config"
import Head from "next/head";

async function getLesson(id: string) {
	const resLesson = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/lesson/" + id);
	const lesson: WithId<Lesson> | null = await resLesson.json();
	return lesson;
}

async function getNotes() {
	const resNotes = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/notes/");
	const notes: WithId<Note>[] | null = await resNotes.json();
	return notes;
}
function NotesList ({notes}:{notes: WithId<Note>[]}) {
	return notes.map((note, i)=>{
		return <NoteCard key={i} hrefId={note._id.toString()} lastUpdateTime={note.createdAt} noteTitle={note.title || "Brak tytułu"} />
	})
}

export async function getServerSideProps({ locale }: { locale: string }) {
	if (process.env.NODE_ENV === "development") {
		await i18n?.reloadResources();
	  }
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			// Will be passed to the page component as props
		},
	};
}

export default function Home() {
	const { t } = useTranslation();
	const router = useRouter();
	const [lesson, setLesson] = useState<WithId<Lesson> | "loading" | null>("loading");
	const [notes, setNotes] = useState<WithId<Note>[] | "loading" | null>("loading");

	useEffect(() => {
		if (router.query.lid) {
			getLesson(router.query.lid.toString())
				.then((x) => {
					setLesson(x);
				})
				.catch((error) => setLesson(null));
		}
	}, [router.query.lid]);
	useEffect(() => {
		if (lesson !== "loading" && lesson !== null) {
			getNotes()
				.then((x) => {
					x?.filter((n) => lesson.notes.includes(n._id));
					setNotes(x);
				})
				.catch((error) => setLesson(null));
		}
	}, [lesson]);
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar addButtonTitle="Dodaj notatkę" addButtonAction={()=>{alert('Dodajemy notatki!')}}>
				<div className="flex flex-col">
					<span className="title-small md:title-medium">{t('notes.view')} w</span>
					<span className="headline-small md:headline-large">
						{lesson !== "loading" && lesson?.topic}
					</span>
				</div>
			</TopBar>
			<Head>
				<title>Przeglądaj notatki</title>
			</Head>
			<ListDetailContainer>
				{lesson === "loading" ? (
					<Center>
						<Spinner />
					</Center>
				) : lesson !== null ? (
					<>
						<ListDetailSide>
							<ListDetailTitle>Notatki</ListDetailTitle>
							<ListDetailBody>
								{notes === "loading" ? (
									<Center>
										<Spinner />
									</Center>
								) : notes !== null ? (
									<NotesList notes={notes}/>
								) : (
									<Center>
										<span className="error-text">{t("error.any")}</span>
									</Center>
								)}
							</ListDetailBody>
						</ListDetailSide>
						<ListDetailSide className="hidden sm:flex">
							<ListDetailTitle>
								Aby zobaczyć zawartość notatki kliknij w nią
							</ListDetailTitle>
						</ListDetailSide>
					</>
				) : (
					<Center>
						<span className="error-text">{t("error.any")}</span>
					</Center>
				)}
			</ListDetailContainer>
		</main>
	);
}
