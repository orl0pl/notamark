import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/dbConnect";
import { Document, ObjectId, PushOperator, WithId } from "mongodb";
import { User } from "../auth/[...nextauth]";
import { z } from "zod";
import { createHash } from "crypto";
import { Note } from "../../../../lib/types";

const schema = z.object({
	login: z.string(),
	password: z.string(),
	content: z.string(),
    title: z.string(),
	id: z.string().length(24),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const client = await clientPromise;
	const rawUsers: WithId<Document>[] = await client
		.db("notamark")
		.collection("users")
		.find({})
		.toArray();
	const users = rawUsers as WithId<User>[];
	switch (req.method) {
		case "POST":
			const response = schema.safeParse(JSON.parse(req.body));

			// If the request body is invalid, return a 400 error with the validation errors
			if (!response.success) {
				return res.status(400).send("Bad request body");
			}
			const body = response.data;
			const matchingUser = users.find(
				(user) => user.login === body.login && user.password === body.password
			);
			if (!matchingUser) {
				return res.status(401).send("User not found");
			}
            const note = await client.db('notamark').collection("notes").findOne({
				_id: new ObjectId(body.id)
			})
			if(note==null){
				return res.status(404).send("Note not found")
			}
            var newNote = note as WithId<Note>
            newNote._id = new ObjectId()
            newNote.history.push(new ObjectId(body.id))
            newNote.isHistory = false
            newNote.createdAt = Math.floor(Date.now()/1000)
            newNote.createdBy = matchingUser._id,
            newNote.title = body.title
            newNote.content = body.content

            await client.db('notamark').collection('notes').insertOne(newNote)

            await client.db('notamark').collection("notes").findOneAndUpdate({
				_id: new ObjectId(body.id)
			}, {
                $set: {
                    isHistory: true
                }
            })

            await client
				.db("notamark")
				.collection("lessons")
				.findOneAndUpdate({ notes: body.id }, {
					$push: { notes: newNote._id.toString() },
				} as unknown as PushOperator<Document>);

			return res.status(200).send("OK");
			break;
		case "GET":
			res.status(400);
			break;
	}
}
