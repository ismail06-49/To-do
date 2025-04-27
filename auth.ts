import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from "./schemas";
import { client } from "./sanity/lib/client";
import { USER_BY_GMAIL_QUERY } from "./sanity/lib/queries";
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
    callbacks: {
        async session({ token, session }) {
            const email = session.user.email;
            const user = await client.fetch(USER_BY_GMAIL_QUERY, { email });
            if (user && session.user) {
                session.user.image = user.profile;
            }
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email as string;
            }
            return session;
        },
        async jwt({ token }) {
            const email = token.email;
            const user = await client.fetch(USER_BY_GMAIL_QUERY, { email });

            token.name = user.name;
            token.email = user.email;

            return token;
        }
    },
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                const validatedCredentials = LoginSchema.safeParse(credentials);
                if (validatedCredentials.success) {
                    const { email, password } = validatedCredentials.data;
                    const user = await client.fetch(USER_BY_GMAIL_QUERY, { email });
                    if (!user) return null;

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (isPasswordCorrect) return user;
                }
                return null;
            }
        })
    ],
})