'use client'
// components/EsummitSpeakers/index.tsx
// Highlights section with borderless Leaflet campus map on the left and stacked Day 1 / Day 2 event lists on the right.

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, X } from 'lucide-react'
import dynamic from 'next/dynamic'

interface EventItem {
  id: string
  time: string
  title: string
  tag: string
  venueId: string
  venueName: string
  building: string
  lat: number
  lng: number
}

interface DayCard {
  num: string
  day: string
  date: string
  title: string
  events: EventItem[]
}

const VENUE_COORDS: Record<string, { venueName: string; building: string; lat: number; lng: number }> = {
  main_stage: { venueName: 'Main Auditorium', building: 'Block A, Sector 12', lat: 30.7672, lng: 76.7874 },
  expo_floor: { venueName: 'Exhibition Grounds', building: 'Central Quadrangle', lat: 30.7668, lng: 76.7869 },
  pitch_room: { venueName: 'EIC Incubator Hall', building: 'Block B, 2nd Floor', lat: 30.7678, lng: 76.7862 },
  hacker_lab: { venueName: 'Computer Center', building: 'IT Complex, 3rd Floor', lat: 30.7662, lng: 76.7878 },
  vip_lounge: { venueName: 'PEC Club Lounge', building: 'North Lawn Pavilion', lat: 30.7682, lng: 76.7870 },
}

const CARDS: DayCard[] = [
  {
    num: '01',
    day: 'DAY 01',
    date: 'MARCH 15, 2026',
    title: 'Inauguration & Pitch Arena',
    events: [
      {
        id: 'd1-ev1',
        time: '09:30 AM',
        title: 'Grand Opening & Keynote Address',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
      {
        id: 'd1-ev2',
        time: '11:00 AM',
        title: 'Startup Expo & Founder Alley Launch',
        tag: 'Expo Floor',
        venueId: 'expo_floor',
        ...VENUE_COORDS.expo_floor,
      },
      {
        id: 'd1-ev3',
        time: '02:00 PM',
        title: 'VC Pitch Arena: Qualifying Round',
        tag: 'Pitch Room',
        venueId: 'pitch_room',
        ...VENUE_COORDS.pitch_room,
      },
      {
        id: 'd1-ev4',
        time: '05:00 PM',
        title: '24-Hour National Hackathon Kickoff',
        tag: 'Hacker Lab',
        venueId: 'hacker_lab',
        ...VENUE_COORDS.hacker_lab,
      },
      {
        id: 'd1-ev5',
        time: '08:00 PM',
        title: 'VIP Investor & Founder Networking Dinner',
        tag: 'VIP Lounge',
        venueId: 'vip_lounge',
        ...VENUE_COORDS.vip_lounge,
      },
    ],
  },
  {
    num: '02',
    day: 'DAY 02',
    date: 'MARCH 16, 2026',
    title: 'Hackathon Demos & Grand Finals',
    events: [
      {
        id: 'd2-ev1',
        time: '10:00 AM',
        title: 'DeepTech & GenAI VC Masterclass',
        tag: 'Auditorium',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
      {
        id: 'd2-ev2',
        time: '12:30 PM',
        title: 'Hackathon Live Project Demos & Judging',
        tag: 'Hacker Lab',
        venueId: 'hacker_lab',
        ...VENUE_COORDS.hacker_lab,
      },
      {
        id: 'd2-ev3',
        time: '03:00 PM',
        title: 'Grand Pitch Finals (₹7.5L Pool)',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
      {
        id: 'd2-ev4',
        time: '05:30 PM',
        title: 'Valedictory Keynote & Award Ceremony',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
    ],
  },
]

const PEC_CENTER: [number, number] = [30.7673, 76.7871]

function LeafletMapInner({
  selectedEvent,
  activeDayIndex,
  dayEvents,
  onClearSelection,
  onSelectEventId,
}: {
  selectedEvent: EventItem | null
  activeDayIndex: number
  dayEvents: EventItem[]
  onClearSelection: () => void
  onSelectEventId: (id: string) => void
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  useEffect(() => {
    const L = typeof window !== 'undefined' ? (window as any).L : null
    if (!mapContainerRef.current || mapInstanceRef.current || !L) return

    const map = L.map(mapContainerRef.current, {
      center: PEC_CENTER,
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    })

    const tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    L.tileLayer(tileUrl, {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    Object.entries(VENUE_COORDS).forEach(([vKey, vData]) => {
      const customIcon = L.divIcon({
        className: `highlights-marker-${vKey}`,
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            cursor: pointer;
          ">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #7ED321;
              border: 2.5px solid #ffffff;
              box-shadow: 0 0 16px rgba(126, 211, 33, 0.7);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #040A07;
              font-size: 14px;
              font-weight: bold;
              transition: all 0.3s ease;
            ">
              📍
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([vData.lat, vData.lng], { icon: customIcon }).addTo(map)

      marker.bindPopup(`
        <div style="padding: 6px; font-family: sans-serif; background: #07140F; color: #ffffff; border-radius: 8px;">
          <h4 style="margin: 0 0 2px; font-size: 13px; font-weight: bold; color: #7ED321;">${vData.venueName}</h4>
          <p style="margin: 0; font-size: 11px; color: #94A3B8;">${vData.building}</p>
        </div>
      `)

      marker.on('click', () => {
        const matchingEv = dayEvents.find((e) => e.venueId === vKey)
        if (matchingEv) {
          onSelectEventId(matchingEv.id)
        }
      })

      markersRef.current[vKey] = marker
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (selectedEvent) {
      const loc = VENUE_COORDS[selectedEvent.venueId]
      if (loc) {
        map.flyTo([loc.lat, loc.lng], 17, { duration: 1.0, easeLinearity: 0.25 })
        const marker = markersRef.current[selectedEvent.venueId]
        if (marker) marker.openPopup()
      }
    } else {
      map.flyTo(PEC_CENTER, 16, { duration: 1.0, easeLinearity: 0.25 })
    }
  }, [selectedEvent, activeDayIndex])

  return (
    <div className="relative h-full w-full bg-void">
      {/* Borderless Leaflet map viewport */}
      <div ref={mapContainerRef} className="h-full w-full z-10" />

      {/* Floating Info Overlay */}
      <div className="absolute bottom-6 left-6 z-20 max-w-xs rounded-2xl border border-white/10 bg-[#07140F]/90 p-4 shadow-2xl backdrop-blur-md">
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-[#7ED321]">
            {selectedEvent ? 'Selected Venue' : `Day 0${activeDayIndex + 1} Venues`}
          </span>
          {selectedEvent && (
            <button
              onClick={onClearSelection}
              className="font-mono-data text-[9px] font-bold text-gray-300 underline hover:text-white"
            >
              Show All
            </button>
          )}
        </div>

        <h4 className="mb-0.5 font-display text-sm font-bold text-white">
          {selectedEvent ? selectedEvent.venueName : 'PEC Campus, Sector 12'}
        </h4>

        <p className="mb-1 font-body text-xs text-gray-300">
          {selectedEvent ? selectedEvent.title : 'Interactive Leaflet Campus Map'}
        </p>

        <p className="font-mono-data text-[10px] text-gray-400">
          📍 {selectedEvent ? selectedEvent.building : 'Chandigarh 160012'}
        </p>
      </div>
    </div>
  )
}

const HighlightsCampusMap = dynamic(() => Promise.resolve(LeafletMapInner), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-void font-mono-data text-xs text-gray-400">
      Loading Leaflet Campus Map…
    </div>
  ),
})

function HighlightCard({
  card,
  index,
  scrollYProgress,
  selectedEventId,
  onSelectEvent,
}: {
  card: DayCard
  index: number
  scrollYProgress: any
  selectedEventId: string | null
  onSelectEvent: (eventId: string) => void
}) {
  return (
    <div
      className={`sticky h-[80vh] ${index > 0 ? 'mt-[45vh]' : ''}`}
      style={{
        top: index === 0 ? '7rem' : 'calc(7rem + 136px)',
        zIndex: 10 + index,
      }}
    >
      <motion.div
        className="flex h-full w-full flex-col justify-between overflow-y-auto rounded-[32px] border-2 p-6 shadow-2xl sm:rounded-[40px] sm:p-8"
        style={{
          borderColor: 'rgba(126, 211, 33, 0.35)',
          background: '#07130F',
        }}
      >
        <div>
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-black text-[#7ED321] sm:text-5xl">
                  {card.day}
                </span>
                <span className="font-mono-data text-xs font-bold uppercase tracking-wider text-gray-400">
                  {card.date}
                </span>
              </div>
              <span className="rounded-full border border-[#7ED321]/30 bg-[#7ED321]/10 px-3 py-1 font-mono-data text-xs font-bold text-[#7ED321]">
                Phase {card.num}
              </span>
            </div>

            <h3 className="mb-6 font-display text-xl font-bold text-white sm:text-2xl">
              {card.title}
            </h3>

            {/* Events List */}
            <div className="space-y-3">
              {card.events.map((ev) => {
                const isSelected = selectedEventId === ev.id
                return (
                  <div
                    key={ev.id}
                    onClick={() => onSelectEvent(ev.id)}
                    className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#7ED321] bg-[#7ED321]/15 shadow-[0_0_15px_rgba(126,211,33,0.25)]'
                        : 'border-white/10 bg-[#040A07]/80 hover:border-[#7ED321]/40 hover:bg-[#07140F]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="shrink-0 font-mono-data text-xs font-bold text-[#7ED321]">
                        {ev.time}
                      </span>
                      <span
                        className={`truncate font-body text-xs sm:text-sm font-medium ${
                          isSelected ? 'font-bold text-white' : 'text-gray-200 group-hover:text-white'
                        }`}
                      >
                        {ev.title}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded border font-mono-data text-[10px] px-2 py-0.5 ${
                          isSelected
                            ? 'border-[#7ED321] bg-[#7ED321] font-bold text-[#040A07]'
                            : 'border-white/10 bg-white/5 text-gray-400'
                        }`}
                      >
                        {ev.tag}
                      </span>
                      <MapPin
                        size={14}
                        className={`transition-colors ${
                          isSelected ? 'fill-[#7ED321] text-[#7ED321]' : 'text-gray-500 group-hover:text-[#7ED321]'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono-data text-xs text-gray-400">
            <span>PEC Sector 12, Chandigarh</span>
            <span className="text-[#7ED321]">Click event to inspect venue map</span>
          </div>
        </motion.div>
    </div>
  )
}

export default function EsummitHighlights() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [activeDayIndex, setActiveDayIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.5) {
      if (activeDayIndex !== 0) setActiveDayIndex(0)
    } else {
      if (activeDayIndex !== 1) setActiveDayIndex(1)
    }
  })

  const selectedEvent = selectedEventId
    ? CARDS.flatMap((c) => c.events).find((e) => e.id === selectedEventId) || null
    : null

  const handleSelectEvent = (id: string) => {
    if (selectedEventId === id) {
      setSelectedEventId(null)
    } else {
      setSelectedEventId(id)
    }
  }

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10 relative
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 bg-void text-white"
      aria-labelledby="timeline-heading"
    >
      <h2
        id="timeline-heading"
        className="text-[var(--accent-mint)] font-display font-black uppercase leading-none tracking-tight text-center
          mb-16 sm:mb-20 md:mb-24"
        style={{
          fontSize: 'clamp(3rem, 12vw, 160px)',
        }}
      >
        TIMELINE
      </h2>

      {/* 2-Column Responsive Layout */}
      <div className="relative flex flex-col lg:flex-row gap-8 items-start min-h-[150vh]">
        {/* Left Column: Sticky Borderless Leaflet Map (50%) */}
        <div className="w-full lg:w-1/2 h-[80vh] sticky top-28 z-30 overflow-hidden rounded-[32px]">
          <HighlightsCampusMap
            selectedEvent={selectedEvent}
            activeDayIndex={activeDayIndex}
            dayEvents={CARDS[activeDayIndex]?.events || []}
            onClearSelection={() => setSelectedEventId(null)}
            onSelectEventId={handleSelectEvent}
          />
        </div>

        {/* Right Column: Stacked Day Cards (50%) */}
        <div className="w-full lg:w-1/2 relative">
          {CARDS.map((card, index) => (
            <HighlightCard
              key={card.num}
              card={card}
              index={index}
              scrollYProgress={scrollYProgress}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
