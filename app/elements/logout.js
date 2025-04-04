import React from 'react'
import { signIn, signOut, useSession } from "next-auth/react";
export default function Logout() {
  return (
    signOut()
  )
}
