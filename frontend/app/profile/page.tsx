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
    <main className="bg-void min-h-screen overflow-x-clip pb-12 pt-20 sm:pt-28">
      <Nav />
      <ProfileClient />
      <Footer hideCTA />
    </main>
  )
}

