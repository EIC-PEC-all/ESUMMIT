import type { Metadata, Viewport } from 'next'
import { Inter, Kanit } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/Providers/SmoothScrollProvider'
import ChevronRouteTransition from '@/components/Common/ChevronRouteTransition'

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
  authors: [{ name: 'E-Cell PEC', url: 'https://esummit.pec.ac.in' }],
  openGraph: {
    title: 'PEC Summit 2025 — High Voltage',
    description:
      'The flagship entrepreneurship summit of E-Cell PEC, Chandigarh. Pitches, panels, expo, hackathon, and VIP investor networking.',
    url: 'https://esummit.pec.ac.in',
    siteName: 'PEC Summit 2025',
    images: [
      {
        url: '/readme-hero.png', // Assuming this high-quality asset exists in public/
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2025 Hero Graphic',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC Summit 2025',
    description: "Build and launch at Chandigarh's premier student entrepreneurship summit.",
    images: ['/readme-hero.png'],
  },
}

import GlobalScrollProgress from '@/components/Common/GlobalScrollProgress'
import MobileBottomNav from '@/components/Nav/MobileBottomNav'

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
        <GlobalScrollProgress />
        <MobileBottomNav />
        <SmoothScrollProvider>
          <ChevronRouteTransition>
            {children}
          </ChevronRouteTransition>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
