import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summit Timetable & Schedule — PEC E-Summit 2026',
  description: 'Explore the full 2-day schedule for PEC E-Summit 2026. Keynotes, panel discussions, pitch competition heats, 24-hour hackathon milestones, and networking dinners.',
  openGraph: {
    title: 'PEC E-Summit 2026 — Schedule & Timetable',
    description: 'Day 1 & Day 2 complete event schedule at Punjab Engineering College, Sector 12, Chandigarh.',
    url: 'https://esummit.pec.ac.in/schedule',
  },
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}