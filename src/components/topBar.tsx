import { useTranslation } from "next-i18next";
import tw from "tailwind-styled-components";
import ThemeButton from "./localStorageThemeSwitch";
import LanguageChangeButton from "./languageChange";
import AuthButton from "./authButton";
import Modal from "react-modal";
import React, { useEffect } from "react";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiCog, mdiCogOutline, mdiPlus } from "@mdi/js";
import { Button } from "./common";
const TopBarContainer = tw.div`
flex flex-row w-full justify-between items-center
`;

const TopBarActionButtonGroupContainer = tw.div`
flex flex-row gap-2 items-center
`;

const UserSettingsModal = tw(Modal)`
w-[calc(100vw-2rem)] h-fit h-max-[calc(100vh-2rem)] sm:w-[calc(33vw-2rem)] 
surface-container-highest rounded-2xl absolute top-4 right-4 p-4
shadow-2xl
`;

Modal.setAppElement("div#__next");
const TopBar = ({ children }: { children?: string | React.ReactElement | undefined }) => {
	const { t } = useTranslation();
	const [settingsModalIsOpen, settingsSetIsOpen] = React.useState(false);
	const [matches, setMatches] = React.useState(false)
	const handler = (e: {matches: boolean}) => setMatches(e.matches);
    useEffect(()=>{
		if(window){
			window.matchMedia("(min-width: 640px)").addEventListener('change', handler);
		}
	})
	return (
		<TopBarContainer>
			{typeof children === "string" ? (
				<h1 className={`headline-medium md:display-small`}>{children}</h1>
			) : children ? (
				children
			) : (
				<h1 className={`headline-medium md:display-small`}>{t("notes.view")}</h1>
			)}
			<TopBarActionButtonGroupContainer>
				{/* <ThemeButton />
				<LanguageChangeButton />
				<AuthButton /> */}
				{
					matches ?
					<Button
				$type="filled"
					onClick={() => {
						settingsSetIsOpen(true);
					}}
					$icon={mdiPlus}
				>
					Dodaj
				</Button>
				: <Button
				$type="filled"
					onClick={() => {
						settingsSetIsOpen(true);
					}}
					$icon={mdiPlus}
				/>
				}
					
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
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
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
