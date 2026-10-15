

export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [76.7749, 30.7415] as [number, number],
  zoom: 18,
  pitch: 0,
  bearing: 0,
}

export const MAP_LAYER_IDS = {
  campusBoundary: 'campus-boundary',
  campusBoundaryLine: 'campus-boundary-line',
  routeGlow: 'route-glow',
  route: 'route',
} as const

export const MAP_SOURCE_IDS = {
  campusBoundary: 'campus-boundary',
  venues: 'venues',
  userLocation: 'user-location',
  destination: 'destination',
  route: 'route',
} as const

export const VENUE_TYPE_COLORS = {
  auditorium: '#FF4D3D', // Neon red
  expo: '#FF8C42',       // Neon orange
  seminar: '#4341A8',    // Cyan
  admin: '#9B5CFF',      // Violet
  lab: '#8AC53F',        // Cyber Aqua
  social: '#7BB832',     // Mint
  entrance: '#8AC53F',   // Teal
} as const

export const ROUTE_COLOR = '#4285F4' // Google Maps Blue
export const ROUTE_GLOW_COLOR = 'rgba(66, 133, 244, 0.4)'
export const DESTINATION_COLOR = '#8AC53F'
export const USER_DOT_COLOR = '#8AC53F'
export const ROUTE_WIDTH = 8

export const ANIMATION_CONFIG = {
  routeDrawDuration: 1500,
  flyToDuration: 1500,
  markerPulseDuration: 2000,
}

export const DEFAULT_VIEWPORT = {
  center: [76.7749, 30.7415] as [number, number],
  zoom: 18,
  pitch: 45,
  bearing: 0,
}

export const VENUE_ICON_SIZE = 1.2
export const USER_LOCATION_SIZE = 1.5
export const DESTINATION_SIZE = 1.8