import { useTranslation } from "next-i18next";
var moment = require("moment");
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TopBar from "@/components/topBar";


import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import SubjectCard from "@/components/card";
import React, { useState } from "react";
import ThemeButton from "@/components/localStorageThemeSwitch";
import LanguageChangeButton from "@/components/languageChange";
import AuthButton from "@/components/authButton";
import Icon from "@mdi/react";
import { mdiAbTesting, mdiArrowLeft } from "@mdi/js";
import { Button } from "@/components/common";
import connectToDatabase from "../../mongodb";
import { WithId } from "mongodb";
import { GetServerSideProps } from "next";
import SubjectList from "@/components/subjectList";

export async function getStaticProps({ locale }: { locale: string }) {
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
	const { pathname, asPath, query } = router;
	const { data: session } = useSession();
	// const [subjects, setSubjects] = useState<WithId<IRawSubject>[]>([]);
	// connectToDatabase(config["DB_CONN_STRING"] || "").then(({ db }) => {
	// 	const subjectCollection = db.collection<IRawSubject>("subjects");
	// 	subjectCollection
	// 		.find()
	// 		.toArray()
	// 		.then((y) => {
	// 			setSubjects(y);
	// 		});
	// });
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar />

			<ListDetailContainer>
				<ListDetailSide>
					<ListDetailTitle>{t("notes.subjects")}</ListDetailTitle>
					<ListDetailBody>
						{/* {subjects.map((subject) => {
							return (
								<SubjectCard
									key={subject._id}
									hrefId={parseInt(subject._id)}
									lastUpdateTime={"2023.08.17"}
									lessonsCount={14}
									subjectName="Xdd"
								/>
							);
						})} */}
						<SubjectList/>
					</ListDetailBody>
				</ListDetailSide>
				<ListDetailSide className="hidden sm:flex">
					<ListDetailTitle>{t("notes.lessons.insubject")} </ListDetailTitle>
					<ListDetailBody></ListDetailBody>
				</ListDetailSide>
			</ListDetailContainer>
		</main>
	);
}
