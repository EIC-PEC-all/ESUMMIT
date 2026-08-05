import type { Metadata } from 'next'
import './globals.css'
import SmoothScrollProvider from '@/components/Providers/SmoothScrollProvider'
import OpeningLoader from '@/components/Providers/OpeningLoader'

export const metadata: Metadata = {
  title: 'PEC Summit 2025 — E-Cell PEC, Chandigarh',
  description:
    'PEC Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, Chandigarh. Join North India\'s premier high-voltage platform for student innovators, startup founders, and venture builders.',
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
    title: 'PEC Summit 2025 — High Voltage',
    description:
      'The flagship entrepreneurship summit of E-Cell PEC, Chandigarh. Pitches, panels, expo, hackathon, and VIP investor networking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC Summit 2025',
    description: 'Build and launch at Chandigarh\'s premier student entrepreneurship summit.',
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
        <SmoothScrollProvider>
          <OpeningLoader>
            {children}
          </OpeningLoader>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
