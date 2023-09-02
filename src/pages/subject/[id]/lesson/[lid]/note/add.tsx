import { i18n, useTranslation } from "next-i18next";
import { WithId } from "mongodb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import TopBar from "@/components/topBar";
import SERVER_HOST from "../../../../../../../url-config";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import { useEffect, useState } from "react";
import { Lesson, Note } from "../../../../../../../lib/types";
import { NoteCard } from "@/components/card";
import Markdown from "@/components/markdown";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Center } from "@/components/common";
import { UserAndSession } from "../../../../../../../nextauth";
import { Input } from "@/components/form";
async function getLesson(id: string) {
	const resLesson = await fetch((SERVER_HOST || "http://localhost:3000") + "/api/lesson/" + id);
	const lesson: WithId<Lesson> | null = await resLesson.json();
	return lesson;
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
	const { data } = useSession();
	const [lesson, setLesson] = useState<WithId<Lesson> | "loading" | null>("loading");
	const [text, setText] = useState("");
	const [title, setTitle] = useState("");
	const [sessionUser, setSessionUser] = useState<UserAndSession | "loading" | null>("loading");
	//const ref = useRef<MDXEditorMethods>(null)
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
		setSessionUser(data?.user || null);
	}, [data]);

	async function addNote() {
		if (sessionUser === "loading" || sessionUser === null) {
			return;
		}
		if (text.length === 0) {
			return;
		}
		const response = await fetch("/api/note/add", {
			method: "POST",
			body: JSON.stringify({
				login: sessionUser.login,
				password: sessionUser.password,
				content: text,
				title: title,
				id: router.query.lid,
			}),
		});
		if(response.status.toString().startsWith('2')){
			router.push(`/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}`)
		}
		else {
			alert(response.statusText)
		}
	}
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar
				addButtonTitle={t('notes.this.add')}
				addButtonAction={() => {
					addNote()
				}}
			>
				<div className="flex flex-col">
					<span className="title-small md:title-medium">{t('note.inlesson.add')}</span>
					<span className="headline-small md:headline-large">
						{lesson !== "loading" && lesson?.topic}
					</span>
				</div>
			</TopBar>
			<div className="flex flex-row px-2 m-4 gap-2">
				{t('note.title')}	<Input
					type="text"
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
			</div>
			<Head>
				<title>{t('note.add')}</title>
			</Head>
			<ListDetailContainer className="flex-col sm:flex-row">
				{sessionUser !== "loading" && sessionUser !== null ? (
					sessionUser.accountLevel !== 0 ? (
						<Center>
							<span className="error-text">{t('user.cantedit')}</span>
						</Center>
					) : (
						<>
							<ListDetailSide>
								<ListDetailTitle>{t('editor')}</ListDetailTitle>
								<ListDetailBody className="flex-1 w-full">
									<textarea
										onChange={(e) => {
											setText(e.target.value);
										}}
										className="flex-1 w-full resize-none rounded-lg p-2"
									></textarea>
								</ListDetailBody>
							</ListDetailSide>
							<ListDetailSide>
								<ListDetailTitle>{t('note.preview')}</ListDetailTitle>
								<ListDetailBody>
									<Markdown>{text}</Markdown>
								</ListDetailBody>
							</ListDetailSide>
						</>
					)
				) : (
					<Center>{t('user.loggedout')}</Center>
				)}
			</ListDetailContainer>
		</main>
	);
}
