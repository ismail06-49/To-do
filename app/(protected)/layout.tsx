'use client';

import { logout } from "@/lib/actions";
import { AlignLeft, Bell, CircleUser, FolderOpen, House, LogOut, X } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const ProtectedLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <SessionProvider>
            <div className="grid grid-cols-1 md:grid-cols-12">
                <aside className="col-span-12 md:col-span-3 primaryColor p-0 md:h-screen md:sticky md:block">
                    <nav className="flex flex-col justify-between items-center">
                        <div className='flex flex-row justify-between items-center w-full p-3'>
                            <Link href="/dashboard" className="link-btn text-4xl font-bold my-3">
                                Todos App
                            </Link>
                            {/* Mobile toggle button */}
                            <button
                                className="md:hidden secondColor p-2"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <AlignLeft />
                            </button>
                        </div>
                        <div className={`primaryColor flex flex-col justify-start items-start ${isOpen ? 'block' : 'hidden'} absolute top-0 h-full w-4/5 p-2 pt-8 rounded-md right-0 md:w-full md:static md:block`}>
                            <button
                                className="md:hidden absolute right-1 secondColor p-2"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <X /> 
                            </button>
                            <Link href="/dashboard" className="text-white">
                                <div className="flex flex-row items-center link-btn gap-3 text-3xl font-bold">
                                    <House />
                                    Dashboard
                                </div>
                            </Link>
                            <Link href="/notification" className="text-white">
                                <div className="flex flex-row items-center link-btn gap-3 text-3xl font-bold">
                                    <Bell />
                                    Notification
                                </div>
                            </Link>
                            <Link href="/projects" className="text-white">
                                <div className="flex flex-row items-center link-btn gap-3 text-3xl font-bold">
                                    <FolderOpen />
                                    Projects
                                </div>
                            </Link>
                            <Link href="/profile" className="text-white">
                                <div className="flex flex-row items-center link-btn gap-3 text-3xl font-bold">
                                    <CircleUser />
                                    Profile
                                </div>
                            </Link>
                            <div onClick={logout} className="flex flex-row items-center link-btn gap-3 text-3xl text-white font-bold cursor-pointer absolute bottom-0 mb-4">
                                <LogOut />
                                Logout
                            </div>
                        </div>
                    </nav>
                </aside>
                <div className='col-span-12 md:col-span-9'>
                    {children}
                </div>
            </div>
        </SessionProvider>
    )
}

export default ProtectedLayout;
