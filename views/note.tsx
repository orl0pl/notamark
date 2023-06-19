import React from "react";
import { dataRaw } from "../server";
import { timeAgo } from "../server";
import { Note, Exercise, Person, Lesson as Lesson2 } from "../db/converter";
import { Account } from "../interfaces";
import iconmapper from "../utils/iconmapper";
import styled from "@emotion/styled";

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

const IconWrapper = styled.div`
	background-color: var(--md-sys-color-primary-container);
	border-radius: 8px;
	display: flex;
	width: 32px;
	height: 32px;
	align-content: center;
	justify-content: center;
`;

const RightWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	justify-content: center;
`;

const NoteOrExerciseLink = styled.a`
	color: var(--md-sys-color-primary);
	text-decoration: none;
	letter-spacing: var(--md-sys-typescale-title-large-tracking);
	line-height: var(--md-sys-typescale-title-large-height);
	text-transform: var(--md-sys-typescale-title-large-text-transform);
`;
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
			<IconWrapper>
				<NoteOrExerciseLink href={`../../n/note/${i}`}>
					<Icon style={{ color: "var(--md-sys-color-primary)" }} icon={"file-document-outline"} />
				</NoteOrExerciseLink>
			</IconWrapper>
			<RightWrapper>
				<span className="timeandauthor label-medium">
					Dodane {timeAgo.format(noteOrExercise.updateDate * 1000)} przez{" "}
					{persons[noteOrExercise.addedBy].name}
				</span>
				<span className="realdate title-medium">{universalContent.realDateOrReference}</span>
			</RightWrapper>
			<div className="icon-wrapper teritary">
				<a href={`../../edit/note/${i}`} className="MDI no-decoration title-large">
					{mi("pencil")}
				</a>
			</div>
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
						<button className="outline" onClick={addNote}>
							<span className="MDI">{mi("file-document-plus-outline")}</span>
							Dodaj notatke
						</button>
						<button className="outline" onClick={addExercise}>
							<span className="MDI">{mi("shape-plus")}</span>
							Dodaj zadanie
						</button>
					</div>
					<div className="contents">
						{lesson.notes.map((note, i) => (
							<Content noteOrExercise={note} key={i} i={i} type={"note"} />
						))}
						{lesson.exercises.map((exercise, i) => (
							<div className="content" key={i}>
								<div className="icon-wrapper">
									<a href={`../../e/${i}`} className="MDI no-decoration title-large">
										{mi("shape")}
									</a>
								</div>
								<div className="right">
									<span className="timeandauthor label-medium">
										Dodane {timeAgo.format(exercise.updateDate * 1000)} przez{" "}
										{persons[exercise.addedBy].name}
									</span>
									<span className="realdate title-medium">{exercise.reference}</span>
								</div>
								<div className="icon-wrapper teritary">
									<a href={`../../edit/exercise/${i}`} className="MDI no-decoration title-large">
										{mi("pencil")}
									</a>
								</div>
							</div>
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
			<div id="rightside-content">
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
        <link rel="stylesheet" href={`${props.url}static/css/typography.module.css`} />
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
		</html>
	);
};

export default MyComponent;
