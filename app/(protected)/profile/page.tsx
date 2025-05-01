'use client';

import * as z from 'zod';
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
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
import { useRef, useState, useTransition } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSession } from 'next-auth/react';
import { urlFor } from '@/sanity/lib/image';
import { useForm } from 'react-hook-form';
import { ProfileSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserIcon } from 'lucide-react';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';

const ProfilePage = () => {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const user = useCurrentUser();
    const { update } = useSession();

    const profileUrl = user?.image
        ? urlFor(user.image)?.width(64).height(64).url()
        : undefined;
    
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<z.infer<typeof ProfileSchema>>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
        },
    });

    const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
        startTransition(() => {
            updateProfile(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }
                    if (data.success) {
                        update();
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError('Something went wrong!'));
        });
    };

    return (
        <Card className='w-full max-w-2xl mx-auto mt-10'>
            <CardHeader>
                <p className='text-2xl font-bold text-center'>
                    Profile Info
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className='space-y-6'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name='profile'
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <Avatar
                                            className='w-24 h-24 mx-auto'
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <AvatarImage src={profileUrl} alt={user?.name ? user.name : 'Profile Picture'} />
                                            <AvatarFallback className='bg-red-500'>
                                                <UserIcon className='text-white' />
                                            </AvatarFallback>
                                        </Avatar>
                                        <FormLabel className='hidden'>
                                            Profile Picture
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...fieldProps}
                                                type='file'
                                                accept='image/*'
                                                className='hidden'
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    onChange(e.target.files && e.target.files[0])
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Your Name"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="ism@mail.com"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            type='submit'
                            className='text-primary py-5 w-full cursor-pointer'
                            variant='secondary'
                            disabled={isPending}
                        >
                            {isPending ? 'Saving...' : 'Save changes'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default ProfilePage
