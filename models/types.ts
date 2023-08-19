import * as typegoose from "@typegoose/typegoose";
import {prop} from "@typegoose/typegoose";
import { nanoid } from "nanoid";

export class User {
    @prop({ default: () => nanoid(9) })
    _id: string;

    @prop()
    name: string
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

    //@prop()
    //notes: typegoose.Ref<Note>[]
    
  }

export class Subject {
  @prop({ default: () => nanoid(9) })
  _id: string;

  @prop()
  name: string;

  @prop()
  lessons: typegoose.Ref<Lesson>[] 
}