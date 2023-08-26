
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/dbConnect";
import { Document, ObjectId, WithId } from "mongodb";



export default async function handler(req: NextApiRequest,
  res: NextApiResponse<Array<WithId<Document>>>) {
  const client = await clientPromise;
  const db = client.db("notamark");
  switch (req.method) {
    case "POST":
      res.status(403)
    case "GET":
      const allSubjects: Array<WithId<Document>> = await db.collection("subjects").find({}).toArray();
      res.json(allSubjects);
      break;
  }
}