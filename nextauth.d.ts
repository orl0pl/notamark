import { Person, Preferences, Roles } from "./db/converter";
declare module "next-auth" {
    interface User {
        roles?: Roles;
        preferences?: Preferences;
        name?: Person.name,

    }

    interface Session extends DefaultSession {
        user?: {
            roles?: Roles;
            preferences?: {
                dark?: boolean,
                language?: string
            };
            name?: Person.name,
        };
    }
}