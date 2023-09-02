import { mdiPlus, mdiPencil, mdiDelete, mdiChevronLeft } from "@mdi/js";
import { useRouter } from "next/router";
import { Chip, ResponsiveButton } from "./common";
import { useTranslation } from "next-i18next";
import { Note } from "../../lib/types";

export const NoteActions = ({
    note
}: {note: Note | null | "loading"}) => {
    const {t} = useTranslation()
    const router = useRouter()
    return (
        <div className="flex flex-row gap-2 flex-wrap">
				<Chip
					$type="outline"
					$icon={mdiPencil}
					onClick={() => {
						router.push(
							`/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}/note/${router.query.nid?.toString()}/edit`
						);
					}}
				>
					{t("note.edit")}
				</Chip>
				<Chip
					$type="outline"
					onClick={() => {
						router.push(
							`/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}/note/${router.query.nid?.toString()}/delete`
						);
					}}
					$icon={mdiDelete}
				>
					{t("note.delete.this")}
				</Chip>
				{note !== null && note !== "loading" && note.history.length !== 0 && (
					<Chip
						onClick={() => {
							router.push(
								`/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}/note/${note.history
									.at(-1)
									?.toString()}`
							);
						}}
						$type="filled"
						$icon={mdiChevronLeft}
					>
						{t("history.lastversion")}
					</Chip>
				)}
			</div>
    )
}