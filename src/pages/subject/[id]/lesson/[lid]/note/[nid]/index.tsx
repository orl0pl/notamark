import { i18n, useTranslation } from "next-i18next";
import { WithId } from "mongodb";
import moment from "moment";
import * as timeago from "timeago.js";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import TopBar from "../../../../../../../components/topBar";
import SERVER_HOST from "../../../../../../../../url-config";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "../../../../../../../components/listDetail";
import { GetStaticPaths } from "next";
import { useEffect, useState } from "react";
import Spinner from "../../../../../../../components/spinner";
import { Lesson, Note } from "../../../../../../../../lib/types";
import { Button, Center, ResponsiveButton } from "../../../../../../../components/common";
import { CardDetailsContainer, NoteCard } from "../../../../../../../components/card";
import Markdown from "../../../../../../../components/markdown";
import Head from "next/head";
import { mdiChevronLeft, mdiDelete, mdiPencil, mdiPlus } from "@mdi/js";
import React from "react";
import { NoteActions } from "@/components/noteActions";
import { LessonActions } from "@/components/lessonActions";
console.log((SERVER_HOST || "http://localhost:3000") + "/api/notes/");
async function getLesson(id: string) {
	const resLesson = await fetch((SERVER_HOST || "http://localhost:3000") + "/api/lesson/" + id);
	const lesson: WithId<Lesson> | null = await resLesson.json();
	return lesson;
}

async function getNotes() {
	const resNotes = await fetch((SERVER_HOST || "http://localhost:3000") + "/api/notes/");
	const notes: WithId<Note>[] | null = await resNotes.json();
	return notes;
}
async function getUserName(id:string) {
	const resUser = await fetch((SERVER_HOST || "http://localhost:3000") + "/api/user/"+id);
	const user: WithId<{name: string}> | null = await resUser.json();
	if(user === null){
		return null;
	}
	else {
		return user.name;
	}
	
}
function NotesList({ notes, selectedId }: { notes: WithId<Note>[]; selectedId: string }) {
	const { t } = useTranslation();
	return notes.map((note, i) => {
		if (note.isHistory === true) {
			null;
		} else {
			return (
				<NoteCard
					key={i}
					hrefId={note._id.toString()}
					lastUpdateTime={note.createdAt}
					noteTitle={note.title || t("lesson.topic")}
					selected={selectedId === note._id.toString()}
				/>
			);
		}
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
	const [userName, setUserName] = useState<string | "loading..." | null>("loading")

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
					var filtered = x?.filter((n) => lesson.notes.includes(n._id)) || [];
					setNotes(filtered);
				})
				.catch((error) => setLesson(null));
		}
	}, [lesson, router.query.nid]);
	useEffect(()=>{
		if(currentNote !== "loading" && currentNote !== null){
			getUserName(currentNote.createdBy.toString()).then((x)=>{
				setUserName(x)
			})
		}
	})
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12">
			<TopBar>
				<div className="flex flex-col">
					<span className="title-small md:title-medium">{t("notes.viewinlesson")}</span>
					<span className="headline-small md:headline-large">
						{lesson !== "loading" && lesson?.topic}
					</span>
				</div>
			</TopBar>
			<Head>
				<title>{t("notes.view")}</title>
			</Head>
			<LessonActions lesson={lesson} />
			<ListDetailContainer>
				{lesson === "loading" ? (
					<Center>
						<Spinner />
					</Center>
				) : lesson !== null ? (
					<>
						<ListDetailSide className="hidden sm:flex">
							<ListDetailTitle>{t("notes.list")}</ListDetailTitle>
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
							{currentNote === "loading" ? (
								<Center>
									<Spinner />
								</Center>
							) : currentNote !== null ? (
								<ListDetailBody className="p-0.5">
									<span className="title-large">
										{currentNote.title}
									</span>
									<div className="flex label-large tertiary-text gap-1 md:gap-2 items-center mb-1">
										<span>{t('note.editcount', {count: currentNote.history.length})}</span>
										<span>•</span>
										<span>{t('note.createdatandby', {author: userName, time: moment(currentNote.createdAt * 1000).fromNow()})}</span>
									</div>
									<NoteActions note={currentNote} />
									<ListDetailTitle>{t("content")}</ListDetailTitle>
									<Markdown>{currentNote.content}</Markdown>
								</ListDetailBody>
							) : (
								<Center>
									<span className="error-text">{t("error.any")}</span>
								</Center>
							)}
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
