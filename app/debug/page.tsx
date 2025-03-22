"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DebugPage() {
  const { data: session, status } = useSession()

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Session Debug</CardTitle>
          <CardDescription>View your current authentication state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Status</h3>
              <p className="text-sm">{status}</p>
            </div>

            {session ? (
              <>
                <div>
                  <h3 className="text-lg font-medium">User</h3>
                  <pre className="mt-2 rounded bg-slate-100 p-4">{JSON.stringify(session.user, null, 2)}</pre>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Full Session</h3>
                  <pre className="mt-2 rounded bg-slate-100 p-4">{JSON.stringify(session, null, 2)}</pre>
                </div>
              </>
            ) : (
              <p>No active session</p>
            )}

            <div className="flex gap-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login Page</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

