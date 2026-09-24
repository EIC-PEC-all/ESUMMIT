import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import MasonryShowcase from '@/components/MasonryShowcase'

export const metadata: Metadata = {
  title: 'Gallery & Highlights — PEC E-Summit 2026',
  description:
    'Experience the energy, crowds, campus spirit, and memorable moments from previous editions of PEC E-Summit at Punjab Engineering College.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Gallery & Memories — PEC E-Summit 2026',
    description:
      'A visual celebration of entrepreneurship, stage keynotes, startup pitches, and celebrations at PEC Chandigarh.',
    url: 'https://esummit.pec.ac.in/gallery',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function GalleryPage() {
  return (
    <SectionPageShell>
      <MasonryShowcase />
    </SectionPageShell>
  )
}
