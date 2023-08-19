// models/index.ts
import { Subject } from "./types";
import { getModelForClass } from "@typegoose/typegoose";

export const TodoModel = getModelForClass(Subject);
// add other models here
