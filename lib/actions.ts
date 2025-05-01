'use server';

import { signIn, signOut } from '@/auth';
import { client } from '@/sanity/lib/client';
import { USER_BY_GMAIL_QUERY } from '@/sanity/lib/queries';
import { LoginSchema, ProfileSchema, RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import * as z from 'zod';
import { uuid } from '@sanity/uuid';
import { writeClient } from '@/sanity/lib/write-client';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { currentUser } from '@/lib/auth';

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

export const logout = async () => {
    await signOut({
        redirectTo: '/'
    });
}

export const updateProfile = async (
    values: z.infer<typeof ProfileSchema>
) => {
    const user = await currentUser();

    if (!user) {
        return { error: 'Unauthorized access!' };
    }

    const dbUser = await client.fetch(USER_BY_GMAIL_QUERY, {
        email: user.email,
    });

    if (!dbUser) {
        return { error: 'User not found!' };
    };

    const validatedFields = ProfileSchema.safeParse(values);
    const { name, email, password, newPassword, profile } = validatedFields.data as any;

    if (email && email !== dbUser.email) {
        const existingUser = await client
            .withConfig({ useCdn: false })
            .fetch(USER_BY_GMAIL_QUERY, { email });
        
        if (existingUser && existingUser.email !== dbUser.email) {
            return { error: 'Email already exists!' };
        };
    };

    if (password && newPassword) {
        const isPasswordValid = await bcrypt.compare(password, dbUser.password);

        if (!isPasswordValid) {
            return { error: 'The current password is incorrect!' };
        };

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await writeClient.patch(dbUser._id).set({
            name,
            email,
            password: newPassword ? hashedPassword : dbUser.password,
            profile: await writeClient.assets.upload('image', profile),
        }).commit();
    } else {
        await writeClient.patch(dbUser._id).set({
            name,
            email,
            profile: await writeClient.assets.upload('image', profile),
        }).commit();
    }

    return { success: 'Settings updated!' };
}