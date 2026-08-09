/**
 * useDirections.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches walking/driving directions from the Mapbox Directions API and manages
 * the current route state. Replaces the custom campus walking graph with real
 * Mapbox road data.
 *
 * Usage:
 *   const { route, isCalculating, fetchRoute, clearRoute } = useDirections()
 *   fetchRoute([originLng, originLat], [destLng, destLat])
 */

import { useState, useCallback, useRef } from 'react'
import type { RouteData } from './types'

interface UseDirectionsOptions {
  /** Called when a new route is successfully calculated */
  onRouteCalculated?: (route: RouteData) => void
  /** Called when an error occurs */
  onError?: (error: string) => void
  /**
   * Mapbox routing profile.
   * 'walking' for pedestrian paths, 'driving' for vehicle roads.
   * Default: 'walking'
   */
  profile?: 'driving' | 'walking' | 'cycling' | 'driving-traffic'
}

interface UseDirectionsReturn {
  route: RouteData | null
  isCalculating: boolean
  error: string | null
  /** Fetches a fresh route from the Mapbox Directions API */
  fetchRoute: (origin: [number, number], destination: [number, number]) => Promise<RouteData | null>
  /** Re-calculates the route from a new origin to the last destination */
  updateRouteOrigin: (newOrigin: [number, number]) => Promise<RouteData | null>
  clearRoute: () => void
}

export function useDirections(options: UseDirectionsOptions = {}): UseDirectionsReturn {
  const { onRouteCalculated, onError, profile = 'walking' } = options

  const [route, setRoute] = useState<RouteData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Keep track of the last destination so we can re-route as the user moves
  const lastDestinationRef = useRef<[number, number] | null>(null)
  // Track in-flight requests to cancel stale ones
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchRoute = useCallback(
    async (
      origin: [number, number],
      destination: [number, number]
    ): Promise<RouteData | null> => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!token) {
        const msg = 'Mapbox access token is missing. Set NEXT_PUBLIC_MAPBOX_TOKEN.'
        setError(msg)
        onError?.(msg)
        return null
      }

      // Cancel any previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setIsCalculating(true)
      setError(null)
      lastDestinationRef.current = destination

      try {
        // Build the Mapbox Directions API URL
        // Format: /v5/mapbox/{profile}/{coordinates}
        const coords = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}` +
          `?alternatives=false&geometries=geojson&steps=false&access_token=${token}`

        const res = await fetch(url, { signal: abortControllerRef.current.signal })

        if (!res.ok) {
          throw new Error(`Mapbox Directions API error: ${res.status} ${res.statusText}`)
        }

        const data = await res.json()

        // Check that we actually got a route back
        if (!data.routes || data.routes.length === 0) {
          throw new Error('No route found between these locations.')
        }

        const leg = data.routes[0]
        const routeData: RouteData = {
          // The GeoJSON geometry coordinates returned by the API: [[lng, lat], ...]
          coordinates: leg.geometry.coordinates as [number, number][],
          // Distance in metres
          distance: leg.distance,
          // Duration in seconds
          duration: leg.duration,
          from: origin,
          to: destination,
        }

        setRoute(routeData)
        onRouteCalculated?.(routeData)
        return routeData
      } catch (err) {
        // Silently ignore aborted requests (caused by a newer call)
        if ((err as Error).name === 'AbortError') return null

        const message = err instanceof Error ? err.message : 'Failed to calculate route'
        setError(message)
        onError?.(message)
        return null
      } finally {
        setIsCalculating(false)
      }
    },
    [profile, onRouteCalculated, onError]
  )

  /**
   * Re-fetches a route from a new origin to the previously stored destination.
   * Call this whenever the user's GPS position changes.
   */
  const updateRouteOrigin = useCallback(
    async (newOrigin: [number, number]): Promise<RouteData | null> => {
      if (!lastDestinationRef.current) return null
      return fetchRoute(newOrigin, lastDestinationRef.current)
    },
    [fetchRoute]
  )

  const clearRoute = useCallback(() => {
    // Abort any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    lastDestinationRef.current = null
    setRoute(null)
    setError(null)
  }, [])

  return {
    route,
    isCalculating,
    error,
    fetchRoute,
    updateRouteOrigin,
    clearRoute,
  }
}
