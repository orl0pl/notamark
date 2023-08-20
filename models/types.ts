import * as typegoose from "@typegoose/typegoose";
import {prop} from "@typegoose/typegoose";
import { nanoid } from "nanoid";

export class User {
    @prop({ default: () => nanoid(9) })
    _id: string;

    @prop()
    name: string
}

export class Note {
    @prop({ default: () => nanoid(9) })
    _id: string;

    @prop({ default: () => new Date()})
    createdAt: Date

    @prop()
    content: string

    @prop()
    createdBy: typegoose.Ref<User>

    @prop()
    history: typegoose.Ref<Note>[]

    @prop()
    isHistory: boolean
}

export class Lesson {
    @prop({ default: () => nanoid(9) })
    _id: string;
    
    @prop({ default: () => new Date()})
    createdAt: Date

    @prop()
    createdBy: typegoose.Ref<User>

    @prop()
    topic: string

    @prop()
    notes: typegoose.Ref<Note>[]

    @prop()
    history: typegoose.Ref<Lesson>[]

    @prop()
    isHistory: boolean
    
  }

export class Subject {
  @prop({ default: () => nanoid(9) })
  _id: string;

  @prop()
  name: string;

  @prop()
  lessons: typegoose.Ref<Lesson>[] 
}