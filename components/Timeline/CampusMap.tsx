'use client'

import dynamic from 'next/dynamic'

interface ScheduleEvent {
  id: string
  time: string
  title: string
  type: string
  track: string | null
  venueId: string
  venueName: string
  distance: string
  walkTime: string
}

interface CampusMapProps {
  events: ScheduleEvent[]
  selectedEvent: ScheduleEvent | null
  onSelectEvent: (event: ScheduleEvent | null) => void
  activeDayLabel: string
}

const PecLeafletMap = dynamic(() => import('./PecLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-3xl bg-panel border border-border-subtle flex items-center justify-center font-mono-data text-xs text-secondary">
      Loading PEC Chandigarh Campus Map...
    </div>
  ),
})

export default function CampusMap(props: CampusMapProps) {
  return <PecLeafletMap {...props} />
}
