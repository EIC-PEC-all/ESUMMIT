'use client'
// components/EsummitSpeakers/index.tsx
// Highlights section with interactive campus map on the left and stacked Day 1 / Day 2 event lists on the right.

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, X } from 'lucide-react'

interface EventItem {
  id: string
  time: string
  title: string
  tag: string
  venueId: string
  venueName: string
  building: string
  x: number
  y: number
}

interface DayCard {
  num: string
  day: string
  date: string
  title: string
  events: EventItem[]
}

const VENUE_LOCATIONS: Record<string, { venueName: string; building: string; x: number; y: number }> = {
  main_stage: { venueName: 'Main Auditorium', building: 'Block A, Sector 12', x: 62, y: 38 },
  expo_floor: { venueName: 'Exhibition Grounds', building: 'Central Quadrangle', x: 38, y: 64 },
  pitch_room: { venueName: 'EIC Incubator Hall', building: 'Block B, 2nd Floor', x: 28, y: 32 },
  hacker_lab: { venueName: 'Computer Center', building: 'IT Complex, 3rd Floor', x: 74, y: 72 },
  vip_lounge: { venueName: 'PEC Club Lounge', building: 'North Lawn Pavilion', x: 48, y: 22 },
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
        ...VENUE_LOCATIONS.main_stage,
      },
      {
        id: 'd1-ev2',
        time: '11:00 AM',
        title: 'Startup Expo & Founder Alley Launch',
        tag: 'Expo Floor',
        venueId: 'expo_floor',
        ...VENUE_LOCATIONS.expo_floor,
      },
      {
        id: 'd1-ev3',
        time: '02:00 PM',
        title: 'VC Pitch Arena: Qualifying Round',
        tag: 'Pitch Room',
        venueId: 'pitch_room',
        ...VENUE_LOCATIONS.pitch_room,
      },
      {
        id: 'd1-ev4',
        time: '05:00 PM',
        title: '24-Hour National Hackathon Kickoff',
        tag: 'Hacker Lab',
        venueId: 'hacker_lab',
        ...VENUE_LOCATIONS.hacker_lab,
      },
      {
        id: 'd1-ev5',
        time: '08:00 PM',
        title: 'VIP Investor & Founder Networking Dinner',
        tag: 'VIP Lounge',
        venueId: 'vip_lounge',
        ...VENUE_LOCATIONS.vip_lounge,
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
        ...VENUE_LOCATIONS.main_stage,
      },
      {
        id: 'd2-ev2',
        time: '12:30 PM',
        title: 'Hackathon Live Project Demos & Judging',
        tag: 'Hacker Lab',
        venueId: 'hacker_lab',
        ...VENUE_LOCATIONS.hacker_lab,
      },
      {
        id: 'd2-ev3',
        time: '03:00 PM',
        title: 'Grand Pitch Finals (₹7.5L Pool)',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_LOCATIONS.main_stage,
      },
      {
        id: 'd2-ev4',
        time: '05:30 PM',
        title: 'Valedictory Keynote & Award Ceremony',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_LOCATIONS.main_stage,
      },
    ],
  },
]

function CampusMap({
  selectedEvent,
  activeDayIndex,
  onClearSelection,
}: {
  selectedEvent: EventItem | null
  activeDayIndex: number
  onClearSelection: () => void
}) {
  const currentDayEvents = CARDS[activeDayIndex]?.events || []

  // Active venues: single selected venue or all venues for the currently active day
  const activeVenues = selectedEvent ? [selectedEvent] : currentDayEvents

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[32px] border-2 border-[#7ED321]/30 bg-[#040A07] p-6 shadow-2xl">
      {/* Map Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-[#7ED321]" />
            <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
              PEC Campus Interactive Map
            </span>
          </div>
          <p className="font-mono-data text-[11px] text-gray-400">
            {selectedEvent
              ? `Focused Venue: ${selectedEvent.venueName}`
              : `Showing Day 0${activeDayIndex + 1} Venue Locations`}
          </p>
        </div>

        {selectedEvent && (
          <button
            onClick={onClearSelection}
            className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 font-mono-data text-[10px] font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={12} />
            <span>Show All</span>
          </button>
        )}
      </div>

      {/* Interactive Map Visual Stage */}
      <div className="relative my-4 flex-1 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#020503]">
        {/* Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(126, 211, 33, 0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Vector Campus Blueprint Roads & Grounds */}
        <svg className="absolute inset-0 h-full w-full fill-none stroke-[#7ED321]/40" strokeWidth="1">
          <path d="M 20% 30% Q 50% 10% 80% 35% T 70% 75% T 30% 70% Z" />
          <path d="M 30% 32% L 62% 38% L 74% 72%" strokeDasharray="4 4" />
          <path d="M 38% 64% L 48% 22%" strokeDasharray="4 4" />
          <rect x="22%" y="24%" width="12%" height="16%" rx="6" className="fill-[#7ED321]/5" />
          <rect x="56%" y="30%" width="14%" height="18%" rx="6" className="fill-[#7ED321]/5" />
          <rect x="30%" y="58%" width="16%" height="16%" rx="6" className="fill-[#7ED321]/5" />
          <rect x="68%" y="64%" width="14%" height="18%" rx="6" className="fill-[#7ED321]/5" />
        </svg>

        {/* Map Venue Pins */}
        {Object.entries(VENUE_LOCATIONS).map(([key, loc]) => {
          const isHighlighted = activeVenues.some((ev) => ev.venueId === key)
          const isExplicitlySelected = selectedEvent?.venueId === key

          return (
            <div
              key={key}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            >
              {isHighlighted && (
                <span className="absolute -inset-3 animate-ping rounded-full bg-[#7ED321] opacity-30" />
              )}

              <div
                className={`relative flex items-center justify-center rounded-full border transition-all duration-300 ${
                  isExplicitlySelected
                    ? 'h-9 w-9 border-[#7ED321] bg-[#7ED321] text-[#040A07] shadow-[0_0_20px_rgba(126,211,33,0.8)] scale-125'
                    : isHighlighted
                    ? 'h-8 w-8 border-[#7ED321] bg-[#07140F] text-[#7ED321] shadow-[0_0_12px_rgba(126,211,33,0.4)]'
                    : 'h-6 w-6 border-white/20 bg-white/5 text-gray-500 opacity-40'
                }`}
              >
                <MapPin size={isExplicitlySelected ? 18 : 14} />
              </div>

              <div
                className={`absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded px-2 py-0.5 font-mono-data text-[9px] font-bold transition-all duration-300 ${
                  isHighlighted
                    ? 'border border-[#7ED321]/40 bg-[#07140F] text-[#7ED321]'
                    : 'border border-white/10 bg-black/60 text-gray-400 opacity-40'
                }`}
              >
                {loc.venueName}
              </div>
            </div>
          )
        })}
      </div>

      {/* Map Info Card */}
      <div className="relative z-10 rounded-xl border border-white/10 bg-[#07140F] p-4 backdrop-blur-md">
        <AnimatePresence mode="wait">
          {selectedEvent ? (
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-[#7ED321]">
                  Selected Venue
                </span>
                <span className="font-mono-data text-[10px] text-gray-400">
                  {selectedEvent.time}
                </span>
              </div>
              <h4 className="mb-0.5 font-display text-sm font-bold text-white">
                {selectedEvent.venueName}
              </h4>
              <p className="mb-1 font-body text-xs text-gray-300">
                {selectedEvent.title}
              </p>
              <p className="font-mono-data text-[10px] text-gray-400">
                📍 {selectedEvent.building}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`day-${activeDayIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-[#7ED321]">
                  Day 0{activeDayIndex + 1} Overview
                </span>
                <span className="font-mono-data text-[10px] text-gray-400">
                  {currentDayEvents.length} Active Venues
                </span>
              </div>
              <h4 className="mb-1 font-display text-sm font-bold text-white">
                Click any event to inspect its venue on campus
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentDayEvents.map((ev) => (
                  <span
                    key={ev.id}
                    className="rounded border border-white/10 bg-white/5 font-mono-data text-[9px] text-gray-300 px-2 py-0.5"
                  >
                    • {ev.venueName}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

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
  const targetScale = 1 - (CARDS.length - 1 - index) * 0.04
  const scale = useTransform(scrollYProgress, [index / CARDS.length, 1], [1, targetScale])

  return (
    <div
      className="sticky h-[80vh]"
      style={{ top: `calc(${index * 36}px + 6rem)` }}
    >
      <div className="flex h-full w-full justify-end">
        {/* Left side spacer for map alignment on desktop */}
        <div className="hidden w-1/2 lg:block" aria-hidden="true" />

        {/* Right side 50% card */}
        <motion.div
          className="flex h-full w-full flex-col justify-between overflow-y-auto rounded-[32px] border-2 p-6 shadow-2xl sm:rounded-[40px] sm:p-8 lg:w-1/2"
          style={{
            borderColor: 'rgba(126, 211, 33, 0.3)',
            background: '#07130F',
            scale,
            originY: 0,
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
      id="esummit-highlights"
      ref={containerRef}
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10 relative
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 bg-void text-white"
      aria-labelledby="highlights-heading"
    >
      <h2
        id="highlights-heading"
        className="text-[var(--accent-mint)] font-display font-black uppercase leading-none tracking-tight text-center
          mb-16 sm:mb-20 md:mb-24"
        style={{
          fontSize: 'clamp(3rem, 12vw, 160px)',
        }}
      >
        HIGHLIGHTS
      </h2>

      <div className="relative">
        {/* Sticky Campus Map on Left 50% (Desktop) */}
        <div className="hidden lg:block absolute left-0 top-0 w-[48%] h-[80vh] sticky top-28 z-20">
          <CampusMap
            selectedEvent={selectedEvent}
            activeDayIndex={activeDayIndex}
            onClearSelection={() => setSelectedEventId(null)}
          />
        </div>

        {/* Stacked Cards on Right */}
        <div className="relative z-10">
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
