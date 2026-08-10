'use client'

/**
 * RouteLayer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A React component that renders the navigation route as a Mapbox GeoJSON
 * source + line layers. This component does NOT mount any DOM elements — it
 * manages Mapbox GL sources and layers imperatively using the map instance.
 *
 * Design decisions:
 * - Uses a single 'route' GeoJSON source that is updated in-place instead of
 *   adding/removing layers on every render.
 * - Renders a double-layer effect: a wider, blurred glow beneath the crisp
 *   main line, identical to the Google Maps "thick blue route" look.
 * - The component renders null in the JSX tree; all effects are side-effects
 *   on the Mapbox map instance.
 */

import { useEffect } from 'react'
import type mapboxgl from 'mapbox-gl'
import type { RouteData } from './types'

// Source / layer IDs — kept stable to prevent duplicate registration
const ROUTE_SOURCE_ID = 'navigation-route'
const ROUTE_GLOW_LAYER_ID = 'navigation-route-glow'
const ROUTE_LINE_LAYER_ID = 'navigation-route-line'

// Visual constants
const ROUTE_COLOR = '#4285F4'            // Google Maps Blue
const ROUTE_GLOW_COLOR = 'rgba(66,133,244,0.35)'
const ROUTE_WIDTH = 7                    // Main line width in pixels
const ROUTE_GLOW_WIDTH = ROUTE_WIDTH * 2 // Glow width in pixels

interface RouteLayerProps {
  /** Live Mapbox map instance passed from the parent. */
  map: mapboxgl.Map | null
  /** Whether the map has fully loaded its style. */
  mapLoaded: boolean
  /** The current route to display, or null to clear it. */
  route: RouteData | null
}

export function RouteLayer({ map, mapLoaded, route }: RouteLayerProps) {
  // ── Step 1: Register the source and layers exactly once after the map loads ──
  useEffect(() => {
    if (!map || !mapLoaded || !map.isStyleLoaded()) return

    // Guard: if source already exists (e.g. hot-reload), skip adding it again
    if (!map.getSource(ROUTE_SOURCE_ID)) {
      // Add an empty GeoJSON source — it will be populated by the next effect
      map.addSource(ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      // ── Layer 1: soft glow behind the route line ──
      map.addLayer({
        id: ROUTE_GLOW_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ROUTE_GLOW_COLOR,
          'line-width': ROUTE_GLOW_WIDTH,
          'line-blur': ROUTE_WIDTH / 1.5,
          'line-opacity': 0.85,
        },
      })

      // ── Layer 2: crisp opaque route line on top ──
      map.addLayer({
        id: ROUTE_LINE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': ROUTE_COLOR,
          'line-width': ROUTE_WIDTH,
          'line-opacity': 1,
        },
      })
    }

    // Cleanup: remove source and layers when this component unmounts
    return () => {
      if (map.getLayer(ROUTE_LINE_LAYER_ID)) map.removeLayer(ROUTE_LINE_LAYER_ID)
      if (map.getLayer(ROUTE_GLOW_LAYER_ID)) map.removeLayer(ROUTE_GLOW_LAYER_ID)
      if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)
    }
  }, [map, mapLoaded])

  // ── Step 2: Update the source data whenever the route changes ──
  useEffect(() => {
    if (!map || !mapLoaded || !map.isStyleLoaded()) return

    const source = map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
    if (!source) return // Source not registered yet — next render will catch it

    if (route && route.coordinates.length >= 2) {
      // Update the GeoJSON in-place — no layer recreation needed
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: route.coordinates },
            properties: {},
          },
        ],
      })
    } else {
      // Clear the route by setting an empty feature collection
      source.setData({ type: 'FeatureCollection', features: [] })
    }
  }, [map, mapLoaded, route])

  // This component has no DOM output — it only manages Mapbox GL layers
  return null
}
