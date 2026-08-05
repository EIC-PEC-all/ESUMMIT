'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Navigation,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Footprints,
  Info,
  Layers,
} from 'lucide-react'
import { CAMPUS_VENUES } from '@/lib/data'

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

export default function CampusMap({
  events,
  selectedEvent,
  onSelectEvent,
  activeDayLabel,
}: CampusMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoveredVenueId, setHoveredVenueId] = useState<string | null>(null)
  const [showSteps, setShowSteps] = useState(true)

  const activeVenueIds = Array.from(new Set(events.map((e) => e.venueId)))
  const activeSelectedVenue = selectedEvent ? CAMPUS_VENUES[selectedEvent.venueId] : null

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 1.6))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.85))

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[700px] rounded-3xl bg-[#070B08] border border-[#50E3C2]/20 overflow-hidden shadow-2xl flex flex-col justify-between select-none">
      {/* Background Grid Pattern (EIC Palette) */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #50E3C2 1px, transparent 1px),
            linear-gradient(to bottom, #50E3C2 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top Map Toolbar (EIC Palette) */}
      <div className="relative z-20 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-[#070B08]/90 border-b border-[#50E3C2]/15 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#50E3C2]/15 border border-[#50E3C2]/30 flex items-center justify-center text-[#50E3C2]">
            <Compass size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-data text-xs uppercase tracking-widest text-[#50E3C2] font-bold">
                PEC Sector 12
              </span>
              <span className="w-2 h-2 rounded-full bg-[#50E3C2] animate-pulse" />
            </div>
            <h3 className="font-display text-sm sm:text-base text-[#E2FBEA] tracking-wide">
              Campus Layout &amp; Turning Paths ({activeDayLabel})
            </h3>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          {selectedEvent ? (
            <button
              onClick={() => onSelectEvent(null)}
              className="px-3.5 py-1.5 rounded-xl bg-[#50E3C2] text-[#070B08] font-mono-data text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(80,227,194,0.35)] hover:brightness-110 transition-all"
            >
              <RotateCcw size={13} />
              Show All Routes
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-[#0D140E] border border-[#50E3C2]/25 text-[#8A9488] font-mono-data text-[11px] flex items-center gap-1.5">
              <Layers size={13} className="text-[#50E3C2]" />
              Showing {activeVenueIds.length} Active Venues
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center rounded-xl bg-[#0D140E] border border-[#50E3C2]/20 p-1 gap-1">
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 rounded-lg hover:bg-[#50E3C2]/20 flex items-center justify-center text-[#8A9488] hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 rounded-lg hover:bg-[#50E3C2]/20 flex items-center justify-center text-[#8A9488] hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Vector SVG Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-4">
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{ scale: zoomLevel }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <svg
            viewBox="0 0 900 650"
            className="w-full h-full max-w-full max-h-full object-contain"
          >
            <defs>
              <filter id="eicShadow" x="-10%" y="-10%" width="125%" height="125%">
                <feDropShadow dx="2" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* Campus Boundary Outline */}
            <rect
              x="40"
              y="40"
              width="820"
              height="570"
              rx="16"
              fill="none"
              stroke="rgba(80,227,194,0.15)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />

            {/* Campus Roads / Walkways Grid */}
            <g stroke="rgba(255,255,255,0.05)" strokeWidth="22" strokeLinecap="square" fill="none">
              <path d="M 120 520 L 120 160 L 720 160" />
              <path d="M 120 360 L 640 360 L 640 440" />
              <path d="M 120 520 L 640 520 L 640 440" />
              <path d="M 380 360 L 380 160" />
              <path d="M 520 260 L 520 160" />
            </g>

            {/* Road Lane Lines */}
            <g stroke="rgba(80,227,194,0.15)" strokeWidth="1.5" strokeDasharray="6 6" fill="none">
              <path d="M 120 520 L 120 160 L 720 160" />
              <path d="M 120 360 L 640 360 L 640 440" />
              <path d="M 120 520 L 640 520 L 640 440" />
              <path d="M 380 360 L 380 160" />
              <path d="M 520 260 L 520 160" />
            </g>

            {/* Building Blocks (EIC Dark Emerald Surface Cards) */}
            {Object.values(CAMPUS_VENUES).map((venue) => {
              const isActiveVenue = activeVenueIds.includes(venue.id)
              const isSelected = selectedEvent?.venueId === venue.id
              const isHovered = hoveredVenueId === venue.id
              const isEntry = venue.id === 'entry'

              return (
                <g
                  key={`building-${venue.id}`}
                  transform={`translate(${venue.x}, ${venue.y})`}
                  filter="url(#eicShadow)"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredVenueId(venue.id)}
                  onMouseLeave={() => setHoveredVenueId(null)}
                  onClick={() => {
                    const matchEvent = events.find((e) => e.venueId === venue.id)
                    if (matchEvent) onSelectEvent(matchEvent)
                  }}
                >
                  {/* Building Box */}
                  <rect
                    x="-42"
                    y="-24"
                    width="84"
                    height="48"
                    rx="10"
                    fill={
                      isEntry
                        ? '#0E2217'
                        : isSelected
                        ? '#0E2217'
                        : isHovered
                        ? '#111A12'
                        : '#0D140E'
                    }
                    stroke={
                      isEntry
                        ? '#50E3C2'
                        : isSelected
                        ? '#50E3C2'
                        : isHovered
                        ? '#E8A33D'
                        : isActiveVenue
                        ? 'rgba(80,227,194,0.3)'
                        : 'rgba(255,255,255,0.08)'
                    }
                    strokeWidth={isSelected || isEntry ? '2.5' : '1.5'}
                  />

                  {/* Inner Roof Pattern */}
                  <rect
                    x="-34"
                    y="-18"
                    width="68"
                    height="36"
                    rx="6"
                    fill="none"
                    stroke={
                      isEntry
                        ? 'rgba(80,227,194,0.4)'
                        : isSelected
                        ? '#50E3C2'
                        : 'rgba(255,255,255,0.08)'
                    }
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Building Code Badge */}
                  <text
                    x="0"
                    y="-2"
                    textAnchor="middle"
                    fill={isEntry || isSelected ? '#50E3C2' : isHovered ? '#E2FBEA' : '#8A9488'}
                    fontSize="10"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {venue.code}
                  </text>

                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="#A3B899"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {venue.shortName}
                  </text>
                </g>
              )
            })}

            {/* ── STRAIGHT LINE ROUTE PATHS LAYER ─────────────────────────── */}

            {/* 1. All Overview Routes */}
            {!selectedEvent &&
              activeVenueIds.map((vId) => {
                if (vId === 'entry') return null
                const venue = CAMPUS_VENUES[vId]
                if (!venue || !venue.points) return null

                const dStr =
                  'M ' + venue.points.map((p) => `${p[0]} ${p[1]}`).join(' L ')

                return (
                  <g key={`all-route-${vId}`}>
                    <path
                      d={dStr}
                      fill="none"
                      stroke={venue.color || '#50E3C2'}
                      strokeWidth="3"
                      strokeOpacity="0.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="6 6"
                    />

                    {venue.points.slice(1, -1).map((pt, i) => (
                      <circle
                        key={`elbow-${i}`}
                        cx={pt[0]}
                        cy={pt[1]}
                        r="4"
                        fill="#070B08"
                        stroke={venue.color || '#50E3C2'}
                        strokeWidth="2"
                      />
                    ))}
                  </g>
                )
              })}

            {/* 2. Selected Event Focused Route */}
            {selectedEvent && activeSelectedVenue && activeSelectedVenue.points && (
              <g key={`selected-route-${selectedEvent.id}`}>
                {(() => {
                  const dStr =
                    'M ' +
                    activeSelectedVenue.points
                      .map((p) => `${p[0]} ${p[1]}`)
                      .join(' L ')

                  return (
                    <>
                      {/* Underlay Glow */}
                      <path
                        d={dStr}
                        fill="none"
                        stroke="#50E3C2"
                        strokeWidth="10"
                        strokeOpacity="0.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Main Solid Line */}
                      <path
                        d={dStr}
                        fill="none"
                        stroke="#50E3C2"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Direction Flow Dots */}
                      <path
                        d={dStr}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        strokeDasharray="8 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-dash"
                      />

                      {/* Turn Elbow Nodes */}
                      {activeSelectedVenue.points
                        .slice(1, -1)
                        .map((turnPt, idx) => (
                          <g
                            key={`turn-node-${idx}`}
                            transform={`translate(${turnPt[0]}, ${turnPt[1]})`}
                          >
                            <circle
                              r="12"
                              fill="#50E3C2"
                              stroke="#070B08"
                              strokeWidth="2.5"
                            />
                            <text
                              x="0"
                              y="3.5"
                              textAnchor="middle"
                              fill="#070B08"
                              fontSize="9"
                              fontWeight="900"
                              fontFamily="monospace"
                            >
                              T{idx + 1}
                            </text>

                            <g transform="translate(0, -20)">
                              <rect
                                x="-32"
                                y="-10"
                                width="64"
                                height="18"
                                rx="9"
                                fill="#0D140E"
                                stroke="#50E3C2"
                                strokeWidth="1"
                              />
                              <text
                                x="0"
                                y="2"
                                textAnchor="middle"
                                fill="#50E3C2"
                                fontSize="9"
                                fontWeight="700"
                              >
                                Turn {idx + 1}
                              </text>
                            </g>
                          </g>
                        ))}
                    </>
                  )
                })()}
              </g>
            )}

            {/* Entry Gate Start Beacon Node */}
            <g transform="translate(120, 520)">
              <circle r="18" fill="rgba(80,227,194,0.2)" className="animate-ping" />
              <circle r="10" fill="#50E3C2" stroke="#070B08" strokeWidth="2.5" />
              <circle r="4" fill="#070B08" />
              <g transform="translate(0, 24)">
                <rect x="-42" y="-10" width="84" height="18" rx="9" fill="#50E3C2" />
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  fill="#070B08"
                  fontSize="9"
                  fontWeight="800"
                  fontFamily="sans-serif"
                >
                  START GATE
                </text>
              </g>
            </g>

            {/* Target Destination Node Badge */}
            {selectedEvent && activeSelectedVenue && (
              <g transform={`translate(${activeSelectedVenue.x}, ${activeSelectedVenue.y})`}>
                <circle r="22" fill="rgba(80,227,194,0.25)" className="animate-ping" />
                <circle r="12" fill="#50E3C2" stroke="#FFFFFF" strokeWidth="3" />
                <g transform="translate(0, -36)">
                  <rect
                    x="-65"
                    y="-12"
                    width="130"
                    height="22"
                    rx="11"
                    fill="#0D140E"
                    stroke="#50E3C2"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#50E3C2"
                    fontSize="10"
                    fontWeight="800"
                  >
                    📍 {activeSelectedVenue.shortName}
                  </text>
                </g>
              </g>
            )}
          </svg>
        </motion.div>

        {/* Selected Event Navigation Panel (EIC Floating HUD Card) */}
        <AnimatePresence>
          {selectedEvent && activeSelectedVenue && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md z-30 p-5 rounded-2xl bg-[#0D140E]/95 border border-[#50E3C2] backdrop-blur-xl shadow-[0_0_30px_rgba(80,227,194,0.2)] text-white"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#50E3C2] animate-pulse" />
                  <span className="font-mono-data text-xs uppercase tracking-wider text-[#50E3C2] font-bold">
                    Turning Route Guide
                  </span>
                </div>
                <button
                  onClick={() => onSelectEvent(null)}
                  className="font-mono-data text-[10px] uppercase text-[#8A9488] hover:text-white"
                >
                  Clear Path
                </button>
              </div>

              <h4 className="font-display text-lg text-white mb-1">
                {selectedEvent.title}
              </h4>

              <div className="flex items-center gap-2 text-xs font-mono-data text-[#8A9488] my-2">
                <span className="text-[#50E3C2] font-bold flex items-center gap-1">
                  <MapPin size={13} />
                  {activeSelectedVenue.name}
                </span>
                <span>•</span>
                <span className="text-[#E8A33D] font-bold">
                  {selectedEvent.distance} ({selectedEvent.walkTime} walk)
                </span>
              </div>

              {/* Explicit Turns List */}
              {activeSelectedVenue.turns && (
                <div className="mt-3 pt-3 border-t border-[#50E3C2]/15">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono-data text-xs font-bold text-[#E2FBEA] flex items-center gap-1">
                      <Footprints size={13} className="text-[#50E3C2]" /> Explicit Turns Guide
                    </span>
                    <button
                      onClick={() => setShowSteps(!showSteps)}
                      className="font-mono-data text-[10px] text-[#50E3C2] font-bold"
                    >
                      {showSteps ? 'Hide Turns' : 'Show Turns'}
                    </button>
                  </div>

                  {showSteps && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {activeSelectedVenue.turns.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-xl bg-[#070B08] border border-[#50E3C2]/20 text-xs font-sans text-[#E2FBEA] flex items-center gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#50E3C2]/15 text-[#50E3C2] font-mono-data font-bold text-[11px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Legend (EIC Palette) */}
      <div className="relative z-20 px-4 py-3 bg-[#070B08]/90 border-t border-[#50E3C2]/15 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono-data text-[#8A9488]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#50E3C2]" />
            Main Gate 1 (Start)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8A33D]" />
            Building Landmarks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-[#50E3C2] rounded-full" />
            Straight Walkway Path
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <Info size={13} className="text-[#50E3C2]" />
          EIC Brand Architectural Campus Guide
        </div>
      </div>

      <style jsx global>{`
        @keyframes dashFlow {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash {
          animation: dashFlow 2s linear infinite;
        }
      `}</style>
    </div>
  )
}
