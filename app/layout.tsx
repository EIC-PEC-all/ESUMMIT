import type { Metadata } from 'next'
import { Inter, Kanit } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/Providers/SmoothScrollProvider'
import SessionProviderWrapper from '@/components/Providers/SessionProviderWrapper'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-kanit',
  display: 'swap',
  preload: false,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

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
    <html lang="en" data-theme="dark" className="dark" suppressHydrationWarning>
      <body
        className={`noise ${kanit.variable} ${inter.variable} font-body text-primary bg-void`}
        suppressHydrationWarning
      >
        <SessionProviderWrapper>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
