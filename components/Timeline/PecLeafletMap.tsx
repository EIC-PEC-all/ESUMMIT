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
              border-radius: 50%;
              background: ${isSelected ? 'var(--accent-mint)' : venue.color || '#059669'};
              border: 3px solid ${isSelected ? '#ffffff' : 'rgba(255,255,255,0.8)'};
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: bold;
              font-size: 11px;
              transition: all 0.3s ease;
            ">
              📍
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon }).addTo(map)

      marker.bindPopup(`
        <div style="padding: 4px; font-family: sans-serif;">
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: bold; color: #0F172A;">${venue.name}</h4>
          <p style="margin: 0; font-size: 12px; color: #475569;">${venue.description}</p>
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
    <div className="relative w-full h-[520px] sm:h-[600px] lg:h-[640px] rounded-3xl overflow-hidden border border-border-subtle shadow-2xl bg-void">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Header Banner */}
      <div className="absolute top-4 left-4 z-20 px-4 py-2 rounded-xl bg-panel/90 border border-border-subtle backdrop-blur-md text-xs font-mono-data font-bold text-primary flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-mint animate-pulse" />
        <span>PEC Campus Map — Sector 12, Chandigarh</span>
      </div>

      {/* Floating Reset Button */}
      <button
        onClick={() => {
          onSelectEvent(null)
          mapInstanceRef.current?.flyTo(PEC_CENTER, 16)
        }}
        className="absolute bottom-4 right-4 z-20 px-3 py-2 rounded-xl bg-panel/90 border border-border-subtle text-xs font-mono-data font-bold text-secondary hover:text-mint transition-colors shadow-lg"
      >
        Reset Center
      </button>
    </div>
  )
}
