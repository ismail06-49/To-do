'use client';

import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import CardWrapper from './card-wrapper';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/actions';
import { FormError } from '@/components/form-error';

export const LoginForm = () => {

    const [error, setError] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('')
        startTransition(() => {
            login(values)
                .then((data) => {
                    setError(data?.error)
            })
        })
    };

    return (
        <CardWrapper
            headerLabel="Login"
            backButtonLabel='Don&#39;t have an account?'
            backButtonHref='/auth/register'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6 text-secondary'
                >
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className='my-2'
                                            {...field}
                                            placeholder='Your email'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className='my-2'
                                            {...field}
                                            placeholder='******'
                                            type='password'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <Button
                        type='submit'
                        className='w-full text-primary'
                        variant='secondary'
                        disabled={isPending}
                    >
                        {isPending ? 'Loading...' : 'Login'}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}