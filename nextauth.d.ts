import { User } from "@/pages/api/auth/[...nextauth]";

export interface UserAndSession {
    accountLevel: 0 | 1 | 2,
    name: string,
    password: string,
    login: string,
}

declare module "next-auth" {
    

    interface Session extends DefaultSession {
        user?: UserAndSession
    }
    interface User extends UserAndSession extends DefaultUser {
    }
}