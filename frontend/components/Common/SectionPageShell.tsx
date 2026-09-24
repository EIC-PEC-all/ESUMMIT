'use client'

import React from 'react'
import { Toaster } from 'react-hot-toast'
import Nav from '@/components/Nav'
import LimeEdgeMasks from '@/components/Common/LimeEdgeMasks'
import Footer from '@/components/Footer'
import { TOAST_STYLE } from '@/lib/constants'

export interface SectionPageShellProps {
  children: React.ReactNode
}

export default function SectionPageShell({
  children,
}: SectionPageShellProps) {
  return (
    <main
      id="main-content"
      className="bg-void overflow-x-clip min-h-screen text-white flex flex-col justify-between"
      suppressHydrationWarning
    >
      {/* Top & bottom viewport boundary edge masks */}
      <LimeEdgeMasks />

      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: TOAST_STYLE.style,
        }}
      />

      {/* Main Navigation Bar */}
      <Nav />

      {/* Core Section View with clearance for fixed navbar */}
      <div className="relative z-10 flex-1 pt-14 sm:pt-16">
        {children}
      </div>

      {/* Clean Global Footer without bundled register section */}
      <Footer />
    </main>
  )
}
