'use client'

/**
 * CampusMap.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Main map container component. Initialises the Mapbox map via `useCampusMap`
 * and delegates route rendering and marker management to dedicated child
 * components:
 *
 *   RouteLayer  — manages the blue GeoJSON polyline source + layers
 *   UserMarker  — manages the user arrow marker + red destination pin
 *
 * The map instance is created once and never re-created. All updates are
 * applied imperatively through the child components' useEffect hooks.
 */

import { useRef, useEffect, useState } from 'react'
import type { RouteData, UserLocation, DayEventVenue } from './types'
import { useCampusMap } from './useCampusMap'
import { RouteLayer } from './RouteLayer'
import { UserMarker } from './UserMarker'

interface CampusMapProps {
  day: 'day1' | 'day2'
  selectedEvent: DayEventVenue | null
  userLocation: UserLocation | null
  route: RouteData | null
  isNavigating?: boolean
  onMapError?: (error: string) => void
}

export function CampusMap({
  day,
  selectedEvent,
  userLocation,
  route,
  isNavigating = false,
  onMapError,
}: CampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Track map readiness as React state so child components re-render once the
  // map style is loaded and it is safe to add sources / layers.
  const [mapLoaded, setMapLoaded] = useState(false)

  const lastSelectedEventRef = useRef<DayEventVenue | null>(null)

  const {
    map,
    cinematicFlyToEvent,
    updateCameraForNavigation,
    exitNavigationCamera,
    resize,
  } = useCampusMap({
    containerRef,
    day,
    onMapLoad: () => setMapLoaded(true),
    onError: onMapError,
  })

  // ── Camera: follow user in 3-D when navigating ─────────────────────────────
  useEffect(() => {
    if (mapLoaded && isNavigating && userLocation) {
      updateCameraForNavigation(userLocation)
    }
  }, [userLocation, isNavigating, updateCameraForNavigation, mapLoaded])

  useEffect(() => {
    if (mapLoaded && !isNavigating) {
      exitNavigationCamera()
    }
  }, [isNavigating, exitNavigationCamera, mapLoaded])

  // ── Cinematic fly-to when a new event is selected ──────────────────────────
  useEffect(() => {
    if (mapLoaded && selectedEvent && selectedEvent !== lastSelectedEventRef.current) {
      cinematicFlyToEvent(selectedEvent)
      lastSelectedEventRef.current = selectedEvent
    }
  }, [selectedEvent, cinematicFlyToEvent, mapLoaded])

  // ── Handle container resize (e.g. sidebar collapse) ───────────────────────
  useEffect(() => {
    if (map) resize()
  }, [map, resize])

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-[24px] overflow-hidden"
      style={{
        background: '#050505',
        border: '1px solid rgba(57,255,20,0.15)',
        boxShadow: 'inset 0 0 80px rgba(57,255,20,0.03)',
      }}
      aria-label={`PEC Campus map — ${day === 'day1' ? 'Day 1' : 'Day 2'} events navigation`}
    >
      {/*
        RouteLayer and UserMarker render no DOM; they attach to the Mapbox map
        instance imperatively. They are mounted inside this div so they unmount
        correctly when the map container is removed from the tree.
      */}
      <RouteLayer map={map} mapLoaded={mapLoaded} route={route} />
      <UserMarker
        map={map}
        mapLoaded={mapLoaded}
        userLocation={userLocation}
        selectedEvent={selectedEvent}
      />
    </div>
  )
}