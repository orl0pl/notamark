import { i18n, useTranslation } from "next-i18next";
import { WithId } from "mongodb";
import moment from "moment";
import * as timeago from "timeago.js";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import TopBar from "@/components/topBar";
import SERVER_HOST from "../../../../../../../url-config"
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import { GetStaticPaths } from "next";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import { Lesson, Note } from "../../../../../../../lib/types";
import { Center } from "@/components/common";
import { NoteCard } from "@/components/card";
import Markdown from "@/components/markdown";
console.log((SERVER_HOST || "http://localhost:3000")+"/api/notes/")
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
function NotesList({ notes, selectedId }: { notes: WithId<Note>[], selectedId: string }) {
	return notes.map((note, i) => {
		return (
			<NoteCard
				key={i}
				hrefId={note._id.toString()}
				lastUpdateTime={note.createdAt}
				noteTitle={note.title || "Brak tytułu"}
				selected={selectedId === note._id.toString()}
			/>
		);
	});
}

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

export default function Home() {
	const { t } = useTranslation();
	const router = useRouter();
	const [lesson, setLesson] = useState<WithId<Lesson> | "loading" | null>("loading");
	const [notes, setNotes] = useState<WithId<Note>[] | "loading" | null>("loading");
	const [currentNote, setCurrentNote] = useState<WithId<Note> | "loading" | null>("loading");

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
					setCurrentNote(x?.find((n) => n._id.toString() === (router.query.nid || "")) || null);
					x?.filter((n) => lesson.notes.includes(n._id));
					setNotes(x);
				})
				.catch((error) => setLesson(null));
		}
	}, [lesson, router.query.nid]);
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar addButtonTitle="Dodaj notatkę" addButtonAction={()=>{alert('Dodajemy notatki!')}}>
				<div className="flex flex-col">
					<span className="title-small md:title-medium">{t('notes.viewinlesson')}</span>
					<span className="headline-small md:headline-large">
						{lesson !== "loading" && lesson?.topic}
					</span>
				</div>
			</TopBar>

			<ListDetailContainer>
				{lesson === "loading" ? (
					<Center>
						<Spinner />
					</Center>
				) : lesson !== null ? (
					<>
						<ListDetailSide className="hidden sm:flex">
							<ListDetailTitle>Notatki</ListDetailTitle>
							<ListDetailBody>
								{notes === "loading" ? (
									<Center>
										<Spinner />
									</Center>
								) : notes !== null ? (
									<NotesList selectedId={router.query.nid?.toString() || ""} notes={notes} />
								) : (
									<Center>
										<span className="error-text">{t("error.any")}</span>
									</Center>
								)}
							</ListDetailBody>
						</ListDetailSide>
						<ListDetailSide>
						<ListDetailTitle>Zawartość</ListDetailTitle>
						<ListDetailBody>
							{currentNote === "loading" ? (
								<Center>
									<Spinner />
								</Center>
							) : currentNote !== null ? (
								<Markdown>
                                     {currentNote.content} 
                                    
                                </Markdown>
							) : (
								<Center>
									<span className="error-text">{t("error.any")}</span>
								</Center>
							)}
							</ListDetailBody>
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
