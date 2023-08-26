import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import clientPromise from "../../../../lib/dbConnect";

async function getUsers() {
	const client = await clientPromise;
	const db = client.db("notamark");
	const persons = db.collection("users").find({}).toArray();
	return persons;
}
import { createHash } from "crypto";
import { WithId, Document } from "mongodb";
import SERVER_HOST from "../../../../url-config";
// export const authOptions = {
//   // Configure one or more authentication providers
//   providers: [
//     CredentialsProvider({
//       // The name to display on the sign in form (e.g. 'Sign in with...')
//       name: "Credentials",
//       // The credentials is used to generate a suitable form on the sign in page.
//       // You can specify whatever fields you are expecting to be submitted.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         // You need to provide your own logic here that takes the credentials
//         // submitted and returns either a object representing a user or value
//         // that is false/null if the credentials are invalid.
//         // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
//         // You can also use the `req` object to obtain additional parameters
//         // (i.e., the request IP address)

//         const loginPasswordHash = createHash("sha256")
//           .update(credentials?.password || "")
//           .digest("hex");
//         // If no error and we have user data, return it
//         if (
//           data.persons.find(
//             (p: {name: string, password: string}) => p.name == credentials?.username && p.password == loginPasswordHash
//           )
//         ) {
//           return data.persons.find(
//             (p: {name: string, password: string}) => p.name == credentials?.username && p.password == loginPasswordHash
//           );
//         }
//         // Return null if user data could not be retrieved
//         return null;
//       },
//     }),
//     // ...add more providers here
//   ],
// };

export type AccountLevel = 0 | 1 | 2 

export interface User {
	id: string,
  accountLevel: 0 | 1 | 2
  login: string,
  name: string,
  password: string
}

export default NextAuth({
	
	callbacks: {
		async jwt({ token, user }) {
			/* Step 1: update the token based on the user object */
			if (user) {
				token.accountLevel = user.accountLevel
				token.name = user.name;
			}
			return token;
		},
		session({ session, token }) {
			/* Step 2: update the session.user based on the token object */
			if (token && session.user) {
				session.user.accountLevel  = token.accountLevel as AccountLevel;
				session.user.name = token.name || "Użytkownik";
			}
			return session;
		},
	},
	// useSecureCookies: false,
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "Credentials",
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const client = await clientPromise;
				const db = client.db("notamark");
				const personsDocument = await db.collection("users").find({}).toArray();
        const persons = personsDocument as WithId<User>[]
        const data = {persons: persons}
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)
				const loginPasswordHash = createHash("sha256")
					.update(credentials?.password || "")
					.digest("hex");

				const rawUser = data.persons.find(
					(p: { login: string; password: string }) =>
						p.login == credentials?.username && p.password == loginPasswordHash
				);

				var user = {
					id: rawUser?.name || "",
					login: rawUser?.login || "",
				};

				// If no error and we have user data, return it
				if (
					data.persons.find(
						(p: { login: string; password: string }) =>
							p.login == credentials?.username && p.password == loginPasswordHash
					)
				) {
					const person = data.persons.find(
						(p: { login: string; password: string }) =>
							p.login == credentials?.username && p.password == loginPasswordHash
					)
					var finalUser = person as User
					return finalUser;
				}
				// Return null if user data could not be retrieved
				return null;
			},
		}),
		// ...add more providers here
	],
});
