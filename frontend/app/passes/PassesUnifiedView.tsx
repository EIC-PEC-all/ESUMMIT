'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import PassesSection from '@/components/Passes'
import PassesClient from './PassesClient'

export default function PassesUnifiedView() {
  const searchParams = useSearchParams()
  const tierParam = searchParams?.get('tier')?.toLowerCase()
  const hasTierSelection = tierParam === 'silver' || tierParam === 'gold' || tierParam === 'diamond'

  if (hasTierSelection) {
    return <PassesClient />
  }

  return <PassesSection isStandalonePage={true} />
}
