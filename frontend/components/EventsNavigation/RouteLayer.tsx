'use client'
// RouteLayer is a no-op when using Leaflet - route management is done inside useCampusMap.
// Kept for interface compatibility.

import type { RouteData } from './types'

interface RouteLayerProps {
  map: unknown
  mapLoaded: boolean
  route: RouteData | null
}

export function RouteLayer(_props: RouteLayerProps) {
  return null
}
