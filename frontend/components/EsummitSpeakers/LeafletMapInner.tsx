'use client'

import React, { useRef, useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { EventItem, PEC_CENTER, VENUE_COORDS } from './types'

export interface LeafletMapInnerProps {
  selectedEvent: EventItem | null
  activeDayIndex: number
  dayEvents: EventItem[]
  onClearSelection: () => void
  onSelectEventId: (id: string) => void
}

export default function LeafletMapInner({
  selectedEvent,
  activeDayIndex,
  dayEvents,
  onClearSelection,
  onSelectEventId,
}: LeafletMapInnerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  // Map initialization
  useEffect(() => {
    if (mapInstanceRef.current) return

    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css' as any)]).then(
      ([{ default: L }]) => {
        if (mapInstanceRef.current) return

        const map = L.map(mapContainerRef.current!, {
          center: PEC_CENTER,
          zoom: 16,
          attributionControl: false,
        })

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        L.tileLayer(tileUrl, {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
          className: 'osm-dark-tiles'
        }).addTo(map)

        mapInstanceRef.current = map
        setMapInstance(map)
      }
    )

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        setMapInstance(null)
      }
    }
  }, [])

  // Sync Markers when dayEvents change
  useEffect(() => {
    const L = typeof window !== 'undefined' ? (window as any).L : null
    if (!mapInstance || !L) return

    Object.values(markersRef.current).forEach((marker) => {
      mapInstance.removeLayer(marker)
    })
    markersRef.current = {}

    // Group events by venueId using Map
    const venueMap = new Map<
      string,
      {
        venueId: string
        venueName: string
        building: string
        lat: number
        lng: number
        events: EventItem[]
      }
    >()

    dayEvents.forEach((ev) => {
      const vKey = ev.venueId || ev.id
      const fallback = VENUE_COORDS[vKey]
      let lat = ev.lat || fallback?.lat || PEC_CENTER[0]
      let lng = ev.lng || fallback?.lng || PEC_CENTER[1]

      if (lat === 0 || lng === 0) {
        lat = fallback?.lat || PEC_CENTER[0]
        lng = fallback?.lng || PEC_CENTER[1]
      }

      const venueName = ev.venueName || fallback?.venueName || 'PEC Venue'
      const building = ev.building || fallback?.building || 'PEC Campus'

      const existing = venueMap.get(vKey)
      if (existing) {
        existing.lat = lat
        existing.lng = lng
        existing.venueName = venueName
        existing.building = building
        existing.events.push(ev)
      } else {
        venueMap.set(vKey, {
          venueId: vKey,
          venueName,
          building,
          lat,
          lng,
          events: [ev],
        })
      }
    })

    venueMap.forEach((vData, vKey) => {
      const customIcon = L.divIcon({
        className: `highlights-marker-${vKey}`,
        html: `
          <div role="button" aria-label="${vData.venueName}" style="display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;">
            <div style="width:32px;height:32px;background:#0A110E;border:1.5px solid #7ED321;display:flex;align-items:center;justify-content:center;color:#7ED321;transition:all 0.3s ease;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker([vData.lat, vData.lng], {
        icon: customIcon,
        title: vData.venueName,
        alt: vData.venueName,
      }).addTo(mapInstance)

      marker.bindPopup(`
        <div style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; background: #0A110E; color: #ffffff;">
          <h4 style="margin: 0 0 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #7ED321; letter-spacing: 0.05em;">${vData.venueName}</h4>
          <p style="margin: 0; font-size: 10px; color: #94A3B8; text-transform: uppercase;">${vData.building}</p>
        </div>
      `)

      marker.on('click', () => {
        if (vData.events.length > 0) {
          onSelectEventId(vData.events[0].id)
        }
      })

      markersRef.current[vKey] = marker
    })
  }, [dayEvents, mapInstance, onSelectEventId])

  // Pan / FlyTo on selection
  useEffect(() => {
    if (!mapInstance) return
    const L = typeof window !== 'undefined' ? (window as any).L : null
    if (!L) return

    if (selectedEvent) {
      const fallback = VENUE_COORDS[selectedEvent.venueId]
      let lat = selectedEvent.lat || fallback?.lat || PEC_CENTER[0]
      let lng = selectedEvent.lng || fallback?.lng || PEC_CENTER[1]

      if (lat === 0 || lng === 0) {
        lat = fallback?.lat || PEC_CENTER[0]
        lng = fallback?.lng || PEC_CENTER[1]
      }

      mapInstance.flyTo([lat, lng], 17, { duration: 1.0, easeLinearity: 0.25 })
      const marker = markersRef.current[selectedEvent.venueId]
      if (marker) marker.openPopup()
    } else {
      const points = dayEvents
        .map((ev) => {
          const fallback = VENUE_COORDS[ev.venueId || ev.id]
          let lat = ev.lat || fallback?.lat
          let lng = ev.lng || fallback?.lng
          if (lat === 0 || lng === 0) {
            lat = fallback?.lat
            lng = fallback?.lng
          }
          return lat && lng ? ([lat, lng] as [number, number]) : null
        })
        .filter((p): p is [number, number] => p !== null)

      if (points.length > 0) {
        const bounds = L.latLngBounds(points)
        mapInstance.fitBounds(bounds, { padding: [50, 50], duration: 1.0 })
      } else {
        mapInstance.flyTo(PEC_CENTER, 16, { duration: 1.0, easeLinearity: 0.25 })
      }
    }
  }, [selectedEvent, activeDayIndex, mapInstance, dayEvents])

  return (
    <div className="relative h-full w-full bg-[#0B1410]">
      <style>{`
        .custom-lime-map { background: #0B1410 !important; }
        .custom-lime-map .leaflet-popup-content-wrapper {
          background: #0A110E !important;
          border-radius: 0px !important;
          border: 1px solid rgba(181, 242, 61, 0.3) !important;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.9) !important;
          padding: 0 !important;
        }
        .custom-lime-map .leaflet-popup-tip {
          background: #0A110E !important;
          border-bottom: 1px solid rgba(181, 242, 61, 0.3) !important;
          border-right: 1px solid rgba(181, 242, 61, 0.3) !important;
          box-shadow: none !important;
        }
        .custom-lime-map .leaflet-popup-content { margin: 0 !important; }
        .custom-lime-map .leaflet-popup-close-button {
          color: #94A3B8 !important;
          padding: 4px !important;
          font-family: monospace !important;
        }
      `}</style>
      <div ref={mapContainerRef} className="h-full w-full z-10 custom-lime-map" />

      {/* Floating Info Overlay */}
      <div className="absolute bottom-6 left-6 right-6 sm:right-auto z-20 sm:w-80 bg-[#0A110E] p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,1)] border border-[rgba(255,255,255,0.05)] border-l-4 border-l-mint">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-mint">
            {selectedEvent ? 'Selected Venue' : `Day 0${activeDayIndex + 1} Venues`}
          </span>
          {selectedEvent && (
            <button
              onClick={onClearSelection}
              className="font-mono-data text-[9px] font-bold text-gray-400 hover:text-white transition-colors cursor-pointer min-h-[36px] px-2 py-1"
              aria-label="Clear selected venue filter"
            >
              [ CLEAR ]
            </button>
          )}
        </div>

        <h3 className="mb-1 font-display text-base font-black text-white uppercase tracking-tight">
          {selectedEvent ? selectedEvent.venueName : 'PEC Campus, Sector 12'}
        </h3>

        <p className="mb-3 font-body text-xs text-gray-400 font-medium">
          {selectedEvent ? selectedEvent.title : 'Interactive Leaflet Campus Map'}
        </p>

        <div className="flex items-center gap-1.5 font-mono-data text-[9px] text-gray-500 font-bold tracking-wider uppercase">
          <MapPin size={10} className="text-[#7ED321]" />
          <span>{selectedEvent ? selectedEvent.building : 'Chandigarh 160012'}</span>
        </div>
      </div>
    </div>
  )
}
