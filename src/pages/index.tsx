import { useTranslation } from "next-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import LanguageChangeButton from "../components/languageChange";
import { GetStaticProps } from "next";
import AuthButton from "@/components/authButton";
import { useSession } from "next-auth/react";
import { Button } from "@/components/common";
import ThemeButton from "@/components/localStorageThemeSwitch";
import TopBar from "@/components/topBar";
import {
	ListDetailBody,
	ListDetailContainer,
	ListDetailSide,
	ListDetailTitle,
} from "@/components/listDetail";

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

	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar />

			<ListDetailContainer>
				<ListDetailSide>
					<ListDetailTitle>{t('notes.subjects')}</ListDetailTitle>
					<ListDetailBody>
						<div className="flex flex-col w-full surface-container-highest p-4 rounded-xl">
							<div>
								<span className="title-large">{t('example_data.subjects.math')}</span>
							</div>
							<div className="">
								<div className="flex label-large tertiary-text gap-1 md:gap-2 items-center">
									<span>{t('notes.lessons_count')}</span>
									<span>•</span>
									<span>{t('notes.lastupdate')}</span>
								</div>
							</div>
						</div>
					</ListDetailBody>
				</ListDetailSide>
				<ListDetailSide className="hidden sm:flex">
					<ListDetailTitle>{t('notes.lessons.insubject')} </ListDetailTitle>
					<ListDetailBody></ListDetailBody>
				</ListDetailSide>
			</ListDetailContainer>
		</main>
	);
}
