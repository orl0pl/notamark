// models/index.ts
import { Subject, Lesson, User, Note } from "./types";
import { getModelForClass } from "@typegoose/typegoose";


export const SubjectModel = getModelForClass(Subject);
export const LessonModel = getModelForClass(Lesson);
export const UserModel = getModelForClass(User);
export const NoteModel = getModelForClass(Note);
