
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/dbConnect";
import { Document, ObjectId, WithId } from "mongodb";

export default async function handler(req: NextApiRequest,
  res: NextApiResponse<WithId<Document>  | null>) {
  const client = await clientPromise;
  const db = client.db("notamark");
  switch (req.method) {
    case "POST":
      res.status(403)
    case "GET":
      const selectedLesson: WithId<Document> | null = await db.collection("lessons").findOne({_id: new ObjectId(req.query.lessonId?.toString())})//findOne({_id: req.query.lessonId?.toString()})
      res.json(selectedLesson);
      break;
  }
}