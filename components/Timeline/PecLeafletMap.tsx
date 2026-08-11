'use client'

import { useEffect, useRef } from 'react'
import { CAMPUS_VENUES } from '@/lib/data'

interface ScheduleEvent {
  id: string
  time: string
  title: string
  type: string
  track: string | null
  venueId: string
  venueName: string
  distance: string
  walkTime: string
}

interface PecLeafletMapProps {
  events: ScheduleEvent[]
  selectedEvent: ScheduleEvent | null
  onSelectEvent: (event: ScheduleEvent | null) => void
  activeDayLabel: string
}

export default function PecLeafletMap({
  events,
  selectedEvent,
  onSelectEvent,
  activeDayLabel,
}: PecLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})

  // PEC Chandigarh Center
  const PEC_CENTER: [number, number] = [30.7673, 76.7871]

  useEffect(() => {
    const L = typeof window !== 'undefined' ? (window as any).L : null
    if (!mapContainerRef.current || mapInstanceRef.current || !L) return

    // Initialize Leaflet Map centered on PEC Chandigarh
    const map = L.map(mapContainerRef.current, {
      center: PEC_CENTER,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    // Theme tile layer (CartoDB Dark Matter / Voyager)
    const isLight = document.documentElement.getAttribute('data-theme') === 'light' || document.documentElement.classList.contains('light')
    const tileUrl = isLight
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    mapInstanceRef.current = map

    // Render Markers for all PEC Venues
    Object.values(CAMPUS_VENUES).forEach((venue) => {
      const isSelected = selectedEvent?.venueId === venue.id

      // Custom SVG Icon for PEC Markers
      const customIcon = L.divIcon({
        className: 'pec-marker-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-center;
            position: relative;
          ">
            <div style="
              width: ${isSelected ? '36px' : '28px'};
              height: ${isSelected ? '36px' : '28px'};
              background: ${isSelected ? 'var(--accent-mint)' : '#0A110E'};
              border: 1.5px solid ${isSelected ? '#ffffff' : 'var(--accent-mint)'};
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${isSelected ? '#0A110E' : 'var(--accent-mint)'};
              font-weight: bold;
              transition: all 0.3s ease;
            ">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon }).addTo(map)

      marker.bindPopup(`
        <div style="padding: 12px 14px; font-family: 'JetBrains Mono', monospace; background: #0A110E; color: #ffffff;">
          <h4 style="margin: 0 0 4px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: var(--accent-mint); letter-spacing: 0.05em;">${venue.name}</h4>
          <p style="margin: 0; font-size: 10px; color: #94A3B8; text-transform: uppercase;">${venue.description}</p>
        </div>
      `)

      marker.on('click', () => {
        const matchingEvent = events.find((e) => e.venueId === venue.id)
        if (matchingEvent) {
          onSelectEvent(matchingEvent)
        }
      })

      markersRef.current[venue.id] = marker
    })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Fly to venue when selectedEvent changes
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !selectedEvent) return

    const venue = CAMPUS_VENUES[selectedEvent.venueId]
    if (venue && venue.lat && venue.lng) {
      map.flyTo([venue.lat, venue.lng], 17, {
        duration: 1.2,
        easeLinearity: 0.25,
      })

      const marker = markersRef.current[venue.id]
      if (marker) {
        marker.openPopup()
      }
    }
  }, [selectedEvent])

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-none overflow-hidden border border-border-subtle shadow-none bg-void pec-map-wrapper">
      <style>{`
        /* Brutalist Anti-vibecoded Popup Styles for Timeline Map */
        .pec-map-wrapper .leaflet-popup-content-wrapper {
          background: #0A110E !important;
          border-radius: 0px !important;
          border: 1px solid rgba(126, 211, 33, 0.25) !important;
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.9) !important;
          padding: 0 !important;
        }
        .pec-map-wrapper .leaflet-popup-tip {
          background: #0A110E !important;
          border-bottom: 1px solid rgba(126, 211, 33, 0.25) !important;
          border-right: 1px solid rgba(126, 211, 33, 0.25) !important;
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
        <span>PEC Campus Map — Sector 12</span>
      </div>

      {/* Floating Reset Button */}
      <button
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
