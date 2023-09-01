import { ObjectId } from "mongodb";

export interface CommonMetaData {
	createdBy: ObjectId;
	createdAt: number;
	history: Array<ObjectId>;
	isHistory: boolean;
}

export type Lesson = {
	topic: string;
	notes: ObjectId[];
} & CommonMetaData;

export type Note = {
	content: string,
    title: string
} & CommonMetaData;

export interface Subject {
	name: string;
	lessons: Array<ObjectId>;
}
