import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter, JetBrains_Mono, Kanit } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/Providers/SmoothScrollProvider'
import ChevronRouteTransition from '@/components/Common/ChevronRouteTransition'
import SessionProviderWrapper from '@/components/Providers/SessionProviderWrapper'
import GlobalScrollProgress from '@/components/Common/GlobalScrollProgress'
import Concierge from '@/components/Concierge'
import { AuthProvider } from '@/context/AuthContext'
import ServiceWorkerCleanup from '@/components/Common/ServiceWorkerCleanup'
import AnnouncementBanner from '@/components/Common/AnnouncementBanner'

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-kanit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
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
  other: {
    'mobile-web-app-capable': 'yes',
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
    title: 'PEC E-Summit 2026 — September 26–27',
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

const JSON_LD_EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'PEC E-Summit 2026',
  description:
    "North India's largest student entrepreneurship summit at Punjab Engineering College. 2 days of keynotes, high-stakes startup pitches, hackathons, and angel investor networking.",
  startDate: '2026-03-15T09:00:00+05:30',
  endDate: '2026-03-16T18:00:00+05:30',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Punjab Engineering College (PEC)',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 12',
      addressLocality: 'Chandigarh',
      postalCode: '160012',
      addressRegion: 'Chandigarh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.7672,
      longitude: 76.7874,
    },
  },
  image: ['https://esummit.pec.ac.in/readme-hero.png'],
  offers: {
    '@type': 'AggregateOffer',
    url: 'https://esummit.pec.ac.in/register',
    priceCurrency: 'INR',
    lowPrice: 0,
    highPrice: 999,
    availability: 'https://schema.org/InStock',
    validFrom: '2026-01-01T00:00:00+05:30',
  },
  organizer: {
    '@type': 'Organization',
    name: 'EIC - Entrepreneurship & Incubation Cell, PEC',
    url: 'https://esummit.pec.ac.in',
    logo: 'https://esummit.pec.ac.in/eic-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" className="dark" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_EVENT_SCHEMA) }}
        />
      </head>
      <body
        className={`noise ${kanit.variable} ${inter.variable} ${jetbrains.variable} font-body text-primary bg-void`}
        suppressHydrationWarning
      >
        <ServiceWorkerCleanup />
        <AuthProvider>
          <SessionProviderWrapper>
            <AnnouncementBanner />
            <GlobalScrollProgress />
            <SmoothScrollProvider>
              <ChevronRouteTransition>
                {children}
              </ChevronRouteTransition>
            </SmoothScrollProvider>
          </SessionProviderWrapper>

          {/* Floating AI Concierge — outside all wrappers so fixed positioning works */}
          <Concierge />
        </AuthProvider>
      </body>
    </html>
  )
}
