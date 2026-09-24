import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'

export const metadata: Metadata = {
  title: 'My Profile & Passes — PEC E-Summit 2026',
  description:
    'View your official delegate credentials, claimed passes, event registrations, and digital QR check-in badges for PEC E-Summit 2026.',
  alternates: {
    canonical: '/profile',
  },
  openGraph: {
    title: 'My Profile & Passes — PEC E-Summit 2026',
    description:
      'Manage your summit registrations, credentials, and digital pass badges at Punjab Engineering College.',
    url: 'https://esummit.pec.ac.in/profile',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function ProfilePage() {
  return <ProfileClient />
}
