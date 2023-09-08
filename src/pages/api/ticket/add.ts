import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/dbConnect";
import { Document, ObjectId, PushOperator, WithId } from "mongodb";
import { User } from "../auth/[...nextauth]";
import { z } from "zod";

import crypto from "crypto";
const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  // Token expires after 3 hours
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 3;
  return { token, expires };
};

const schema = z.object({
  login: z.string(),
  password: z.string(),
  id: z.string().length(24).or(z.null()),
});

export interface Ticket {
  accountId: string | null;
  expires: number;
  token: string;
}

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
      const matchingUser = users.find(
        (user) => user.login === body.login && user.password === body.password, //loginPasswordHash
      );
      if (!matchingUser) {
        return res.status(401).send("User not found");
      }

      const token = generatePasswordResetToken();

      await client.db("notamark").collection("tickets").insertOne({
        accountId: body.id,
        expires: token.expires,
        token: token.token,
      });
      return res.status(200).send(token.token);
      break;
    case "GET":
      res.status(400);
      break;
  }
}
