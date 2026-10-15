import React from 'react'
import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'My Profile & Passes — PEC E-Summit 2026',
  description: 'Manage your delegate passes, update your attendee profile, and view your tickets for PEC E-Summit 2026.',
}

export default function ProfilePage() {
  return (
    <div className="bg-void min-h-screen overflow-x-clip flex flex-col justify-between pt-16 sm:pt-20">
      <Nav />
      <main className="flex-1 pb-12">
        <ProfileClient />
      </main>
      <Footer hideCTA />
    </div>
  )
}

