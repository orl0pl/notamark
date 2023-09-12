import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/dbConnect";
import { Document, ObjectId, WithId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WithId<Document> | null>,
) {
  const client = await clientPromise;
  const db = client.db("notamark");
  switch (req.method) {
    case "POST":
      res.status(400);
    case "GET":
      const selectedNote: WithId<Document> | null = await db
        .collection("notes")
        .findOne({ _id: new ObjectId(req.query.noteId?.toString()) }); //findOne({_id: req.query.noteId?.toString()})
      res.json(selectedNote);
      break;
  }
}
