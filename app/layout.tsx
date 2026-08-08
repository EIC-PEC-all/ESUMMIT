import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Kanit } from 'next/font/google'
import localFont from 'next/font/local'
import Script from 'next/script'
import './globals.css'
import SmoothScrollProvider from '@/components/Providers/SmoothScrollProvider'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
  display: 'swap',
})

const khaviax = localFont({
  src: './fonts/Khaviax.otf',
  variable: '--font-khaviax',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`noise ${kanit.variable} ${khaviax.variable} ${inter.variable} ${jetbrains.variable} font-body text-primary bg-void`}>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
