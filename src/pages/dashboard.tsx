import { useTranslation } from "next-i18next";
import moment from "moment";
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
import React, { useEffect, useState } from "react";
import ThemeButton from "@/components/localStorageThemeSwitch";
import LanguageChangeButton from "@/components/languageChange";
import AuthButton from "@/components/authButton";
import Icon from "@mdi/react";
import {
	mdiAbTesting,
	mdiAccountQuestion,
	mdiArrowLeft,
	mdiCloseOctagon,
	mdiContentSave,
	mdiDeleteForever,
	mdiLinkPlus,
	mdiOctagon,
	mdiPlus,
} from "@mdi/js";
import { Button, Center, Chip } from "@/components/common";
import connectToDatabase from "../../mongodb";
import { WithId } from "mongodb";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import SubjectList from "@/components/subjectList";
import { i18n } from "next-i18next";
import { Subject } from "../../lib/types";
import SERVER_HOST from "../../url-config";
import Head from "next/head";
import { CardContainer, CardDetailsContainer, SubjectCard } from "@/components/card";
import clientPromise from "../../lib/dbConnect";
import { AccountLevel, User } from "./api/auth/[...nextauth]";
import { Input } from "@/components/form";
import { UserAndSession } from "../../nextauth";

export type SafeUser = Omit<User, "password">;

export async function getStaticProps({ locale }: { locale: string }) {
	const res = await fetch((SERVER_HOST || "http://localhost:3000") + "/api/subjects");
	const subjects: WithId<Subject>[] = await res.json();
	const client = await clientPromise;
	const rawUsers = await client.db("notamark").collection("users").find({}).toArray();
	const users = rawUsers as WithId<User>[];
	if (process.env.NODE_ENV === "development") {
		await i18n?.reloadResources();
	}
	return {
		props: {
			...(await serverSideTranslations(locale, ["common"])),
			subjects: subjects,
			users: JSON.parse(
				JSON.stringify(users.map(({ password, ...keepAttrs }) => keepAttrs))
			) as WithId<SafeUser>[],
		},
	};
}

function AddSubjectForm() {
	const { t } = useTranslation();
	const [subjectName, setSubjectName] = useState("");
	const {data} = useSession();
	const router = useRouter()
	const [sessionUser, setSessionUser] = useState<UserAndSession | "loading" | null>("loading");
	useEffect(() => {
		setSessionUser(data?.user || null);
	}, [data]);
	async function submit() {
		if (sessionUser === "loading" || sessionUser === null) {
			return;
		}
		if (sessionUser.accountLevel !== 2) {
			return;
		}
		if (subjectName.length === 0) {
			return;
		}
		const response = await fetch("/api/subject/add", {
			method: "POST",
			body: JSON.stringify({
				login: sessionUser.login,
				password: sessionUser.password,
				name: subjectName
			}),
		});
		if (!response.status.toString().startsWith("2")) {
			alert(response.statusText)
		}
		if (response.status.toString().startsWith("2")) {
			router.reload();
		}
	}
	return (
		<>
			<span className="label-medium">{t("subject.name")}</span>
			<Input
				type="text"
				value={subjectName}
				onChange={(e) => {
					setSubjectName(e.target.value);
				}}
			/>
			<div className="flex flex-row-reverse flex-wrap gap-2 py-2">
				<Button
					onClick={() => {
						submit()
					}}
					$type={"filled"}
					$icon={mdiPlus}
				>
					{t("subject.add")}
				</Button>
				
			</div>
		</>
	);
}

function EditSubjectForm({ subject }: { subject: WithId<Subject> }) {
	const { t } = useTranslation();
	const [subjectName, setSubjectName] = useState(subject.name);
	useEffect(()=>{
		setSubjectName(subject.name)
	}, [subject.name])
	return (
		<>
			<span className="label-medium">{t("subject.name")}</span>
			<Input
				type="text"
				value={subjectName}
				onChange={(e) => {
					setSubjectName(e.target.value);
				}}
			/>
			<div className="flex flex-row-reverse flex-wrap gap-2 py-2">
				<Button
					onClick={() => {
						alert(subjectName);
					}}
					$type={"filled"}
					$icon={mdiContentSave}
				>
					{t("users.update")}
				</Button>
				<Button
					onClick={() => {
						alert(subjectName);
					}}
					$type={"outline"}
					$icon={mdiDeleteForever}
				>
					{t("subject.delete")}
				</Button>
				
			</div>
		</>
	);
}

function SubjectsManagment({ subjects }: { subjects: WithId<Subject>[] }) {
	const { t } = useTranslation();
	const [selectedSubject, setSelectedSubject] = useState<null | WithId<Subject> | "add">(null);
	const router = useRouter();
	return (
		<ListDetailContainer className="flex-col sm:flex-row">
			<>
				<ListDetailSide>
					<ListDetailTitle>{t("notes.subjects")}</ListDetailTitle>
					<Button
						$type="tonal"
						$icon={mdiPlus}
						onClick={() => {
							setSelectedSubject("add");
						}}
					>
						{t("subject.add")}
					</Button>
					<ListDetailBody>
						{subjects.map((subject, i) => {
							return (
								<SubjectCard
									lessonsCount={subject.lessons.length}
									subjectName={subject.name}
									key={i}
									onClick={() => {
										setSelectedSubject(subject);
									}}
									selected={selectedSubject !== "add" && selectedSubject?._id === subject._id}
								/>
							);
						})}
					</ListDetailBody>
				</ListDetailSide>
				<ListDetailSide>
					<ListDetailTitle>
						{selectedSubject === "add"
							? t("subject.add")
							: selectedSubject === null
							? t("subject.clicktoedit")
							: t("subject.edit")}
					</ListDetailTitle>
					<ListDetailBody className="p-0.5">
						{selectedSubject === "add" ? (
							<AddSubjectForm />
						) : selectedSubject === null ? null : (
							<EditSubjectForm subject={selectedSubject} />
						)}
					</ListDetailBody>
				</ListDetailSide>
			</>
		</ListDetailContainer>
	);
}

function UsersManagment({ users }: { users: WithId<SafeUser>[] }) {
	const { t } = useTranslation();
	const { data } = useSession();
	const router = useRouter();
	const [selectedUser, setSelectedUser] = useState<WithId<SafeUser> | null>(null);
	const [sessionUser, setSessionUser] = useState<UserAndSession | "loading" | null>("loading");
	useEffect(() => {
		setSessionUser(data?.user || null);
	}, [data]);
	async function updateUser() {
		if (sessionUser === "loading" || sessionUser === null) {
			return;
		}
		if (sessionUser.accountLevel !== 2) {
			return;
		}
		if (selectedUser === null) {
			return;
		}
		if (sessionUser.login === selectedUser.login && sessionUser.accountLevel === 2) {
			alert(t("user.canteditself"));
			selectedUser.accountLevel = 2;
		}
		if (selectedUser.name.length === 0) {
			return;
		}
		if (selectedUser.accountLevel < 0 || selectedUser.accountLevel > 2) {
			return;
		}
		const response = await fetch("/api/user/edit", {
			method: "POST",
			body: JSON.stringify({
				login: sessionUser.login,
				password: sessionUser.password,
				name: selectedUser.name,
				accountLevel: selectedUser.accountLevel,
				id: selectedUser._id.toString(),
			}),
		});
		if (response.status.toString().startsWith("2")) {
			router.reload();
		}
	}
	return (
		<ListDetailContainer className="flex-col justify-end sm:flex-row">
			<ListDetailSide>
				<ListDetailTitle>{t("user.list")}</ListDetailTitle>
				<Button $type="tonal" $icon={mdiPlus}>
					{t("user.add")}
				</Button>
				<ListDetailBody>
					{users.map((user, i) => {
						return (
							<CardContainer
								$selected={selectedUser?._id === user._id}
								key={i}
								onClick={() => {
									setSelectedUser(user);
								}}
							>
								<span className="title-large">{user.name}</span>
								<CardDetailsContainer>
									{t("user.accountlevel")}:{" " + t("user.level." + user.accountLevel.toString())}
								</CardDetailsContainer>
							</CardContainer>
						);
					})}
				</ListDetailBody>
			</ListDetailSide>
			<ListDetailSide>
				<ListDetailTitle>{selectedUser ? t("user.edit") : t("user.clicktoedit")} </ListDetailTitle>

				<ListDetailBody className="p-0.5">
					{selectedUser && (
						<>
							<span className="label-medium">{t("user.login")}</span>
							<Input disabled value={selectedUser?.login} />
							<span className="label-medium">{t("user.password")}</span>
							<Input disabled type="password" value={"niemogepodachaslabotoniefair"} />
							<span className="label-medium">{t("user.name")}</span>
							<Input
								onChange={(event) => {
									setSelectedUser({ ...selectedUser, name: event.target.value });
								}}
								value={selectedUser?.name}
							/>
							<span className="label-medium">{t("user.accountlevel")}</span>
							<div className="flex flex-row flex-wrap gap-2">
								<Chip
									$type={selectedUser.accountLevel === 0 ? "filled" : "outline"}
									onClick={() => {
										setSelectedUser({ ...selectedUser, accountLevel: 0 });
									}}
								>
									{t("user.level.0")}
								</Chip>
								<Chip
									$type={selectedUser.accountLevel === 1 ? "filled" : "outline"}
									onClick={() => {
										setSelectedUser({ ...selectedUser, accountLevel: 1 });
									}}
								>
									{t("user.level.1")}
								</Chip>
								<Chip
									$type={selectedUser.accountLevel === 2 ? "filled" : "outline"}
									onClick={() => {
										setSelectedUser({ ...selectedUser, accountLevel: 2 });
									}}
								>
									{t("user.level.2")}
								</Chip>
							</div>
							<div className="flex flex-row flex-wrap gap-2 py-2">
								<Button
									onClick={() => {
										updateUser();
									}}
									$type={"filled"}
								>
									{t("users.update")}
								</Button>
								<Button
									onClick={() => {
										alert("Trzeba to jeszcze zaimpementować");
									}}
									$icon={mdiLinkPlus}
									$type={"tonal"}
								>
									{t("users.generatelink")}
								</Button>
							</div>
						</>
					)}
				</ListDetailBody>
			</ListDetailSide>
		</ListDetailContainer>
	);
}

export default function Home({
	subjects,
	users,
}: {
	subjects: WithId<Subject>[];
	users: WithId<SafeUser>[];
}) {
	const { t } = useTranslation();
	const router = useRouter();
	const { pathname, asPath, query } = router;
	const { data: session } = useSession();
	return (
		<main className="flex min-h-screen flex-col items-start p-2 md:p-6 xl:p-12 gap-8">
			<TopBar>{t("dashboard.title")}</TopBar>
			<Head>
				<title>{t("dashboard.title")}</title>
			</Head>
			{
				/*session === null || session?.user === undefined*/ false ? (
					<ListDetailContainer>
						<Center className="flex-col error-text">
							<Icon path={mdiAccountQuestion} size={2} />
							Nie jesteś zalgowany
						</Center>
					</ListDetailContainer>
				) : /*session.user.accountLevel === 2*/ true ? (
					<>
						<span className="title-large">{t("manage.subjects")}</span>
						<SubjectsManagment subjects={subjects} />
						<span className="title-large">{t("manage.users")}</span>
						<UsersManagment users={users} />
					</>
				) : (
					<ListDetailContainer>
						<Center className="flex-col error-text">
							<Icon path={mdiCloseOctagon} size={2} />
							Nie jesteś administratorem
						</Center>
					</ListDetailContainer>
				)
			}
		</main>
	);
}
