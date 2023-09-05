import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/dbConnect";
import { Document, ObjectId, WithId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<WithId<Document>>>,
) {
  const client = await clientPromise;
  const db = client.db("notamark");
  switch (req.method) {
    case "POST":
      res.status(400);
    case "GET":
      const allLessons: Array<WithId<Document>> = await db
        .collection("lessons")
        .find({})
        .toArray();
      res.json(allLessons);
      break;
  }
}
