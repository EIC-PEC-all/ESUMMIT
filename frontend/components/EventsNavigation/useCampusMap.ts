import { useEffect, useRef, useCallback, useState } from "react"
import {
  VENUE_TYPE_COLORS,
  DEFAULT_VIEWPORT,
} from "./constants"
import { CAMPUS_VENUES } from "@/lib/data"
import type { RouteData, UserLocation, DayEventVenue, DayKey, MapViewport, CampusVenue } from "./types"

const PEC_LAT = 30.7645
const PEC_LNG = 76.7854

interface UseCampusMapOptions {
  containerRef: React.RefObject<HTMLDivElement>
  day: DayKey
  onMapLoad?: (map: unknown) => void
  onError?: (error: string) => void
}

interface UseCampusMapReturn {
  map: unknown
  viewport: MapViewport
  setViewport: (viewport: Partial<MapViewport>) => void
  addRoute: (route: RouteData) => void
  clearRoute: () => void
  setUserLocation: (location: UserLocation | null) => void
  setDestination: (event: DayEventVenue | null) => void
  flyToVenue: (venueId: string) => void
  cinematicFlyToEvent: (event: DayEventVenue) => void
  updateRouteSmooth: (newCoordinates: [number, number][]) => void
  updateCameraForNavigation: (location: UserLocation) => void
  exitNavigationCamera: () => void
  resize: () => void
}

function toLLArr(coords: [number, number]): [number, number] {
  return [coords[1], coords[0]]
}

function getIconSvg(type: CampusVenue["type"], color: string): string {
  const s = `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
  switch (type) {
    case "auditorium": return `<svg viewBox="0 0 24 24" ${s}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`
    case "expo":       return `<svg viewBox="0 0 24 24" ${s}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    case "seminar":    return `<svg viewBox="0 0 24 24" ${s}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`
    case "admin":      return `<svg viewBox="0 0 24 24" ${s}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>`
    case "lab":        return `<svg viewBox="0 0 24 24" ${s}><path d="M9 2v4"/><path d="M15 2v4"/><path d="M10 2h4"/><path d="M12 6v6"/><path d="M6 22h12l-5-10H9Z"/></svg>`
    case "social":     return `<svg viewBox="0 0 24 24" ${s}><path d="m18 8-4-4-6 6 4 4 6-6Z"/><path d="m14 12-4 4 2 2 4-4"/><path d="m4 20 4-4"/></svg>`
    case "entrance":   return `<svg viewBox="0 0 24 24" ${s}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
    default:           return `<svg viewBox="0 0 24 24" ${s}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`
  }
}

type LeafletMap = any

export function useCampusMap({ containerRef, day, onMapLoad, onError }: UseCampusMapOptions): UseCampusMapReturn {
  const mapRef = useRef<LeafletMap>(null)
  const routeLayerRef = useRef<LeafletMap>(null)
  const userMarkerRef = useRef<LeafletMap>(null)
  const destMarkerRef = useRef<LeafletMap>(null)
  const venueMarkersRef = useRef<LeafletMap[]>([])
  const isInitializedRef = useRef(false)
  const [viewport, setViewportState] = useState<MapViewport>(DEFAULT_VIEWPORT)

  const flyToVenue = useCallback((venueId: string) => {
    const map = mapRef.current
    if (!map) return
    const venue = CAMPUS_VENUES[venueId as keyof typeof CAMPUS_VENUES]
    if (!venue) return
    map.flyTo(toLLArr(venue.coordinates as [number, number]), 19, { duration: 1.5 })
  }, [])

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return
    isInitializedRef.current = true

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    if (!document.getElementById("leaflet-campus-styles")) {
      const style = document.createElement("style")
      style.id = "leaflet-campus-styles"
      style.innerHTML =
        `.leaflet-campus-tooltip{background:#0d1f15;color:#B5F23D;border:1px solid #B5F23D40;font-size:11px;font-weight:700;font-family:monospace;padding:3px 8px;border-radius:6px;box-shadow:none}` +
        `.leaflet-campus-tooltip::before{display:none}` +
        `.leaflet-container{background:#0d1f15}`
      document.head.appendChild(style)
    }

    import("leaflet").then((L) => {
      if (!containerRef.current) return

      const map = L.map(containerRef.current!, {
        center: [PEC_LAT, PEC_LNG],
        zoom: 17,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        className: 'osm-dark-tiles'
      }).addTo(map)

      // Add a custom attribution control
      L.control.attribution({ position: "bottomright", prefix: "&copy; OpenStreetMap contributors" }).addTo(map)
      L.control.zoom({ position: "bottomright" }).addTo(map)

      mapRef.current = map

      Object.entries(CAMPUS_VENUES).forEach(([id, venue]) => {
        const v = venue as CampusVenue
        const color = VENUE_TYPE_COLORS[v.type] || "#39FF14"
        const latLng = toLLArr(v.coordinates as [number, number])

        const el = document.createElement("div")
        Object.assign(el.style, {
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "#0A0A0A", border: `1.5px solid ${color}99`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: `0 0 12px ${color}40`,
          transition: "all 0.2s ease",
        })
        el.innerHTML = `<div style="width:16px;height:16px">${getIconSvg(v.type, color)}</div>`
        el.title = v.name
        el.addEventListener("mouseenter", () => {
          el.style.boxShadow = `0 0 20px ${color}`
          el.style.transform = "scale(1.15)"
        })
        el.addEventListener("mouseleave", () => {
          el.style.boxShadow = `0 0 12px ${color}40`
          el.style.transform = "scale(1)"
        })
        el.addEventListener("click", () => flyToVenue(id))

        const icon = L.divIcon({ html: el, className: "", iconSize: [32, 32], iconAnchor: [16, 16] })
        const marker = L.marker(latLng, { icon }).addTo(map)
        marker.bindTooltip(v.name, { permanent: false, direction: "top", className: "leaflet-campus-tooltip" })
        venueMarkersRef.current.push(marker)
      })

      const handleHighlightVenue = (e: CustomEvent) => flyToVenue(e.detail.venueId)
      window.addEventListener("conciergeHighlightVenue", handleHighlightVenue as EventListener)

      onMapLoad?.(map)

      return () => {
        window.removeEventListener("conciergeHighlightVenue", handleHighlightVenue as EventListener)
      }
    }).catch((err: Error) => {
      onError?.("Failed to load map: " + (err?.message || "Unknown"))
    })

    return () => {
      venueMarkersRef.current.forEach((m) => m.remove())
      venueMarkersRef.current = []
      userMarkerRef.current?.remove()
      destMarkerRef.current?.remove()
      routeLayerRef.current?.remove()
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [containerRef, onMapLoad, onError, flyToVenue])

  const setViewport = useCallback((newViewport: Partial<MapViewport>) => {
    setViewportState((prev) => ({ ...prev, ...newViewport }))
    if (mapRef.current && newViewport.center) {
      mapRef.current.setView(toLLArr(newViewport.center as [number, number]), newViewport.zoom ?? mapRef.current.getZoom())
    }
  }, [])

  const addRoute = useCallback((route: RouteData) => {
    import("leaflet").then((L) => {
      const map = mapRef.current
      if (!map) return
      routeLayerRef.current?.remove()
      const latlngs = route.coordinates.map((c) => toLLArr(c as [number, number]))
      routeLayerRef.current = L.polyline(latlngs, {
        color: "#4285F4", weight: 7, opacity: 1,
        lineJoin: "round", lineCap: "round",
      }).addTo(map)
    })
  }, [])

  const updateRouteSmooth = useCallback((newCoordinates: [number, number][]) => {
    if (!routeLayerRef.current) return
    routeLayerRef.current.setLatLngs(newCoordinates.map((c) => toLLArr(c)))
  }, [])

  const clearRoute = useCallback(() => {
    routeLayerRef.current?.remove()
    routeLayerRef.current = null
  }, [])

  const setUserLocation = useCallback((location: UserLocation | null) => {
    import("leaflet").then((L) => {
      const map = mapRef.current
      if (!map) return
      if (!location) {
        userMarkerRef.current?.remove()
        userMarkerRef.current = null
        return
      }
      const latlng = toLLArr(location.coordinates as [number, number])
      if (!userMarkerRef.current) {
        const el = document.createElement("div")
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 2 L28 28 L16 22 L4 28 Z" fill="#4285F4" stroke="#050505" stroke-width="2.5" stroke-linejoin="round"/></svg>`
        const icon = L.divIcon({ html: el, className: "", iconSize: [32, 32], iconAnchor: [16, 28] })
        userMarkerRef.current = L.marker(latlng, { icon }).addTo(map)
      } else {
        userMarkerRef.current.setLatLng(latlng)
      }
    })
  }, [])

  const setDestination = useCallback((event: DayEventVenue | null) => {
    import("leaflet").then((L) => {
      const map = mapRef.current
      if (!map) return
      if (!event) {
        destMarkerRef.current?.remove()
        destMarkerRef.current = null
        return
      }
      const venue = CAMPUS_VENUES[event.venue as keyof typeof CAMPUS_VENUES]
      if (!venue) return
      const latlng = toLLArr(venue.coordinates as [number, number])
      if (!destMarkerRef.current) {
        const el = document.createElement("div")
        Object.assign(el.style, {
          width: "20px", height: "20px", backgroundColor: "#00FF88",
          borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
          border: "2px solid #050505",
        })
        const icon = L.divIcon({ html: el, className: "", iconSize: [20, 20], iconAnchor: [10, 20] })
        destMarkerRef.current = L.marker(latlng, { icon }).addTo(map)
      } else {
        destMarkerRef.current.setLatLng(latlng)
      }
    })
  }, [])

  const cinematicFlyToEvent = useCallback((event: DayEventVenue) => {
    const map = mapRef.current
    if (!map) return
    const venue = CAMPUS_VENUES[event.venue as keyof typeof CAMPUS_VENUES]
    if (!venue) return
    map.flyTo(toLLArr(venue.coordinates as [number, number]), 19, { duration: 1.5, easeLinearity: 0.5 })
  }, [])

  const updateCameraForNavigation = useCallback((location: UserLocation) => {
    mapRef.current?.panTo(toLLArr(location.coordinates as [number, number]), { animate: true, duration: 0.5 })
  }, [])

  const exitNavigationCamera = useCallback(() => {
    mapRef.current?.flyTo([PEC_LAT, PEC_LNG], 17, { duration: 1.2 })
  }, [])

  const resize = useCallback(() => {
    mapRef.current?.invalidateSize()
  }, [])

  return {
    map: mapRef.current,
    viewport,
    setViewport,
    addRoute,
    clearRoute,
    setUserLocation,
    setDestination,
    flyToVenue,
    cinematicFlyToEvent,
    updateRouteSmooth,
    updateCameraForNavigation,
    exitNavigationCamera,
    resize,
  }
}