import { useState, useCallback, useRef, useEffect } from 'react'
import { findShortestPath, getVenueCoordinates } from './campusGraph'
import type { RouteData, DayEventVenue } from './types'

interface UseWalkingNavigationOptions {
  onRouteCalculated?: (route: RouteData) => void
  onError?: (error: string) => void
}

interface UseWalkingNavigationReturn {
  route: RouteData | null
  isCalculating: boolean
  error: string | null
  calculateRoute: (origin: [number, number], destination: [number, number]) => RouteData | null
  calculateRouteToEvent: (origin: [number, number], event: DayEventVenue) => RouteData | null
  updateRouteForNewOrigin: (newOrigin: [number, number]) => RouteData | null
  animateRouteProgress: (progress: number) => [number, number][]
  clearRoute: () => void
}

export function useWalkingNavigation(
  options: UseWalkingNavigationOptions = {}
): UseWalkingNavigationReturn {
  const { onRouteCalculated, onError } = options
  const [route, setRoute] = useState<RouteData | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const animatedCoordinatesRef = useRef<[number, number][]>([])
  const currentDestinationRef = useRef<[number, number] | null>(null)
  const previousRouteCoordsRef = useRef<[number, number][]>([])

  const clearRoute = useCallback(() => {
    setRoute(null)
    setError(null)
    currentDestinationRef.current = null
    previousRouteCoordsRef.current = []
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    startTimeRef.current = null
    animatedCoordinatesRef.current = []
  }, [])

  const calculateRoute = useCallback(
    (origin: [number, number], destination: [number, number]): RouteData | null => {
      setIsCalculating(true)
      setError(null)

      try {
        const result = findShortestPath(origin, destination)
        
        if (!result) {
          throw new Error('No valid route found between locations')
        }

        const routeData: RouteData = {
          coordinates: result.coordinates,
          distance: result.distance,
          duration: result.duration,
          from: origin,
          to: destination,
        }

        currentDestinationRef.current = destination
        previousRouteCoordsRef.current = route?.coordinates || []
        setRoute(routeData)
        onRouteCalculated?.(routeData)
        return routeData
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to calculate route'
        setError(message)
        onError?.(message)
        return null
      } finally {
        setIsCalculating(false)
      }
    },
    [onRouteCalculated, onError]
  )

  const calculateRouteToEvent = useCallback(
    (origin: [number, number], event: DayEventVenue): RouteData | null => {
      const destination = getVenueCoordinates(event.venue)
      if (!destination) {
        const message = `Venue coordinates not found for ${event.venueName}`
        setError(message)
        onError?.(message)
        return null
      }
      return calculateRoute(origin, destination)
    },
    [calculateRoute, onError]
  )

  const updateRouteForNewOrigin = useCallback(
    (newOrigin: [number, number]): RouteData | null => {
      if (!currentDestinationRef.current) return null
      return calculateRoute(newOrigin, currentDestinationRef.current)
    },
    [calculateRoute]
  )

  const animateRouteProgress = useCallback(
    (progress: number): [number, number][] => {
      if (!route || route.coordinates.length < 2) return []
      
      const clampedProgress = Math.max(0, Math.min(1, progress))
      const totalSegments = route.coordinates.length - 1
      const segmentsToShow = clampedProgress * totalSegments
      const fullSegments = Math.floor(segmentsToShow)
      const partialProgress = segmentsToShow - fullSegments
      
      const animatedCoords: [number, number][] = []
      
      for (let i = 0; i <= fullSegments; i++) {
        animatedCoords.push(route.coordinates[i])
      }
      
      if (partialProgress > 0 && fullSegments < totalSegments) {
        const start = route.coordinates[fullSegments]
        const end = route.coordinates[fullSegments + 1]
        const interp: [number, number] = [
          start[0] + (end[0] - start[0]) * partialProgress,
          start[1] + (end[1] - start[1]) * partialProgress,
        ]
        animatedCoords.push(interp)
      }
      
      animatedCoordinatesRef.current = animatedCoords
      return animatedCoords
    },
    [route]
  )

  useEffect(() => {
    if (!route) return
    
    const duration = 1500
    startTimeRef.current = performance.now()
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return
      
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      animateRouteProgress(progress)
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        animationFrameRef.current = null
        startTimeRef.current = null
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [route, animateRouteProgress])

  return {
    route,
    isCalculating,
    error,
    calculateRoute,
    calculateRouteToEvent,
    updateRouteForNewOrigin,
    animateRouteProgress,
    clearRoute,
  }
}