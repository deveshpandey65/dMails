
"use client";
import React from 'react'
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import Image from 'next/image';
import { signIn, signOut, useSession } from "next-auth/react";
export default function Profile() {
  const { data: session, status } = useSession();
  console.log(session)
  return (
    <>
    <div className=' relative flex bg-slate-900 justify-center items-center w-full h-full'>
        <CardContainer className="inter-var">
          <CardBody
            className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white">
              {session.user.name}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Email: {session.user.email}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src={session.user.profilePic}
                height={500}
                width={500}
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail" />
            </CardItem>
            <div className="flex justify-between items-center mt-20">
              <CardItem
                translateZ={20}
                as={Link}
                href="https://twitter.com/mannupaaji"
                target="__blank"
                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white">
                Try now →
              </CardItem>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold">
                Logout
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
    </div>
    </>
  )
}
