// app/portfolio/page.tsx
'use client'

import React from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import EventPortfolioShowcase from '@/components/EventPortfolio'

export default function PortfolioPage() {
  return (
    <main className="bg-void min-h-screen">
      <Nav />
      <div className="pt-16">
        <EventPortfolioShowcase />
      </div>
      <Footer hideCTA={false} />
    </main>
  )
}
