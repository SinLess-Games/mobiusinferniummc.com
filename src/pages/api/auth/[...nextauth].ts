import NextAuth from "next-auth";
import type { NextAuthOptions } from 'next-auth'
import {randomBytes, randomUUID} from "crypto";
import { MikroOrmAdapter } from "@next-auth/mikro-orm-adapter";
import * as entities from "../../../Entities"
// Provider imports
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitchProvider from "next-auth/providers/twitch";
import PatreonProvider from "next-auth/providers/patreon";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        TwitchProvider({
            clientId: process.env.TWITCH_CLIENT_ID as string,
            clientSecret: process.env.TWITCH_CLIENT_SECRET as string
        }),
        PatreonProvider({
            clientId: process.env.PATREON_ID as string,
            clientSecret: process.env.PATREON_SECRET as string,
        }),
        CredentialsProvider({
            id: "domain-login",
            name: "Domain Account",
            async authorize(credentials, req) {
                const user = {
                    /* add function to get user */
                }
                return user
            },
            credentials: {
                username: { label: "Email", type: "email", placeholder: "jsmith@email.com" },
                password: { label: "Password", type: "password" },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: "database",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours

        // The session token is usually either a random UUID or string, however if you
        // need a more customized session token string, you can define your own generate function.
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
        }
    }
};

function Port() {
    if (process.env.DB_PORT === undefined) {
        return 3306
    } else {
        const p: string = process.env.DB_PORT
        return parseInt(p)
    }
}

export default NextAuth({
    ...authOptions,
    adapter: MikroOrmAdapter({
        type: "mysql",
        debug: process.env.DEBUG === "true",
        dbName: process.env.DB_DATABASE_NAME,
        entities: Object.values(entities),
        host: process.env.DB_HOST,
        port: Port(),
    })
});