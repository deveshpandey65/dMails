"use client";
import React from "react";
import {
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { MultiStepLoader } from "../elements/loader";

export default function Login() {
    const { data: session } = useSession();

    return (
        <div className="relative justify-center items-center shadow-input mx-auto w-full max-w-md rounded-none bg-[#dde1de3f]  p-4 md:rounded-2xl md:p-8 dark:bg-black">
            
            <h2 className="text-xl font-bold text-white dark:text-neutral-200">
                {session ? `Welcome, ${session.user?.name}` : "Welcome"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-white dark:text-neutral-300">
                {session ? "You are logged in." : "Please log in to continue."}
            </p>

            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

            <div className="flex flex-col space-y-4">
                {session ? (
                    <button
                        onClick={() => signOut()}
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-red-500 text-white px-4 font-medium"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        >
                            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                Sign in with Google
                            </span>
                            <BottomGradient />
                        </button>

                        <button
                            className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                        >
                            <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                Sign in with Outlook
                            </span>
                            <BottomGradient />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-1 w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};
