'use client';

import { AlignLeft, LogIn, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-10">
            <aside className="col-span-10 md:col-span-2 primaryColor p-0 md:h-screen md:sticky md:block">
                <nav className="flex flex-col justify-between items-center">
                    <div className='flex flex-row justify-between items-center w-full p-3'>
                        <Link href="/" className="link-btn text-4xl font-bold my-3">
                            Todos App
                        </Link>
                        {/* Mobile toggle button */}
                        <button
                            className="md:hidden secondColor p-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <AlignLeft/>
                        </button>
                    </div>
                    <div className={`primaryColor flex flex-col justify-start items-start ${isOpen ? 'block' : 'hidden'} absolute top-0 h-full w-4/5 p-2 pt-8 rounded-md right-0 md:w-full md:static md:block`}>
                        <button
                            className="md:hidden absolute right-1 secondColor p-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <X /> 
                        </button>
                        <Link href="/auth/register" className="text-white">
                            <div className="flex flex-row items-center link-btn gap-3 text-3xl font-bold">
                                <UserPlus />
                                Register
                            </div>
                        </Link>
                        <Link href="/auth/login" className="text-white">
                            <div className="flex flex-row items-center link-btn gap-3 text-3xl font-bold">
                                <LogIn />
                                Login
                            </div>
                        </Link>
                    </div>
                </nav>
            </aside>
            <div className='col-span-10 md:col-span-8'>
                {children}
            </div>
        </div>
    )
}

export default RootLayout;