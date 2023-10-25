import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/dbConnect";
import { Document, ObjectId, PushOperator, WithId } from "mongodb";
import { z } from "zod";
import { createHash } from "crypto";
import { User } from "./auth/[...nextauth]";

const schema = z.object({
  login: z.string(),
  password: z.string(),
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
      const passwordHash = createHash("sha256")
        .update(body.password || "")
        .digest("hex");
      const noUsers = users.length === 0;
      if (!noUsers) {
        return res.status(401).send("Users exists");
      }

      await client.db("notamark").collection("users").insertOne({
        accountLevel: 0,
        login: body.login,
        password: passwordHash,
        name: body.login,
      });
      

      return res.status(200).send("OK");
      break;
    case "GET":
      res.status(400);
      break;
  }
}
