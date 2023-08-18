import { useTranslation } from "next-i18next";
import tw from "tailwind-styled-components";
import ThemeButton from "./localStorageThemeSwitch";
import LanguageChangeButton from "./languageChange";
import AuthButton from "./authButton";
import Modal from "react-modal";
import React from "react";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiCog, mdiCogOutline } from "@mdi/js";
const TopBarContainer = tw.div`
flex flex-row w-full justify-between items-center
`;

const TopBarActionButtonGroupContainer = tw.div`
flex flex-row gap-2 items-center
`;

const UserSettingsModal = tw(Modal)`
w-[calc(100vw-2rem)] h-fit h-max-[calc(100vh-2rem)] md:w-[calc(33vw-2rem)] 
surface-container-highest rounded-2xl absolute top-4 right-4 p-4
shadow-2xl
`
const TopBar = () => {
	const { t } = useTranslation();
	const [settingsModalIsOpen, settingsSetIsOpen] = React.useState(true);
	return (
		<TopBarContainer>
			<h1 className={`headline-medium md:display-small`}>{t("notes.view")} </h1>
			<TopBarActionButtonGroupContainer>
				{/* <ThemeButton />
				<LanguageChangeButton />
				<AuthButton /> */}
				<button
					onClick={() => {
						settingsSetIsOpen(true);
					}}
				>
					<Icon className="w-6" path={mdiCogOutline} />
				</button>
			</TopBarActionButtonGroupContainer>
			<UserSettingsModal
				isOpen={settingsModalIsOpen}
				style={{ overlay: { backgroundColor: "transparent" } }}
			>
				<button
					onClick={() => {
						settingsSetIsOpen(false);
					}}
				>
					<Icon className="w-6" path={mdiArrowLeft} />
				</button>
				<div className="flex flex-col gap-2 items-stretch">
					<ThemeButton />
					<LanguageChangeButton />
					<AuthButton />
				</div>
			</UserSettingsModal>
		</TopBarContainer>
	);
};

export default TopBar;
