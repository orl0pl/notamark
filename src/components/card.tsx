import React from "react";
import tw from "tailwind-styled-components";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import moment from "moment";
import "moment/min/locales.min";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiNote, mdiNoteOutline } from "@mdi/js";


const CardContainer = tw.div<{ $selected: boolean }>`
transition-colors
flex flex-col w-full ${({ $selected }) =>
	$selected
		? "primary-container on-primary-container-text"
		: "surface-container-highest on-surface-container-highest-text"} p-4 rounded-xl
`;

const CardDetailsContainer = tw.div`
flex label-large tertiary-text gap-1 md:gap-2 items-center
`;

export function SubjectCard({
	lastUpdateTime,
	lessonsCount,
	subjectName,
	selected = false,
	hrefId,
}: {
	lastUpdateTime: string | number;
	lessonsCount: number;
	subjectName: string;
	selected?: boolean;
	hrefId: string;
}) {
	const { t } = useTranslation();
	const router = useRouter();
	moment.locale(router.locale);
	return (
		<CardContainer $selected={selected}>
			<div>
				<Link href={`/subject/${hrefId}`}>
					<span className="title-large">{subjectName}</span>
				</Link>
			</div>
			<div className="">
				<CardDetailsContainer>
					<span>{t("notes.lessonscount", { count: lessonsCount })}</span>
					<span>•</span>
					<span>{t("notes.lastupdate", { time: moment(lastUpdateTime).fromNow() })}</span>
				</CardDetailsContainer>
			</div>
		</CardContainer>
	);
}

export function LessonCard({
	lastUpdateTime,
	notesCount,
	lessonTopic,
	hrefId,
}: {
	lastUpdateTime: string | number;
	notesCount: number;
	lessonTopic: string;
	hrefId: string;
}) {
	const { t } = useTranslation();
	const router = useRouter();
	moment.locale(router.locale);
	return (
		<CardContainer className="p-3 rounded-xl" $selected={false}>
			<div>
				<Link href={`/subject/${router.query.id}/lesson/${hrefId}`}>
					<span className="title-large">{lessonTopic}</span>
				</Link>
			</div>
			<div className="">
				<CardDetailsContainer>
					<span>{t("notes.notescount", { count: notesCount })}</span>
					<span>•</span>
					<span>{t("notes.lastupdate", { time: moment(lastUpdateTime).fromNow() })}</span>
				</CardDetailsContainer>
			</div>
		</CardContainer>
	);
}

export function NoteCard({
	lastUpdateTime,
	noteTitle = "Brak tytułu",
	hrefId,
	selected = false
}: {
	lastUpdateTime: number;
	noteTitle: string;
	hrefId: string;
	selected?: boolean
}) {
	const { t } = useTranslation();
	const router = useRouter();
	moment.locale(router.locale);
	return (
		<CardContainer className="p-3 rounded-xl" $selected={selected}>
			<div className="flex flex-row">
				<Link className="flex flex-row gap-1" href={`/subject/${router.query.id}/lesson/${router.query.lid}/note/${hrefId}`}>
					<Icon path={mdiNoteOutline} className="w-6 primary-text"/>
					<span className="title-large">{noteTitle}</span>
				</Link>
			</div>
			<div className="">
				<CardDetailsContainer>
					<span>{t("notes.lastupdate", { time: moment(lastUpdateTime*1000).fromNow() })}</span>
				</CardDetailsContainer>
			</div>
		</CardContainer>
	);
}
