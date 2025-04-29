'use server';

import { signIn } from '@/auth';
import { client } from '@/sanity/lib/client';
import { USER_BY_GMAIL_QUERY } from '@/sanity/lib/queries';
import { LoginSchema, RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import * as z from 'zod';
import { uuid } from '@sanity/uuid';
import { writeClient } from '@/sanity/lib/write-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid credentials!' };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(USER_BY_GMAIL_QUERY, { email });
    
    if (existingUser) {
        return { error: 'Email already taken!' };
    }

    const id = uuid();

    await writeClient.create({
        _type: 'user',
        id,
        name,
        email,
        password: hashedPassword,
    });

    return { success: 'User created.' };
}

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: 'Invalid credentials!' };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.name) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials!' };
                default:
                    return { error: 'Something went wrong!' };
            }
        }
        throw error;
    }
}