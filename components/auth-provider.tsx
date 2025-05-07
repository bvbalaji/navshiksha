"use client"

import type React from "react"

import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'

interface Props {
  session?: Session | null
  children?: React.ReactNode
}

export function AuthProvider({ children , session}: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
