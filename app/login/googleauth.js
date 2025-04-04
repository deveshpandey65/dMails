"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import Image from "next/image";

export default function LoginPage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {session ? (
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-lg font-semibold">Welcome, {session.user.name}</h1>

                    {session.user.image && (
                        <Image
                            src={session.user.image}
                            alt="Profile Picture"
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                    )}

                    <button
                        onClick={() => signOut()}
                        className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => signIn("google")}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                >
                    Sign in with Google
                </button>
            )}
        </div>
    );
}
