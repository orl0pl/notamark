
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
      const selectedSubject: WithId<Document> | null = await db.collection("subjects").findOne({_id: new ObjectId(req.query.subjectId?.toString())})//findOne({_id: req.query.subjectId?.toString()})
      res.json(selectedSubject);
      break;
  }
}