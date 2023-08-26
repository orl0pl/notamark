import React from "react";
import tw from "tailwind-styled-components";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
var moment = require("moment");
import 'moment/min/locales.min'

const CardContainer = tw.div<{$selected: boolean}>`
flex flex-col w-full ${({$selected})=>($selected ? 'primary-container on-primary-container-text' : 'surface-container-highest on-surface-container-highest-text')} p-4 rounded-xl
`;

const CardDetailsContainer = tw.div`
flex label-large tertiary-text gap-1 md:gap-2 items-center
`;

export default function SubjectCard({lastUpdateTime, lessonsCount, subjectName, selected = false}: {lastUpdateTime: string | number, lessonsCount: number, subjectName: string, selected?: boolean}) {
	const { t } = useTranslation();
	const router = useRouter()
	moment.locale(router.locale)
	return (
		<CardContainer $selected={selected}>
			<div>
				<span className="title-large">{subjectName}</span>
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