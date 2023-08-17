import { useTranslation } from "next-i18next";
import tw from "tailwind-styled-components";
import ThemeButton from "./localStorageThemeSwitch";
import LanguageChangeButton from "./languageChange";
import AuthButton from "./authButton";

const TopBarContainer = tw.div`
flex flex-row w-full justify-between items-center
`;

const TopBarActionButtonGroupContainer = tw.div`
flex flex-row gap-2 items-center
`;
const TopBar = () => {
	const { t } = useTranslation();
	return (
		<div className="flex flex-row w-full justify-between items-center flex-wrap">
			<h1 className={`headline-medium md:display-small`}>{t("notes.view")} </h1>
			<div className="flex flex-row gap-2 items-center">
				<ThemeButton />
				<LanguageChangeButton />
				<AuthButton />
			</div>
		</div>
	);
};

export default TopBar;
