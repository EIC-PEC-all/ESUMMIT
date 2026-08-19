'use client'
// components/Providers/SessionProviderWrapper.tsx
// SessionProvider is a client component; the root layout is a server component,
// so it needs this boundary.

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export default function SessionProviderWrapper({
  children,
}: {
  children: ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}
