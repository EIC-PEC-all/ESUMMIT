import { useEffect, useRef, useCallback, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import {
  MAPBOX_CONFIG,
  MAP_LAYER_IDS,
  MAP_SOURCE_IDS,
  VENUE_TYPE_COLORS,
  ROUTE_COLOR,
  ROUTE_GLOW_COLOR,
  DESTINATION_COLOR,
  USER_DOT_COLOR,
  ROUTE_WIDTH,
  DEFAULT_VIEWPORT,
} from "./constants"
import { CAMPUS_VENUES, CAMPUS_BOUNDARY } from "@/lib/data"
import type { RouteData, UserLocation, DayEventVenue, DayKey, MapViewport, CampusVenue } from "./types"

const CAMPUS_BOUNDS = [
  [76.78162384683229, 30.763153888145272],
  [76.7892356773224, 30.76606869191917],
] as const

const getIconSvg = (type: CampusVenue["type"], color: string) => {
  const s = `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`
  switch (type) {
    case "auditorium": return `<svg viewBox="0 0 24 24" ${s}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`
    case "expo": return `<svg viewBox="0 0 24 24" ${s}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    case "seminar": return `<svg viewBox="0 0 24 24" ${s}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`
    case "admin": return `<svg viewBox="0 0 24 24" ${s}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>`
    case "lab": return `<svg viewBox="0 0 24 24" ${s}><path d="M9 2v4"/><path d="M15 2v4"/><path d="M10 2h4"/><path d="M12 6v6"/><path d="M6 22h12l-5-10H9Z"/></svg>`
    case "social": return `<svg viewBox="0 0 24 24" ${s}><path d="m18 8-4-4-6 6 4 4 6-6Z"/><path d="m14 12-4 4 2 2 4-4"/><path d="m4 20 4-4"/></svg>`
    case "entrance": return `<svg viewBox="0 0 24 24" ${s}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
    default: return `<svg viewBox="0 0 24 24" ${s}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`
  }
}

interface UseCampusMapOptions {
  containerRef: React.RefObject<HTMLDivElement>
  day: DayKey
  onMapLoad?: (map: mapboxgl.Map) => void
  onError?: (error: string) => void
}

interface UseCampusMapReturn {
  map: mapboxgl.Map | null
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

export function useCampusMap({ containerRef, day, onMapLoad, onError }: UseCampusMapOptions): UseCampusMapReturn {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [viewport, setViewportState] = useState<MapViewport>(DEFAULT_VIEWPORT)
  const isInitializedRef = useRef(false)
  const routeAnimationRef = useRef<number | null>(null)
  const venueMarkersRef = useRef<mapboxgl.Marker[]>([])
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null)

  const setViewport = useCallback((newViewport: Partial<MapViewport>) => {
    setViewportState((prev) => ({ ...prev, ...newViewport }))
    if (mapRef.current) {
      const { center, zoom, pitch, bearing } = { ...viewport, ...newViewport }
      mapRef.current.jumpTo({ center, zoom, pitch, bearing })
    }
  }, [viewport])

  useEffect(() => {
    if (!containerRef.current || isInitializedRef.current) return
    if (!MAPBOX_CONFIG.accessToken) {
      onError?.("Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local")
      return
    }

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_CONFIG.style,
      center: MAPBOX_CONFIG.center,
      zoom: MAPBOX_CONFIG.zoom,
      pitch: MAPBOX_CONFIG.pitch,
      bearing: MAPBOX_CONFIG.bearing,
      antialias: true,
      attributionControl: false,
    })

    mapRef.current = map
    isInitializedRef.current = true

    map.on("load", () => {
      // --- Style Overrides for Cyberpunk Dark Theme ---
      try {
        map.setPaintProperty("background", "background-color", "#050505")
        map.setPaintProperty("water", "fill-color", "#080808")

        const hideLayers = ["poi-label", "transit-label", "airport-label", "natural-point-label", "waterway-label"]
        hideLayers.forEach(l => { if (map.getLayer(l)) map.setLayoutProperty(l, "visibility", "none") })

        const layers = map.getStyle()?.layers || []
        layers.forEach((layer: any) => {
          if (layer.id.includes("road") && layer.type === "line") {
            map.setPaintProperty(layer.id, "line-color", layer.id.includes("major") || layer.id.includes("primary") ? "#222222" : "#1A1A1A")
          }
          if (layer.id.includes("building")) {
            map.setPaintProperty(layer.id, "fill-color", "#111111")
            if (map.getPaintProperty(layer.id, "fill-extrusion-color")) {
              map.setPaintProperty(layer.id, "fill-extrusion-color", "#111111")
            }
          }
          if (layer.id.includes("landuse")) map.setPaintProperty(layer.id, "fill-color", "#0D140D")
          if (layer.id.includes("label") && layer.type === "symbol") {
            map.setPaintProperty(layer.id, "text-color", "#C8C8C8")
            map.setPaintProperty(layer.id, "text-halo-color", "#050505")
          }
        })
      } catch (e) { console.warn("Mapbox style override error", e) }

      // --- Campus Boundary ---
      map.addSource(MAP_SOURCE_IDS.campusBoundary, { type: "geojson", data: CAMPUS_BOUNDARY })
      map.addLayer({
        id: MAP_LAYER_IDS.campusBoundary, type: "fill", source: MAP_SOURCE_IDS.campusBoundary,
        paint: { "fill-color": ROUTE_COLOR, "fill-opacity": 0.03, "fill-outline-color": ROUTE_COLOR },
      })
      map.addLayer({
        id: MAP_LAYER_IDS.campusBoundaryLine, type: "line", source: MAP_SOURCE_IDS.campusBoundary,
        paint: { "line-color": ROUTE_COLOR, "line-width": 1, "line-opacity": 0.3 },
      })

      // --- Route Layers (Glow + Top line) ---
      map.addSource(MAP_SOURCE_IDS.route, { type: "geojson", data: { type: "FeatureCollection", features: [] } })

      map.addLayer({
        id: MAP_LAYER_IDS.routeGlow, type: "line", source: MAP_SOURCE_IDS.route,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ROUTE_GLOW_COLOR, "line-width": ROUTE_WIDTH * 2, "line-blur": ROUTE_WIDTH / 2, "line-opacity": 0.8 },
      })

      map.addLayer({
        id: MAP_LAYER_IDS.route, type: "line", source: MAP_SOURCE_IDS.route,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ROUTE_COLOR, "line-width": ROUTE_WIDTH, "line-opacity": 1 },
      })

      // --- HTML Markers for Venues ---
      Object.entries(CAMPUS_VENUES).forEach(([id, venue]) => {
        const color = VENUE_TYPE_COLORS[venue.type]
        const el = document.createElement("div")
        el.className = "venue-marker"
        Object.assign(el.style, {
          width: "32px", height: "32px", borderRadius: "50%",
          backgroundColor: "#0A0A0A", border: "1.5px solid " + color + "99",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 0 12px " + color + "40",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        })
        el.innerHTML = "<div style=\"width:16px;height:16px\">" + getIconSvg(venue.type, color) + "</div>"
        el.title = venue.name

        el.addEventListener("mouseenter", () => {
          el.style.boxShadow = "0 0 20px " + color
          el.style.transform = "scale(1.15)"
        })
        el.addEventListener("mouseleave", () => {
          el.style.boxShadow = "0 0 12px " + color + "40"
          el.style.transform = "scale(1)"
        })
        el.addEventListener("click", () => flyToVenue(id))

        const marker = new mapboxgl.Marker({ element: el }).setLngLat(venue.coordinates).addTo(map)
        venueMarkersRef.current.push(marker)
      })

      onMapLoad?.(map)

      const handleHighlightVenue = (e: CustomEvent) => flyToVenue(e.detail.venueId)
      window.addEventListener("conciergeHighlightVenue", handleHighlightVenue as EventListener)
      return () => window.removeEventListener("conciergeHighlightVenue", handleHighlightVenue as EventListener)
    })

    map.on("error", (e: any) => onError?.(e.error?.message || "Map error"))

    return () => {
      if (routeAnimationRef.current) cancelAnimationFrame(routeAnimationRef.current)
      venueMarkersRef.current.forEach(m => m.remove())
      userMarkerRef.current?.remove()
      destMarkerRef.current?.remove()
      map.remove()
      mapRef.current = null
      isInitializedRef.current = false
    }
  }, [containerRef, onMapLoad, onError])

  const flyToVenue = useCallback((venueId: string) => {
    const map = mapRef.current
    if (!map) return
    const venue = CAMPUS_VENUES[venueId as keyof typeof CAMPUS_VENUES]
    if (!venue) return
    map.flyTo({
      center: venue.coordinates, zoom: 19.5, pitch: 65,
      bearing: map.getBearing() + 15, duration: 1800,
      easing: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
      essential: true,
    })
  }, [])

  const addRoute = useCallback((route: RouteData) => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource(MAP_SOURCE_IDS.route) as mapboxgl.GeoJSONSource
    if (!source) return

    source.setData({
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: { type: "LineString", coordinates: route.coordinates }, properties: {} }],
    })
  }, [])

  const updateRouteSmooth = useCallback((newCoordinates: [number, number][]) => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource(MAP_SOURCE_IDS.route) as mapboxgl.GeoJSONSource
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features: [{ type: "Feature", geometry: { type: "LineString", coordinates: newCoordinates }, properties: {} }],
      })
    }
  }, [])

  const clearRoute = useCallback(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (routeAnimationRef.current) cancelAnimationFrame(routeAnimationRef.current)
    const source = map.getSource(MAP_SOURCE_IDS.route) as mapboxgl.GeoJSONSource
    if (source) source.setData({ type: "FeatureCollection", features: [] })
  }, [])

  const updateCameraForNavigation = useCallback((location: UserLocation) => {
    const map = mapRef.current
    if (!map) return

    map.easeTo({
      center: location.coordinates,
      bearing: location.heading || map.getBearing(),
      pitch: 65,
      zoom: 19.5,
      duration: 1000,
      easing: (t: number) => t, // Linear ease to avoid jerky tracking when updated frequently
    })
  }, [])

  const exitNavigationCamera = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    map.easeTo({
      pitch: DEFAULT_VIEWPORT.pitch,
      bearing: DEFAULT_VIEWPORT.bearing,
      zoom: DEFAULT_VIEWPORT.zoom,
      duration: 1200,
      essential: true,
    })
  }, [])

  const setUserLocation = useCallback((location: UserLocation | null) => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    if (!location) {
      userMarkerRef.current?.remove()
      userMarkerRef.current = null
      return
    }

    if (!userMarkerRef.current) {
      const el = document.createElement("div")
      el.className = "user-location-marker"
      Object.assign(el.style, {
        width: "48px", height: "48px",
        display: "flex", alignItems: "center", justifyContent: "center",
        filter: "drop-shadow(0 0 10px rgba(57,255,20,0.6))"
      })
      // Google Maps style directional chevron
      el.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" style="transform: translateY(-4px)">
          <path d="M16 2 L28 28 L16 22 L4 28 Z" fill="#4285F4" stroke="#050505" stroke-width="2.5" stroke-linejoin="round" />
        </svg>
      `

      userMarkerRef.current = new mapboxgl.Marker({ 
        element: el,
        rotationAlignment: 'map', // Rotates relative to the map (North = 0)
        pitchAlignment: 'map'
      })
      .setLngLat(location.coordinates)
      .addTo(map)

      if (location.heading !== undefined && location.heading !== null) {
        userMarkerRef.current.setRotation(location.heading)
      }
    } else {
      userMarkerRef.current.setLngLat(location.coordinates)
      if (location.heading !== undefined && location.heading !== null) {
        userMarkerRef.current.setRotation(location.heading)
      }
    }
  }, [])

  const setDestination = useCallback((event: DayEventVenue | null) => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    if (!event) {
      destMarkerRef.current?.remove()
      destMarkerRef.current = null
      return
    }

    const venue = CAMPUS_VENUES[event.venue as keyof typeof CAMPUS_VENUES]
    if (!venue) return

    if (!destMarkerRef.current) {
      const el = document.createElement("div")
      Object.assign(el.style, {
        width: "24px", height: "24px", backgroundColor: DESTINATION_COLOR,
        borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
        border: "2px solid #050505", boxShadow: "2px 2px 10px " + DESTINATION_COLOR + "80",
        position: "relative",
      })
      const inner = document.createElement("div")
      Object.assign(inner.style, {
        width: "8px", height: "8px", backgroundColor: "#050505",
        borderRadius: "50%", position: "absolute",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      })
      el.appendChild(inner)

      if (!document.getElementById("dest-bounce-style")) {
        const style = document.createElement("style")
        style.id = "dest-bounce-style"
        style.innerHTML = "@keyframes destBounce{0%,100%{transform:translateY(0) rotate(-45deg)}50%{transform:translateY(-8px) rotate(-45deg)}}" +
          ".dest-marker-container{animation:destBounce 2s infinite ease-in-out;transform-origin:bottom left}"
        document.head.appendChild(style)
      }

      const container = document.createElement("div")
      container.className = "dest-marker-container"
      container.appendChild(el)

      destMarkerRef.current = new mapboxgl.Marker({ element: container, offset: [0, -12] })
        .setLngLat(venue.coordinates).addTo(map)
    } else {
      destMarkerRef.current.setLngLat(venue.coordinates)
    }
  }, [])

  const cinematicFlyToEvent = useCallback((event: DayEventVenue) => {
    const map = mapRef.current
    if (!map) return
    const venue = CAMPUS_VENUES[event.venue as keyof typeof CAMPUS_VENUES]
    if (!venue) return

    map.fitBounds(CAMPUS_BOUNDS as [[number, number], [number, number]], {
      duration: 800, easing: (t: number) => 1 - Math.pow(1 - t, 3), padding: 50, essential: true,
    })
    setTimeout(() => {
      map.flyTo({
        center: venue.coordinates, zoom: 19.5, pitch: 65,
        bearing: map.getBearing() + 15, duration: 1800,
        easing: (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
        essential: true,
      })
    }, 600)
  }, [])

  const resize = useCallback(() => { mapRef.current?.resize() }, [])

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
