import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter, Marcellus } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const asimovian = localFont({
  src: '../public/fonts/Asimovian-Regular.ttf',
  variable: '--font-asimovian',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const marcellus = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marcellus',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Startup Passes & Applications CMS | PEC E-Summit '26",
  description: 'Official response and application management system for PEC E-Summit 2026 Funding Conclave.',
  icons: {
    icon: '/esummit-mark.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${asimovian.variable} ${inter.variable} ${marcellus.variable}`}>
      <body className="noise font-body text-primary bg-[#060D0B] antialiased min-h-screen selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D1C18',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontFamily: 'var(--font-marcellus), serif',
              fontSize: '12px',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
