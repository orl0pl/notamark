import { useTranslation } from "next-i18next";
var moment = require('moment');
import * as timeago from 'timeago.js';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}
import TopBar from "@/components/topBar";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";
import SubjectCard from "@/components/card";
import { GetStaticPaths } from "next";

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

	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar />

			<ListDetailContainer>
				<ListDetailSide>
					<ListDetailTitle>{t('notes.subjects')}</ListDetailTitle>
					<ListDetailBody>
						<SubjectCard hrefId={1} lastUpdateTime={"2023.08.17"} lessonsCount={14} subjectName="Xdd"/>
					</ListDetailBody>
				</ListDetailSide>
				<ListDetailSide className="hidden sm:flex">
					<ListDetailTitle>{t('notes.lessons.insubject')} </ListDetailTitle>
					<ListDetailBody>{router.query.id}</ListDetailBody>
				</ListDetailSide>
			</ListDetailContainer>
		</main>
	);
}
