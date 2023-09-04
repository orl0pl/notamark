import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../../lib/dbConnect";
import { Document, ObjectId, PushOperator, WithId } from "mongodb";
import { User } from "../auth/[...nextauth]";
import { z } from "zod";

import crypto, { createHash } from 'crypto';
import { Ticket } from "./add";
const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  // Token expires after 3 hours
  const expires = Math.floor(Date.now() / 1000) + (60*60*3);
  return { token, expires };
};

const schema = z.object({
    newLogin: z.string(),
	newPassword: z.string(),
	token: z.string().length(64)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const client = await clientPromise;
	switch (req.method) {
        
		case "POST":
            //console.log(JSON.parse(req.body).token)
			const response = schema.safeParse(JSON.parse(req.body));

			// If the request body is invalid, return a 400 error with the validation errors
			if (!response.success) {
				return res.status(400).send("Bad request body");
			}
			const body = response.data;
			

            

            const rawTicket = await client.db('notamark').collection('tickets').findOne({
                token: body.token
            })

            const ticket = rawTicket as WithId<Ticket> | null

            if (ticket === null){
                return res.status(404).send('Ticket not found')
            }
            if (Math.floor(Date.now() / 1000) > ticket.expires){
                return res.status(410).send('Ticket expired')
            }
            if(ticket.accountId === null){
                
                await client.db('notamark').collection('users').insertOne({
                    accountLevel: 0,
                    login: body.newLogin,
                    password: body.newPassword,
                    name: "Bez nazwy"
                })
                await client.db('notamark').collection('tickets').findOneAndDelete({
                    _id: ticket._id
                })
            }
            else {
                const passwordHash = createHash("sha256")
					.update(body.newPassword)
					.digest("hex");
                const updatedUser = await client.db('notamark').collection('users').findOneAndUpdate({
                    _id: new ObjectId(ticket.accountId)
                },{
                    $set: {
                        login: body.newLogin,
                        password: passwordHash,
                    }
                })
                if(!updatedUser.ok){
                    return res.status(404).send('Requested user not found')
                }
                await client.db('notamark').collection('tickets').findOneAndDelete({
                    _id: ticket._id
                })
            }

            

			return res.status(200).send("OK");
			break;
		case "GET":
			res.status(400);
			break;
	}
}
