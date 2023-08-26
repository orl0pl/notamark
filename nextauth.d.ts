import { User } from "@/pages/api/auth/[...nextauth]";
declare module "next-auth" {
    

    interface Session extends DefaultSession {
        user?: {
            accountLevel: 0 | 1 | 2,
            name: string,

        };
    }
    interface User extends DefaultUser {
        accountLevel: 0 | 1 | 2,
            name: string,
    }
}