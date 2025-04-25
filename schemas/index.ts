import * as z from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(2, { message: 'Name is required' }),
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
})