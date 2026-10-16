import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter, Marcellus } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/context/ThemeContext'

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
    icon: '/esummit-mark.png?v=20261016',
    shortcut: '/favicon.ico?v=20261016',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${asimovian.variable} ${inter.variable} ${marcellus.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('esummit-theme')||localStorage.getItem('esummit-response-manager-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);if(t==='light'){document.documentElement.classList.add('light');document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="noise font-body antialiased min-h-screen">
        <ThemeProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-panel)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-panel)',
                fontFamily: 'var(--font-marcellus), serif',
                fontSize: '12px',
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
