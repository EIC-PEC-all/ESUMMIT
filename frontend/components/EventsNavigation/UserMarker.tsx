'use client'
// UserMarker is a no-op when using Leaflet - marker management is done inside useCampusMap.
// Kept for interface compatibility.

import type { UserLocation, DayEventVenue } from './types'

interface UserMarkerProps {
  map: unknown
  mapLoaded: boolean
  userLocation: UserLocation | null
  selectedEvent: DayEventVenue | null
}

export function UserMarker(_props: UserMarkerProps) {
  return null
}
