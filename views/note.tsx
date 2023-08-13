import React from "react";
import { dataRaw } from "../server";
import { timeAgo } from "../server";
import { Note, Exercise, Person, Lesson as Lesson2 } from "../db/converter";
import { Account } from "../interfaces";
import iconmapper from "../utils/iconmapper";
import styled, { CreateStyledComponent } from "@emotion/styled";
const theme = require("./theme.json");

import Icon from "./components/icon";

type Lesson = Omit<Lesson2, keyof { id: unknown }>;
const mi = iconmapper;

interface TimeAgo {
	format: (date: number) => string;
}

export interface NoteViewProps {
	url: string;
	account: Account | null;
	mi: (icon: string) => string;
	lesson: Lesson;
	persons: Person[];
	timeAgo: TimeAgo;
	selectedNote: Note;
	renderedContent: string;
}

const Header: React.FC<{ mi: (icon: string) => string; account: Account | null }> = ({
	mi,
	account,
}) => {
	return (
		<div className="header">
			<span className="title-large">
				<a className="no-decoration" href="../../">
					<span className="MDI">{mi("arrow-left")}</span>
				</a>
				Podgląd lekcji
			</span>

			<div className="right-group">
				<span className="title-small">
					Zalogowano jako
					<b style={{ color: "var(--md-sys-color-primary)" }}>{account?.name}</b>
				</span>
				<span className="MDI headline-small" title="Pomoc">
					{mi("help-circle-outline")}
				</span>
			</div>
		</div>
	);
};

const NoteOrExerciseElement = styled.div`
	background-color: var(--md-sys-color-surface-container);
	display: flex;
	flex-direction: row;
	padding: 6px;
	border-radius: 8px;
	gap: 6px;
`;

const IconWrapper = styled.div<{ type?: 'teritary' | 'primary', noBg?: boolean }>`
	
	${(props) => {
		if (props.type == "teritary") {
			return `color: var(--md-sys-color-tertiary);
			background-color: ${props.noBg ? 'transparent' : 'var(--md-sys-color-tertiary-container)'};
			`;
		}
		else if (props.type == "primary") {
			return `color: var(--md-sys-color-on-primary-container);
			background-color: var(--md-sys-color-primary-container);
			`
		}

	}}
	border-radius: 8px;
	display: flex;
	width: 32px;
	height: 32px;
	align-content: center;
	justify-content: center;
`;

const NoteOrExerciseDetails = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: center;
`;

const NoteOrExerciseLink = styled.a`
	color: var(--md-sys-color-on-primary-container);
	text-decoration: none;
	font-size: var(--md-sys-typescale-title-large-font-size);
	letter-spacing: var(--md-sys-typescale-title-large-tracking);
	line-height: var(--md-sys-typescale-title-large-height);
	font-weight: var(--md-sys-typescale-title-large-font-weight);
	display: flex;
	align-items: center;
	
`;

const TimeAndAuthor = styled.span`
color: var(--md-sys-color-tertiary);
font-size: var(--md-sys-typescale-label-medium-font-size);
`

const RealDateOrReference = styled.span`
font-size: var(--md-sys-typescale-title-medium-font-size);
font-weight: var(--md-sys-typescale-title-medium-font-weight);
`



const Content = ({
	noteOrExercise,
	i,
	type,
}: {
	noteOrExercise: Note | Exercise;
	i: number;
	type: "note" | "exercise";
}) => {
	const note = noteOrExercise as Note;
	const exercise = noteOrExercise as Exercise;

	const persons = dataRaw.persons ? dataRaw.persons : {};
	const universalContent = {
		...noteOrExercise,
		realDateOrReference: type == "note" ? note.realDate : exercise.reference,
	};
	return (
		<NoteOrExerciseElement>
			<IconWrapper type="primary">
				<NoteOrExerciseLink href={`../../n/${i}`}>
					<Icon style={{ color: "var(--md-sys-color-primary)", letterSpacing: "var(--md-sys-typescale-title-large-tracking)", lineHeight: "var(--md-sys-typescale-title-large-height)", fontSize: "var(--md-sys-typescale-title-large-font-size)" }} icon={type == "note" ? "file-document-outline" : "shape-outline"} />
				</NoteOrExerciseLink>
			</IconWrapper>
			<NoteOrExerciseDetails>
				<TimeAndAuthor>
					Dodane {timeAgo.format(noteOrExercise.updateDate * 1000)} przez{" "}
					{persons[noteOrExercise.addedBy].name}
				</TimeAndAuthor>
				<RealDateOrReference>{universalContent.realDateOrReference}</RealDateOrReference>
			</NoteOrExerciseDetails>
			<IconWrapper type="teritary" noBg>
				<NoteOrExerciseLink href={`../../edit/note/${i}`}>
					<Icon color="var(--md-sys-color-tertiary)" style={{ letterSpacing: "var(--md-sys-typescale-title-large-tracking)", lineHeight: "var(--md-sys-typescale-title-large-height)", fontSize: "var(--md-sys-typescale-title-large-font-size)" }} icon={"pencil"} />
				</NoteOrExerciseLink>
			</IconWrapper>
		</NoteOrExerciseElement>
	);
};


const LeftSide: React.FC<{
	mi: (icon: string) => string;
	lesson: Lesson;
	persons: Person[];
	timeAgo: TimeAgo;
}> = ({ mi, lesson, persons, timeAgo }) => {
	const addNote = () => {
		document.location = "../add/note";
	};

	const addExercise = () => {
		document.location = "../add/exercise";
	};

	function search() {
		window.location.href = "/search?q=" + "";
	}

	return (
		<div className="leftside-wrapper">
			<div className="search-wrapper">
				<input
					type="text"
					id="input"
					placeholder="Szukaj"
					onKeyPress={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							document.getElementById("search")!.click();
						}
					}}
				/>
				<button id="search" onClick={search} className="MDI">
					{mi("magnify")}
				</button>
			</div>
			<div className="lesson">
				<span className="title-large">{lesson.topic}</span>
				<div className="details">
					<span className="title-medium">{lesson.realStartDate}</span>
					<span className="timeandauthor title-small">
						Dodane {timeAgo.format(lesson.updateDate * 1000)} przez {persons[lesson.addedBy].name}
					</span>
				</div>
				<div className="wrapper contents">
					<div className="inline-flex" style={{ gap: 8, margin: 4 }}>
						<button id="addNote" className="outline">
							<span className="MDI">{mi("file-document-plus-outline")}</span>
							Dodaj notatke
						</button>
						<button id="addExercise" className="outline" onClick={addExercise}>
							<span className="MDI">{mi("shape-plus")}</span>
							Dodaj zadanie
						</button>
					</div>
					<div className="contents">
						{lesson.notes.map((note, i) => (
							<Content noteOrExercise={note} key={i} i={i} type={"note"} />
						))}
						{lesson.exercises.map((exercise, i) => (
							<Content noteOrExercise={exercise} key={i} i={i} type={"exercise"} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const RightSide: React.FC<{ selectedNote: Note; renderedContent: string }> = ({
	selectedNote,
	renderedContent,
}) => {
	const persons = dataRaw.persons ? dataRaw.persons : {};
	return (
		<div className="rightside-wrapper">
			<div className="note-info">
				<span className="title-large">{selectedNote.realDate}</span>
				<span className="note-details label-medium">
					Napisane przez {persons[selectedNote.addedBy].name}{" "}
					{timeAgo.format(selectedNote.updateDate * 1000)}
				</span>
			</div>
			<span className="title label-large">
				<span className="MDI body-large">{mi("file-document-outline")}</span>
				Zawartość notatki
			</span>
			<div id="rightside-content use-slab-font">
				<div dangerouslySetInnerHTML={{ __html: renderedContent }}></div>
			</div>
		</div>
	);
};

const MyComponent = (props: NoteViewProps) => {
	const persons = dataRaw.persons ? dataRaw.persons : {};
	return (
		<html lang="pl">
			<head>
				<link rel="stylesheet" href={`${props.url}static/katex/katex.min.css`} />
				<link rel="stylesheet" href={`${props.url}static/mainstyles.css`} />
				<link rel="stylesheet" href={`${props.url}static/css/tokens.css`} />
				<link rel="stylesheet" href={`${props.url}static/lessonstyle.css`} />
				<link rel="icon" type="image/x-icon" href={`${props.url}static/favicon.ico`} />
				<title>Edytor</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />{" "}
			</head>
			<body>
				<Header mi={props.mi} account={props.account} />
				<div className="main">
					<LeftSide
						mi={props.mi}
						lesson={props.lesson}
						persons={props.persons}
						timeAgo={props.timeAgo}
					/>
					<RightSide selectedNote={props.selectedNote} renderedContent={props.renderedContent} />
				</div>
			</body>
			<script src={`${props.url}static/actions.js`}></script>
		</html>
	);
};

export default MyComponent;
