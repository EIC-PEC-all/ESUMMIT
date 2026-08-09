'use client'

/**
 * UserMarker.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages the user-location arrow marker and the red destination pin on the
 * Mapbox map.
 *
 * Key design decision — single effect per marker:
 * Using separate effects for "create marker" and "update position" created a
 * race condition where the GPS position update fired before the map container
 * was fully attached, causing `appendChild` to crash on undefined. Now a single
 * effect owns the full lifecycle of each marker.
 */

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import type { UserLocation, DayEventVenue } from './types'
import { CAMPUS_VENUES } from '@/lib/data'

interface UserMarkerProps {
  map: mapboxgl.Map | null
  mapLoaded: boolean
  userLocation: UserLocation | null
  selectedEvent: DayEventVenue | null
}

/** Linear interpolation */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function UserMarker({ map, mapLoaded, userLocation, selectedEvent }: UserMarkerProps) {
  // ── Refs ──────────────────────────────────────────────────────────────────
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const animFrameRef  = useRef<number | null>(null)
  const currentPosRef = useRef<[number, number] | null>(null)
  const targetPosRef  = useRef<[number, number] | null>(null)

  // ── Helper: safely check the map is ready for DOM operations ─────────────
  function mapReady(m: mapboxgl.Map | null): m is mapboxgl.Map {
    try {
      return !!(m && m.isStyleLoaded() && m.getCanvas())
    } catch {
      return false
    }
  }

  // ── User location marker — single effect owns create + update ─────────────
  useEffect(() => {
    // Gate: both map instance AND style must be fully loaded
    if (!mapReady(map) || !mapLoaded) return

    // ── Create marker on first render (or after hot-reload) ──
    if (!userMarkerRef.current) {
      const el = document.createElement('div')
      Object.assign(el.style, {
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: 'drop-shadow(0 0 8px rgba(66,133,244,0.7))',
        pointerEvents: 'none',
      })
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="13" fill="rgba(66,133,244,0.15)" stroke="#4285F4" stroke-width="1.5"/>
          <path d="M15 3 L23 25 L15 20 L7 25 Z" fill="#4285F4" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      `
      userMarkerRef.current = new mapboxgl.Marker({
        element: el,
        rotationAlignment: 'map',
        pitchAlignment: 'map',
      })
    }

    const marker = userMarkerRef.current

    if (!userLocation) {
      // No GPS yet — ensure marker is not on the map
      marker.remove()
      currentPosRef.current = null
      return
    }

    // ── First GPS fix: snap immediately and add to map ──
    if (!currentPosRef.current) {
      currentPosRef.current = [...userLocation.coordinates] as [number, number]
      try {
        marker.setLngLat(userLocation.coordinates).addTo(map!)
      } catch (e) {
        console.warn('[UserMarker] addTo failed, retrying next tick', e)
        return
      }
    }

    // ── Subsequent fixes: smooth lerp animation ──
    targetPosRef.current = [...userLocation.coordinates] as [number, number]

    // Apply compass heading if available
    if (userLocation.heading != null && !isNaN(userLocation.heading)) {
      marker.setRotation(userLocation.heading)
    }

    // Cancel any previous animation before starting a new one
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    const animate = () => {
      if (!currentPosRef.current || !targetPosRef.current || !userMarkerRef.current) return

      const newLng = lerp(currentPosRef.current[0], targetPosRef.current[0], 0.15)
      const newLat = lerp(currentPosRef.current[1], targetPosRef.current[1], 0.15)
      currentPosRef.current = [newLng, newLat]
      userMarkerRef.current.setLngLat(currentPosRef.current)

      const dx = Math.abs(targetPosRef.current[0] - newLng)
      const dy = Math.abs(targetPosRef.current[1] - newLat)
      if (dx > 0.000001 || dy > 0.000001) {
        animFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)

    // ── Cleanup ──
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [map, mapLoaded, userLocation])

  // ── Cleanup marker on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      userMarkerRef.current?.remove()
      userMarkerRef.current = null
    }
  }, [])

  // ── Red destination pin — single effect owns full lifecycle ───────────────
  useEffect(() => {
    // Always remove previous pin first
    destMarkerRef.current?.remove()
    destMarkerRef.current = null

    if (!mapReady(map) || !mapLoaded || !selectedEvent) return

    const venue = CAMPUS_VENUES[selectedEvent.venue as keyof typeof CAMPUS_VENUES]
    if (!venue) return

    const el = document.createElement('div')
    Object.assign(el.style, {
      width: '36px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 0 8px rgba(255,68,68,0.6))',
      pointerEvents: 'none',
    })
    el.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        <path d="M18 2 C8 2 1 9 1 18 C1 28 18 42 18 42 C18 42 35 28 35 18 C35 9 28 2 18 2Z"
          fill="#FF4444" stroke="#ffffff" stroke-width="2"/>
        <circle cx="18" cy="18" r="6" fill="#ffffff"/>
      </svg>
    `

    try {
      destMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(venue.coordinates)
        .addTo(map!)
    } catch (e) {
      console.warn('[UserMarker] dest pin addTo failed', e)
    }

    return () => {
      destMarkerRef.current?.remove()
      destMarkerRef.current = null
    }
  }, [map, mapLoaded, selectedEvent])

  // This component has no DOM output — Mapbox markers are managed imperatively
  return null
}
