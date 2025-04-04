"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Dashboard from "./dashboard";

export function SidebarNav() {
    const [activeTab, setActiveTab]=useState('Dashboard')
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");
    useEffect(() => {
        setUsername(localStorage.getItem("username") || "Guest");
        setUserImage(localStorage.getItem("userimage") || "https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png");
    }, []);
    const links = [
        {
            label: "Dashboard",
            href: "#",
            onClick: () => setActiveTab("Dashboard"),
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Profile",
            href: "#",
            onClick: () => setActiveTab("Profile"),
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            onClick: () => setActiveTab("Logout"),
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "z-50 mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                // for your use case, use `h-screen` instead of `h-[60vh]`
                "h-[60vh]"
            )}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: username,
                                href: "#",
                                icon: (
                                    <Image
                                        src={userImage ? userImage :"https://static-00.iconduck.com/assets.00/profile-default-icon-2048x2045-u3j7s5nj.png"}
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar" />
                                ),
                            }} />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard activeTab={activeTab} />
        </div>
    );
}
export const Logo = () => {
    return (
        <Link
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <div
                className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white">
                Devesh Pandey
            </motion.span>
        </Link>
    );
};
export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
            <div
                className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </Link>
    );
};


