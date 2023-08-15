import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import data from "../../../../db/connent";
import { createHash } from "crypto";
export const authOptions = {
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
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("/your/endpoint", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        const loginPasswordHash = createHash("sha256")
          .update(credentials?.password || "")
          .digest("hex");
        // If no error and we have user data, return it
        if (
          res.ok &&
          data.persons.find(
            (p) => p.name == credentials?.username && p.password == loginPasswordHash
          )
        ) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth({
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
          (p) => (p.name == credentials?.username && p.password == loginPasswordHash)
        )

        const user = {
          id: rawUser?.name || "",
          name: rawUser?.name || "",
          
        }

        
        // If no error and we have user data, return it
        if (
          data.persons.find(
            (p) => (p.name == credentials?.username && p.password == loginPasswordHash)
          )
        ) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
});
