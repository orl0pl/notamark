import { mdiPlus, mdiPencil, mdiDelete, mdiChevronLeft } from "@mdi/js";
import router from "next/router";
import { Lesson } from "../../lib/types";
import { Chip } from "./common";
import { useTranslation } from "next-i18next";

export const LessonActions = ({
  lesson,
}: {
  lesson: Lesson | null | "loading";
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex px-2 m-4 gap-2 flex-wrap">
      <Chip
        $type="outline"
        $icon={mdiPlus}
        onClick={() => {
          router.push(
            `/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}/note/add`,
          );
        }}
      >
        {t("note.add")}
      </Chip>
      <Chip
        $type="outline"
        $icon={mdiPencil}
        onClick={() => {
          router.push(
            `/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}/edit`,
          );
        }}
      >
        {t("lesson.edit.this")}{" "}
      </Chip>
      <Chip
        $type="outline"
        onClick={() => {
          router.push(
            `/subject/${router.query.id?.toString()}/lesson/${router.query.lid?.toString()}/delete`,
          );
        }}
        $icon={mdiDelete}
      >
        {t("lesson.delete.this")}{" "}
      </Chip>
      {lesson !== null &&
        lesson !== "loading" &&
        lesson.history.length !== 0 && (
          <Chip
            onClick={() => {
              router.push(
                `/subject/${router.query.id?.toString()}/lesson/${lesson.history
                  .at(-1)
                  ?.toString()}`,
              );
            }}
            $type="outline"
            $icon={mdiChevronLeft}
          >
            {t("history.lastversion")}{" "}
          </Chip>
        )}
    </div>
  );
};
