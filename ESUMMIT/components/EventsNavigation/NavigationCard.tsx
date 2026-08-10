'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { CampusMap } from './CampusMap'
import { EventListPanel } from './EventListPanel'
import type { DayEventVenue, RouteData, UserLocation } from './types'
import { useUserLocation } from './useUserLocation'
import { useDirections } from './useDirections'
import { CAMPUS_VENUES } from '@/lib/data'

interface NavigationCardProps {
  day: 'day1' | 'day2'
  index: number
  scrollYProgress: any
}

// Main gate fallback coordinates
const MAIN_GATE_COORDS: [number, number] = CAMPUS_VENUES['main-gate'].coordinates

export function NavigationCard({ day, index, scrollYProgress }: NavigationCardProps) {
  const TOTAL = 2
  const targetScale = 1 - (TOTAL - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [index / TOTAL, 1], [1, targetScale])

  const [selectedEvent, setSelectedEvent] = useState<DayEventVenue | null>(null)
  const [effectiveLocation, setEffectiveLocation] = useState<UserLocation | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  // Refs to store the latest functions without triggering re-renders
  const selectedEventRef = useRef<DayEventVenue | null>(null)
  useEffect(() => { selectedEventRef.current = selectedEvent }, [selectedEvent])

  // ── useDirections: calls the live Mapbox Directions API ─────────────────────
  const {
    route,
    isCalculating,
    fetchRoute,
    updateRouteOrigin,
    clearRoute,
  } = useDirections({
    profile: 'walking',  // walking directions are more relevant on campus
    onRouteCalculated: (newRoute) => console.log('[Navigation] Route fetched:', newRoute.distance + 'm'),
    onError: (err) => console.error('[Navigation] Directions error:', err),
  })

  /**
   * When the GPS position updates and we already have a selected event,
   * re-fetch the route from the new origin. This is the live re-routing
   * behaviour equivalent to Google Maps.
   */
  const handleLocationUpdate = useCallback((newLocation: UserLocation) => {
    setEffectiveLocation(newLocation)
    if (selectedEventRef.current) {
      updateRouteOrigin(newLocation.coordinates)
    }
  }, [updateRouteOrigin])

  const { location: userLocation, error: locationError, getCurrentLocation } = useUserLocation({
    watchPosition: true,
    debounceMs: 3000, // re-route at most every 3 seconds while moving
    onPositionUpdate: handleLocationUpdate,
  })

  // Sync effectiveLocation with userLocation when first acquired
  useEffect(() => {
    if (userLocation && !locationError) {
      setEffectiveLocation(userLocation)
    }
  }, [userLocation, locationError])

  const handleEventSelect = useCallback(async (event: DayEventVenue) => {
    console.log('[Navigation] Event selected:', event.title)
    setSelectedEvent(event)
    setIsNavigating(false)

    // Get the destination coordinates from the venue registry
    const venue = CAMPUS_VENUES[event.venue as keyof typeof CAMPUS_VENUES]
    if (!venue) {
      console.error('[Navigation] Venue not found:', event.venue)
      return
    }

    // Determine origin: live GPS or main-gate fallback
    let origin = effectiveLocation?.coordinates
    if (!origin) {
      console.log('[Navigation] No location yet, requesting...')
      const loc = await getCurrentLocation()
      if (loc) {
        origin = loc.coordinates
        setEffectiveLocation(loc)
      }
    }
    if (!origin) {
      console.log('[Navigation] Using main gate fallback')
      origin = MAIN_GATE_COORDS
      setEffectiveLocation({ coordinates: MAIN_GATE_COORDS, accuracy: 10, timestamp: Date.now() })
    }

    console.log('[Navigation] Fetching Mapbox route from:', origin, 'to:', event.venueName)
    // fetchRoute calls the live Mapbox Directions API
    fetchRoute(origin, venue.coordinates)
  }, [effectiveLocation, getCurrentLocation, fetchRoute])

  return (
    <div
      className="h-[85vh] sticky"
      style={{ top: `calc(${index * 28}px + 6rem)` }}
    >
      <motion.div
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px]
          border-2 p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4"
        style={{
          borderColor: 'rgba(57, 255, 20, 0.25)',
          background: '#080808',
          boxShadow: '0 0 80px rgba(57, 255, 20, 0.04) inset, 0 0 0 0.5px rgba(57,255,20,0.08)',
          scale,
          originY: 0,
        }}
      >
        {/* ── Top row: number + name ── */}
        <div className="flex items-baseline justify-between gap-4 flex-shrink-0">
          <div className="flex items-baseline gap-4 sm:gap-6">
            {/* Number */}
            <span
              className="font-black leading-none select-none"
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontSize: 'clamp(2.5rem, 8vw, 120px)',
                lineHeight: 0.9,
                color: '#39FF14',
                textShadow: '0 0 40px rgba(57, 255, 20, 0.5)',
              }}
            >
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </span>
            {/* Category + name */}
            <div className="flex flex-col">
              <span
                className="font-mono-data uppercase tracking-widest"
                style={{
                  color: '#39FF14',
                  fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
                  opacity: 0.7,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {day === 'day1' ? 'DAY 1' : 'DAY 2'}
              </span>
              <span
                className="font-medium uppercase"
                style={{
                  color: '#F5F5F0',
                  fontFamily: "'Kanit', sans-serif",
                  fontSize: 'clamp(1rem, 2.2vw, 2.1rem)',
                }}
              >
                Navigation
              </span>
            </div>
          </div>
          
          {/* Location status indicator */}
          <div className="flex items-center gap-2 ml-auto">
            {locationError && (
              <span className="font-mono-data text-[9px] text-[#FF4D3D] px-2 py-1 rounded bg-[#FF4D3D]/10" style={{ fontFamily: "'Space Mono', monospace" }}>
                Using Main Gate
              </span>
            )}
            {isCalculating && (
              <span className="font-mono-data text-[9px] text-[#FF8C42] px-2 py-1 rounded bg-[#FF8C42]/10 animate-pulse" style={{ fontFamily: "'Space Mono', monospace" }}>
                Calculating...
              </span>
            )}
            {effectiveLocation && !locationError && (
              <span className="font-mono-data text-[9px] text-[#39FF14] px-2 py-1 rounded bg-[#39FF14]/10" style={{ fontFamily: "'Space Mono', monospace" }}>
                GPS Active
              </span>
            )}
            {effectiveLocation && locationError && (
              <span className="font-mono-data text-[9px] text-[#FF8C42] px-2 py-1 rounded bg-[#FF8C42]/10" style={{ fontFamily: "'Space Mono', monospace" }}>
                Fallback: Main Gate
              </span>
            )}
          </div>
        </div>

        {/* ── Full Map with Floating Event HUD overlay ── */}
        <div className="relative flex-1 min-h-0 overflow-hidden rounded-[20px]">
          {/* Map fills entire area */}
          <div className="absolute inset-0">
            <CampusMap
              day={day}
              selectedEvent={selectedEvent}
              userLocation={effectiveLocation}
              route={route}
              isNavigating={isNavigating}
              onMapError={(err) => console.error('[Navigation] Map error:', err)}
            />
          </div>

          {/* Location permission prompt overlay */}
          {(!effectiveLocation && !locationError) && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/80 z-20 rounded-[20px]">
              <button
                onClick={getCurrentLocation}
                className="px-6 py-3 rounded-xl text-[#050505] font-bold text-sm uppercase tracking-wider transition-all flex items-center gap-2"
                style={{
                  fontFamily: "'Kanit', sans-serif",
                  background: '#39FF14',
                  boxShadow: '0 0 24px rgba(57,255,20,0.5)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(57,255,20,0.9)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(57,255,20,0.5)')}
              >
                <span className="w-5 h-5" />
                Enable Location
              </button>
            </div>
          )}

          {/* GTA HUD: Floating event panel — right side overlay */}
          <div
            className="absolute top-0 right-0 bottom-0 z-10 flex flex-col"
            style={{
              width: 'clamp(200px, 32%, 280px)',
              background: 'linear-gradient(270deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.6) 70%, transparent 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <EventListPanel
              day={day}
              selectedEvent={selectedEvent}
              route={route}
              onSelectEvent={handleEventSelect}
              isNavigating={isNavigating}
              onToggleNavigation={() => setIsNavigating((prev) => !prev)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}