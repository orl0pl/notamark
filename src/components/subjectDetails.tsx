import { WithId } from "mongodb";
import { ListDetailBody, ListDetailTitle } from "./listDetail";
import { useTranslation } from "next-i18next";
import { LessonCard } from "./card";
import { Lesson, Subject } from "../../lib/types";
import { useEffect, useState } from "react";
import SERVER_HOST from "../../url-config"

async function getLessons() {
	const resLessons = await fetch((SERVER_HOST || "http://localhost:3000")+"/api/lessons/");
	const lessons: WithId<Lesson>[] | null = await resLessons.json();
	return lessons;
}

export default function SubjectDetails({ subject }: { subject: WithId<Subject> }) {
	const { t } = useTranslation();
    const [lessons, setLessons] = useState<WithId<Lesson>[] | "loading" | null>("loading");

	useEffect(() => {
		getLessons().then((x) => {
			setLessons(x);
		});
	}, []);
	return (
		<>
			<div className="title-large sm:hidden">{subject.name}</div>
			<ListDetailTitle>{t("notes.lessons.insubject")} </ListDetailTitle>
			<ListDetailBody>
            {lessons !== 'loading' && (
                lessons !== null && (
                    lessons.filter((v=>(subject.lessons.includes(v._id)))).map((x, i) => (
                        !x.isHistory && <LessonCard
						notesCount={x.notes.length}
						key={i}
						hrefId={x._id.toString()}
						lastUpdateTime={Math.floor(Date.now() - (Math.random() * 10000) / 1000)}
						lessonTopic={x.topic}
					/>
                    ))
                )
            )}
			</ListDetailBody>
		</>
	);
}
