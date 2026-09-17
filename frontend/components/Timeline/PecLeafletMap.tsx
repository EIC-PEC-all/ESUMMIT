'use client'

import { useEffect, useRef } from 'react'
import { CAMPUS_VENUES } from '@/lib/data'
import { ScheduleEvent } from './CampusMap'

interface PecLeafletMapProps {
  events: ScheduleEvent[]
  selectedEvent: ScheduleEvent | null
  onSelectEvent: (event: ScheduleEvent | null) => void
  activeDayLabel: string
}

// PEC Chandigarh Center
const PEC_CENTER: [number, number] = [30.7673, 76.7871]

export default function PecLeafletMap({
  events,
  selectedEvent,
  onSelectEvent,
  activeDayLabel,
}: PecLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  // Initialize Leaflet Map once
  useEffect(() => {
    const L = typeof window !== 'undefined' ? (window as any).L : null
    if (!mapContainerRef.current || mapInstanceRef.current || !L) return

    const map = L.map(mapContainerRef.current, {
      center: PEC_CENTER,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'osm-dark-tiles'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current = {}
    }
  }, [])

  // Sync Markers dynamically whenever events or selectedEvent change
  useEffect(() => {
    const map = mapInstanceRef.current
    const L = typeof window !== 'undefined' ? (window as any).L : null
    if (!map || !L) return

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => {
      map.removeLayer(marker)
    })
    markersRef.current = {}

    // Group events by venueId or unique coordinates
    const venueMap = new Map<
      string,
      {
        id: string
        name: string
        building: string
        lat: number
        lng: number
        events: ScheduleEvent[]
      }
    >()

    // Add default campus landmarks first
    Object.values(CAMPUS_VENUES).forEach((v) => {
      venueMap.set(v.id, {
        id: v.id,
        name: v.name,
        building: v.description || 'PEC Campus',
        lat: v.lat,
        lng: v.lng,
        events: [],
      })
    })


    // Override/Merge with dynamic live schedule events
    events.forEach((e) => {
      const vId = e.venueId || e.id
      const fallbackVenue = CAMPUS_VENUES[vId]
      const lat = e.lat ?? fallbackVenue?.lat ?? PEC_CENTER[0]
      const lng = e.lng ?? fallbackVenue?.lng ?? PEC_CENTER[1]
      const name = e.venueName || fallbackVenue?.name || 'PEC Venue'
      const building = e.building || fallbackVenue?.description || 'PEC Campus'

      const existing = venueMap.get(vId)
      if (existing) {
        existing.lat = lat
        existing.lng = lng
        existing.name = name
        existing.building = building
        existing.events.push(e)
      } else {
        venueMap.set(vId, {
          id: vId,
          name,
          building,
          lat,
          lng,
          events: [e],
        })
      }
    })

    // Render Markers
    venueMap.forEach((venue) => {
      const isSelected =
        selectedEvent?.venueId === venue.id ||
        (selectedEvent &&
          Math.abs((selectedEvent.lat ?? -999) - venue.lat) < 0.0001 &&
          Math.abs((selectedEvent.lng ?? -999) - venue.lng) < 0.0001)

      const customIcon = L.divIcon({
        className: 'pec-marker-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            ${
              isSelected
                ? `<div style="
                    position: absolute;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: #BAEF4B;
                    opacity: 0.3;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>`
                : ''
            }
            <div style="
              width: ${isSelected ? '34px' : '26px'};
              height: ${isSelected ? '34px' : '26px'};
              background: ${isSelected ? '#BAEF4B' : '#0A110E'};
              border: 1.5px solid ${isSelected ? '#ffffff' : '#BAEF4B'};
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${isSelected ? '#0A110E' : '#BAEF4B'};
              font-weight: bold;
              transition: all 0.3s ease;
              box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="${isSelected ? '16' : '13'}" height="${isSelected ? '16' : '13'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon }).addTo(map)

      marker.bindPopup(`
        <div style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; background: #0A110E; color: #ffffff;">
          <h4 style="margin: 0 0 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: #BAEF4B; letter-spacing: 0.05em;">${venue.name}</h4>
          <p style="margin: 0 0 6px; font-size: 10px; color: #94A3B8; text-transform: uppercase;">${venue.building}</p>
          <div style="font-size: 9px; color: #BAEF4B; opacity: 0.8; font-family: monospace;">(${venue.lat.toFixed(5)}, ${venue.lng.toFixed(5)})</div>
        </div>
      `)

      marker.on('click', () => {
        if (venue.events.length > 0) {
          onSelectEvent(venue.events[0])
        }
      })

      markersRef.current[venue.id] = marker

      if (isSelected) {
        marker.openPopup()
      }
    })
  }, [events, selectedEvent, onSelectEvent])

  // Fly to venue when selectedEvent changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedEvent) return

    const fallbackVenue = CAMPUS_VENUES[selectedEvent.venueId]
    const targetLat = selectedEvent.lat ?? fallbackVenue?.lat
    const targetLng = selectedEvent.lng ?? fallbackVenue?.lng

    if (targetLat !== undefined && targetLng !== undefined) {
      map.flyTo([targetLat, targetLng], 17, {
        duration: 1.0,
        easeLinearity: 0.25,
      })

      const marker =
        markersRef.current[selectedEvent.venueId] ||
        markersRef.current[selectedEvent.id]
      if (marker) {
        marker.openPopup()
      }
    }
  }, [selectedEvent])

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-none overflow-hidden border border-border-subtle shadow-none bg-void pec-map-wrapper">
      <style>{`
        /* Brutalist Popup Styles for Timeline Map */
        .pec-map-wrapper .leaflet-popup-content-wrapper {
          background: #0A110E !important;
          border-radius: 0px !important;
          border: 1px solid rgba(186, 239, 75, 0.35) !important;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.9) !important;
          padding: 0 !important;
        }
        .pec-map-wrapper .leaflet-popup-tip {
          background: #0A110E !important;
          border-bottom: 1px solid rgba(186, 239, 75, 0.35) !important;
          border-right: 1px solid rgba(186, 239, 75, 0.35) !important;
          box-shadow: none !important;
        }
        .pec-map-wrapper .leaflet-popup-content {
          margin: 0 !important;
        }
        .pec-map-wrapper .leaflet-popup-close-button {
          color: #94A3B8 !important;
          padding: 4px !important;
          font-family: monospace !important;
        }
      `}</style>

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Header Banner */}
      <div className="absolute top-4 left-4 z-20 px-4 py-3 rounded-none bg-[#0A110E] border-l-4 border-l-mint border-y border-r border-[rgba(255,255,255,0.05)] text-[10px] font-mono-data font-bold text-primary flex items-center gap-3 shadow-[0_15px_30px_-10px_rgba(0,0,0,1)] uppercase tracking-wider">
        <span className="w-2.5 h-2.5 bg-mint animate-pulse" />
        <span>PEC Campus Map — Sector 12 ({activeDayLabel})</span>
      </div>

      {/* Floating Reset Button */}
      <button
        type="button"
        onClick={() => {
          onSelectEvent(null)
          mapInstanceRef.current?.flyTo(PEC_CENTER, 16)
        }}
        className="absolute bottom-4 right-4 z-20 px-4 py-2.5 rounded-none bg-[#0A110E] border border-[rgba(255,255,255,0.05)] text-[10px] font-mono-data font-bold text-secondary hover:text-mint hover:border-mint/50 transition-colors shadow-[0_15px_30px_-10px_rgba(0,0,0,1)] uppercase tracking-wider"
      >
        [ Reset Center ]
      </button>
    </div>
  )
}
