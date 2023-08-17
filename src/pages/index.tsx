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
import { ListDetailContainer, ListDetailSide } from "@/components/listDetail";

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
			<TopBar/>

			<ListDetailContainer>
				<ListDetailSide>
					<span className="font-bold title-small">
						Przedmioty
					</span>
				</ListDetailSide>
				<ListDetailSide>
					B
				</ListDetailSide>
			</ListDetailContainer>
		</main>
	);
}
