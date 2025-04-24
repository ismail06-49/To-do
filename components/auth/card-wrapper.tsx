'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
}

const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref
}: CardWrapperProps) => {
    return (
        <Card className='w-full max-w-2xl bg-primary h-fit shadow-md col-span-12 md:col-span-10 my-auto mx-auto py-4'>
            <CardHeader className='text-center'>
                <h2 className='font-bold text-lg sm:text-2xl text-secondary'>{headerLabel}</h2>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                <Button
                    variant='link'
                    className='w-full font-normal'
                    size='sm'
                    asChild
                >
                    <Link href={backButtonHref}>
                        {backButtonLabel}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CardWrapper
