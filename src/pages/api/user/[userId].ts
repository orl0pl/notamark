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
      const selectedUser: WithId<Document> | null = await db
        .collection("users")
        .findOne({ _id: new ObjectId(req.query.userId?.toString()) }); //findOne({_id: req.query.userId?.toString()})
      res.json(selectedUser);
      break;
  }
}
