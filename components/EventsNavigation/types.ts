import type { CampusVenue } from '@/lib/data'
export type { CampusVenue }

export interface CampusGraphNode {
  coords: [number, number]
  connections: string[]
}

export interface DayEventVenue {
  eventId: string
  title: string
  time: string
  venue: string
  venueName: string
}

export interface UserLocation {
  coordinates: [number, number]
  accuracy: number
  timestamp: number
  heading?: number | null
}

export interface RouteData {
  coordinates: [number, number][]
  distance: number
  duration: number
  from: [number, number]
  to: [number, number]
}

export interface NavigationState {
  selectedEvent: DayEventVenue | null
  userLocation: UserLocation | null
  route: RouteData | null
  isLoading: boolean
  error: string | null
  useFallbackOrigin: boolean
}

export type DayKey = 'day1' | 'day2'

export interface MapViewport {
  center: [number, number]
  zoom: number
  pitch: number
  bearing: number
}

export const VENUE_TYPE_COLORS: Record<CampusVenue['type'], string> = {
  auditorium: '#FF4D3D',
  expo: '#FF8C42',
  seminar: '#3DD9FF',
  admin: '#9B5CFF',
  lab: '#7ED321',
  social: '#00D4AA',
  entrance: '#7ED321',
}

export const VENUE_TYPE_LABELS: Record<CampusVenue['type'], string> = {
  auditorium: 'Auditorium',
  expo: 'Expo Hall',
  seminar: 'Seminar Hall',
  admin: 'Admin Block',
  lab: 'Lab',
  social: 'Social',
  entrance: 'Entrance',
}