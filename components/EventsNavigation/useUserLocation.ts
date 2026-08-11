import { useState, useEffect, useCallback, useRef } from 'react'
import type { UserLocation } from './types'

function calculateBearing(startLat: number, startLng: number, destLat: number, destLng: number) {
  const startLatRad = (startLat * Math.PI) / 180
  const startLngRad = (startLng * Math.PI) / 180
  const destLatRad = (destLat * Math.PI) / 180
  const destLngRad = (destLng * Math.PI) / 180

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad)
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad)
  let brng = Math.atan2(y, x)
  brng = (brng * 180) / Math.PI
  return (brng + 360) % 360
}

interface UseUserLocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watchPosition?: boolean
  onPositionUpdate?: (location: UserLocation) => void
  debounceMs?: number
}

interface UseUserLocationReturn {
  location: UserLocation | null
  error: string | null
  isLoading: boolean
  getCurrentLocation: () => Promise<UserLocation | null>
  startWatching: () => void
  stopWatching: () => void
  isWatching: boolean
}

export function useUserLocation(options: UseUserLocationOptions = {}): UseUserLocationReturn {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watchPosition = false,
    onPositionUpdate,
    debounceMs = 2000,
  } = options

  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isWatching, setIsWatching] = useState(false)

  const watchIdRef = useRef<number | null>(null)
  const isMountedRef = useRef(true)
  const lastUpdateRef = useRef<number>(0)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    if (!isMountedRef.current) return
    
    const now = Date.now()
    if (now - lastUpdateRef.current < debounceMs) return
    lastUpdateRef.current = now

    // Determine heading: either from device compass (if moving/available) or calculate from previous coords
    let heading = position.coords.heading
    setLocation((prevLocation) => {
      if (heading === null || isNaN(heading)) {
        if (prevLocation) {
          const [prevLng, prevLat] = prevLocation.coordinates
          const distanceMoved = Math.sqrt(
            Math.pow(position.coords.longitude - prevLng, 2) + Math.pow(position.coords.latitude - prevLat, 2)
          )
          // Only update calculated heading if they've moved a tiny bit to avoid jitter
          if (distanceMoved > 0.00001) {
            heading = calculateBearing(prevLat, prevLng, position.coords.latitude, position.coords.longitude)
          } else {
            heading = prevLocation.heading || 0
          }
        } else {
          heading = 0
        }
      }

      const newLocation: UserLocation = {
        coordinates: [position.coords.longitude, position.coords.latitude],
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        heading: heading,
      }
      
      setError(null)
      setIsLoading(false)
      
      if (onPositionUpdate) {
        onPositionUpdate(newLocation)
      }
      
      return newLocation
    })
  }, [debounceMs, onPositionUpdate])

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (!isMountedRef.current) return
    
    let message = 'Unable to retrieve location'
    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = 'Location permission denied. Using campus main gate as starting point.'
        break
      case err.POSITION_UNAVAILABLE:
        message = 'Location information unavailable.'
        break
      case err.TIMEOUT:
        message = 'Location request timed out.'
        break
    }
    
    setError(message)
    setIsLoading(false)
  }, [])

  const getCurrentLocation = useCallback((): Promise<UserLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser.')
        setIsLoading(false)
        resolve(null)
        return
      }

      setIsLoading(true)
      setError(null)

      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy,
        timeout,
        maximumAge,
      })

      setTimeout(() => resolve(location), 100)
    })
  }, [handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge, location])

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    if (watchIdRef.current !== null) return

    setIsWatching(true)
    setError(null)

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    )
  }, [handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge])

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
      setIsWatching(false)
    }
  }, [])

  return {
    location,
    error,
    isLoading,
    getCurrentLocation,
    startWatching,
    stopWatching,
    isWatching,
  }
}