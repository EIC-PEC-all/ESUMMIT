import type { Metadata, Viewport } from 'next'
import { Inter, Kanit } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/Providers/SmoothScrollProvider'
import ChevronRouteTransition from '@/components/Common/ChevronRouteTransition'
import SessionProviderWrapper from '@/components/Providers/SessionProviderWrapper'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#07130F',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://esummit.pec.ac.in'),
  manifest: '/manifest.json',
  icons: {
    icon: '/eic-logo.png',
    shortcut: '/eic-logo.png',
    apple: '/eic-logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'E-SUMMIT',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  title: 'E-Summit 2026 — E-Cell PEC, Chandigarh',
  description:
    'E-Summit 2026 is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, Chandigarh. Join North India\'s premier high-voltage platform for student innovators, startup founders, and venture builders.',
  keywords: [
    'E-Summit 2026',
    'E-Summit',
    'E-Cell PEC',
    'entrepreneurship summit',
    'startup fest',
    'Punjab Engineering College',
    'Chandigarh',
    'student innovation',
  ],
  authors: [{ name: 'E-Cell PEC', url: 'https://esummit.pec.ac.in' }],
  openGraph: {
    title: 'PEC E-Summit 2026 — March 15-16',
    description:
      'The flagship entrepreneurship summit of E-Cell PEC, Chandigarh. Pitches, panels, expo, hackathon, and VIP investor networking.',
    url: 'https://esummit.pec.ac.in',
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: '/readme-hero.png',
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2026 Official Banner',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC E-Summit 2026',
    description: "Build and launch at Chandigarh's premier student entrepreneurship summit.",
    images: ['/readme-hero.png'],
  },
}

import GlobalScrollProgress from '@/components/Common/GlobalScrollProgress'
import Concierge from '@/components/Concierge'

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
          <GlobalScrollProgress />
          <SmoothScrollProvider>
            <ChevronRouteTransition>
              {children}
            </ChevronRouteTransition>
          </SmoothScrollProvider>
        </SessionProviderWrapper>

        {/* Floating AI Concierge — outside all wrappers so fixed positioning works */}
        <Concierge />
      </body>
    </html>
  )
}
