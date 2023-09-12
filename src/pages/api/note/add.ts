import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/dbConnect";
import { Document, ObjectId, PushOperator, WithId } from "mongodb";
import { User } from "../auth/[...nextauth]";
import { z } from "zod";
import { createHash } from "crypto";

const schema = z.object({
  login: z.string(),
  password: z.string(),
  content: z.string(),
  title: z.string(),
  id: z.string().length(24),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
      const loginPasswordHash = createHash("sha256")
        .update(body.password || "")
        .digest("hex");
      const matchingUser = users.find(
        (user) => user.login === body.login && user.password === body.password,
      );
      if (!matchingUser) {
        return res.status(401).send("User not found");
      }
      const newNote = await client
        .db("notamark")
        .collection("notes")
        .insertOne({
          createdAt: Math.floor(Date.now() / 1000),
          createdBy: matchingUser._id,
          history: [],
          isHistory: false,
          title: body.title,
          content: body.content,
        });
      await client
        .db("notamark")
        .collection("lessons")
        .findOneAndUpdate({ _id: new ObjectId(body.id) }, {
          $push: { notes: newNote.insertedId.toString() },
        } as unknown as PushOperator<Document>);

      return res.status(200).send("OK");
      break;
    case "GET":
      res.status(400);
      break;
  }
}
