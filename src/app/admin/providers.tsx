'use client'

// app/providers.tsx (Create this new file)
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}
