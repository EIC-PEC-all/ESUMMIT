import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PEC Summit 2025 — E-Cell PEC, Chandigarh',
  description:
    'PEC Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, Chandigarh. Join the tricity\'s biggest platform for student innovators, startup founders, and venture builders.',
  keywords: [
    'PEC Summit',
    'E-Cell PEC',
    'entrepreneurship summit',
    'startup fest',
    'Punjab Engineering College',
    'Chandigarh',
    'student innovation',
  ],
  authors: [{ name: 'E-Cell PEC' }],
  openGraph: {
    title: 'PEC Summit 2025 — Ignite Your Idea',
    description:
      'The flagship entrepreneurship summit of E-Cell PEC, Chandigarh. Pitches, panels, expo, and more.',
    type: 'website',
    // TODO: replace with real OG image URL
    // images: [{ url: 'https://pecsummit.in/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC Summit 2025',
    description: 'Ignite your idea at Chandigarh\'s biggest student entrepreneurship summit.',
    // TODO: replace with real Twitter handle
    // site: '@ecellpec',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise">
        {children}
      </body>
    </html>
  )
}
