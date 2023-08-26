import { useTranslation } from "next-i18next";
import tw from "tailwind-styled-components";
import ThemeButton from "./localStorageThemeSwitch";
import LanguageChangeButton from "./languageChange";
import AuthButton from "./authButton";
import Modal from "react-modal";
import React, { MouseEventHandler, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiCog, mdiCogOutline, mdiPlus } from "@mdi/js";
import { Button } from "./common";
import { useSession } from "next-auth/react";
const TopBarContainer = tw.div`
flex flex-row w-full justify-between items-center
`;

const TopBarActionButtonGroupContainer = tw.div`
flex flex-row gap-2 items-center
`;

const UserSettingsModal = tw(Modal)`
w-[calc(100vw-2rem)] h-fit h-max-[calc(100vh-2rem-3rem)] h-max-[calc(100vh-2rem-3rem)] sm:w-[calc(33vw-2rem)] 
surface-container-highest rounded-2xl absolute top-[3rem] sm:top-[5rem] right-4 p-4
shadow-xl
`;

Modal.setAppElement("div#__next");
const TopBar = ({
	children,
	addButtonAction,
	addButtonTitle,
}: {
	children?: string | React.ReactElement | undefined;
	addButtonAction?: MouseEventHandler | undefined;
	addButtonTitle?: string | undefined;
}) => {
	const { t } = useTranslation();
	const [settingsModalIsOpen, settingsSetIsOpen] = React.useState(false);
	const [matches, setMatches] = React.useState(true);
	const handler = (e: { matches: boolean }) => setMatches(e.matches);
	const { data: session } = useSession();
	useEffect(() => {
		if (window) {
			window.matchMedia("(min-width: 640px)").addEventListener("change", handler);
		}
	});
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
				{addButtonAction !== undefined ? (
					matches ? (
						<Button $type="filled" onClick={addButtonAction} $icon={mdiPlus}>
							{addButtonTitle}
						</Button>
					) : (
						<Button $type="filled" onClick={addButtonAction} $icon={mdiPlus} />
					)
				) : null}

				<button
					onClick={() => {
						settingsSetIsOpen(true);
					}}
					aria-label="Otwórz ustawienia"
				>
					
					{session?.user?.name ? (
						<div className="secondary-container on-secondary-container-text rounded-full w-8 h-8 flex flex-wrap justify-center content-center ">
							{session?.user?.name?.at(0)?.toUpperCase()}
						</div>
					) : (
						<Icon className="w-6" path={mdiCogOutline} />
					)}
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
