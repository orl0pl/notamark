import { useTranslation } from "next-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import LanguageChangeButton from "../components/languageChange";
import { GetStaticProps } from "next";
import AuthButton from "@/components/authButton";
import { useSession } from "next-auth/react";
import { Button } from "@/components/common";

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
			<div className="flex flex-row w-full justify-between items-center">
				<h1 className={`headline-medium md:display-small`}>{t("notes.view")} </h1>
				<div className="secondary-container on-secondary-container-text rounded-full w-8 h-8 flex flex-wrap justify-center content-center ">
				{/*session?.user?.name?*/ "test1".at(0)?.toUpperCase()}
			</div>
			</div>
			
			<div className="w-full flex flex-col gap-2">
				<Button>Coś długiego</Button>
				<Button $outline>Coś długiego</Button>
				<AuthButton />
				<h4 className="text-l pl-2">{t("content")}</h4>
				<LanguageChangeButton />
			</div>
		</main>
	);
}
