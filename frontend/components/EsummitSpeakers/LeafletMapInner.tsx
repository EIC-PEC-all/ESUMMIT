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
          scrollWheelZoom: false, // Prevent wheel gesture trap
        })

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        L.tileLayer(tileUrl, {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
          className: 'osm-dark-tiles',
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
            <div style="width:30px;height:30px;background:#0D1C10;border:1.5px solid #8AC53F;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#8AC53F;box-shadow:0 0 12px rgba(138,197,63,0.4);transition:all 0.2s ease;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker([vData.lat, vData.lng], {
        icon: customIcon,
        title: vData.venueName,
        alt: vData.venueName,
      }).addTo(mapInstance)

      marker.bindPopup(`
        <div style="padding: 10px 12px; font-family: 'JetBrains Mono', monospace; background: #0D1C10; color: #ffffff; border-radius: 8px;">
          <h4 style="margin: 0 0 3px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #8AC53F; letter-spacing: 0.05em;">${vData.venueName}</h4>
          <p style="margin: 0; font-size: 9.5px; color: #94A3B8; text-transform: uppercase;">${vData.building}</p>
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

      mapInstance.flyTo([lat, lng], 17, { duration: 0.8, easeLinearity: 0.25 })
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
        mapInstance.fitBounds(bounds, { padding: [40, 40], duration: 0.8 })
      } else {
        mapInstance.flyTo(PEC_CENTER, 16, { duration: 0.8, easeLinearity: 0.25 })
      }
    }
  }, [selectedEvent, activeDayIndex, mapInstance, dayEvents])

  return (
    <div className="relative h-full w-full bg-[#0B1410]">
      <style>{`
        .custom-lime-map { background: #0B1410 !important; }
        .custom-lime-map .leaflet-popup-content-wrapper {
          background: #0D1C10 !important;
          border-radius: 8px !important;
          border: 1px solid rgba(0, 242, 178, 0.3) !important;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.9) !important;
          padding: 0 !important;
        }
        .custom-lime-map .leaflet-popup-tip {
          background: #0D1C10 !important;
          border-bottom: 1px solid rgba(0, 242, 178, 0.3) !important;
          border-right: 1px solid rgba(0, 242, 178, 0.3) !important;
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

      {/* Mobile Top Floating Pill: 100% unobtrusive */}
      <div className="sm:hidden absolute top-3 left-3 right-3 z-20 flex items-center justify-between bg-[#0D1C10]/92 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 border-l-2 border-l-[#8AC53F] shadow-lg">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={11} className="text-[#8AC53F] shrink-0" />
          <span className="font-mono-data text-[10px] font-bold text-white truncate">
            {selectedEvent ? `${selectedEvent.venueName} • ${selectedEvent.building}` : 'PEC Campus • Tap pins to inspect'}
          </span>
        </div>
        {selectedEvent && (
          <button
            onClick={onClearSelection}
            className="font-mono-data text-[9px] font-bold text-[#8AC53F] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 shrink-0 ml-2"
            aria-label="Clear selected venue"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Desktop Bottom Floating Card */}
      <div className="hidden sm:block absolute bottom-5 left-5 z-20 w-72 bg-[#0D1C10]/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/10 border-l-4 border-l-[#8AC53F]">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-[#8AC53F]">
            {selectedEvent ? 'Selected Venue' : `Day 0${activeDayIndex + 1} Venues`}
          </span>
          {selectedEvent && (
            <button
              onClick={onClearSelection}
              className="font-mono-data text-[9px] font-bold text-gray-400 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5"
              aria-label="Clear selected venue filter"
            >
              [ CLEAR ]
            </button>
          )}
        </div>

        <h3 className="mb-0.5 font-display text-sm font-black text-white uppercase tracking-tight">
          {selectedEvent ? selectedEvent.venueName : 'PEC Campus, Sector 12'}
        </h3>

        <p className="mb-2 font-body text-[11px] text-gray-400 font-medium truncate">
          {selectedEvent ? selectedEvent.title : 'Interactive Campus Map'}
        </p>

        <div className="flex items-center gap-1.5 font-mono-data text-[9px] text-gray-500 font-bold tracking-wider uppercase">
          <MapPin size={10} className="text-[#8AC53F]" />
          <span>{selectedEvent ? selectedEvent.building : 'Chandigarh 160012'}</span>
        </div>
      </div>
    </div>
  )
}
