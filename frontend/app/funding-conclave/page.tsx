import { Metadata } from 'next'
import FundingConclaveClient from './FundingConclaveClient'

export const metadata: Metadata = {
  title: 'Funding Conclave Application | PEC E-Summit 2026',
  description:
    'Apply for the PEC E-Summit 2026 Funding Conclave. Pitch your startup before top angel investors, VCs, and institutional funds at Punjab Engineering College, Chandigarh.',
  openGraph: {
    title: 'Funding Conclave Application | PEC E-Summit 2026',
    description:
      'Pitch your startup live to leading angel investors and VCs during PEC E-Summit 2026 on 14-15 November 2026.',
    url: 'https://esummit.pec.ac.in/funding-conclave',
    siteName: 'PEC E-Summit 2026',
  },
}

import { redirect } from 'next/navigation'

export default function FundingConclavePage() {
  redirect('/passes')
}
