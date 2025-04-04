"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SidebarNav } from "./elements/sidenav";
import { MultiStepLoader } from "./elements/loader";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showLoader && status === "unauthenticated") {
      router.push("/login"); // ✅ Redirect inside useEffect (prevents error)
    }
  }, [status, showLoader, router]);

  useEffect(() => {
    if (session) {
      console.log("Session data:", session);
      localStorage.setItem("jwtmail", JSON.stringify(session.jwt));
      localStorage.setItem("username", session.user.name);
      localStorage.setItem("userimage", session.user.profilePic);
      console.log("Session", session.user);
      localStorage.setItem("usermail", session.user.email);
    }
  }, [session]); // ✅ Store in localStorage only when session updates

  if (status === "loading" || showLoader) return <MultiStepLoader />;

  if (!session) return null; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-800">
      <SidebarNav />
    </div>
  );
}
