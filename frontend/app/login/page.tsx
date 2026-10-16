import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: "Sign In / Attendee Portal | PEC E-Summit '26",
  description:
    'Sign in to your PEC E-Summit 2026 account. Access your official student passes, digital QR entry badges, and startup funding conclave applications.',
}

export default function LoginPage() {
  return (
    <main className="bg-deep min-h-screen text-primary flex flex-col" id="login-page">
      <Nav />
      <div className="flex-1 pt-16 sm:pt-20 flex flex-col justify-center">
        <Suspense
          fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-mint border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <LoginClient />
        </Suspense>
      </div>
      <Footer hideCTA />
    </main>
  )
}
