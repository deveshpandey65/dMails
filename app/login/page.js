"use client";
import React from "react";

import { WavyBackground } from "@/components/ui/wavy-background";
import Login from "./Login";

function Page() {
    return (
        <>
            <WavyBackground className=" flex justify-between items-center max-w-4xl mx-auto pb-40">
                <Login/>
            </WavyBackground>
        </>
        
    );
}

export default Page;
