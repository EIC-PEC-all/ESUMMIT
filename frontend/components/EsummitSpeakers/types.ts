export interface EventItem {
  id: string
  time: string
  title: string
  tag: string
  venueId: string
  venueName: string
  building: string
  lat: number
  lng: number
}

export interface DayCard {
  num: string
  day: string
  date: string
  title: string
  events: EventItem[]
}

export const PEC_CENTER: [number, number] = [30.7673, 76.7871]

export const VENUE_COORDS: Record<
  string,
  { venueName: string; building: string; lat: number; lng: number }
> = {
  main_stage: { venueName: 'Main Auditorium', building: 'Block A, Sector 12', lat: 30.7672, lng: 76.7874 },
  expo_floor: { venueName: 'Exhibition Grounds', building: 'Central Quadrangle', lat: 30.7668, lng: 76.7869 },
  pitch_room: { venueName: 'EIC Incubator Hall', building: 'Block B, 2nd Floor', lat: 30.7678, lng: 76.7862 },
  hacker_lab: { venueName: 'Computer Center', building: 'IT Complex, 3rd Floor', lat: 30.7662, lng: 76.7878 },
  vip_lounge: { venueName: 'PEC Club Lounge', building: 'North Lawn Pavilion', lat: 30.7682, lng: 76.787 },
}

export const CARDS: DayCard[] = [
  {
    num: '01',
    day: 'DAY 01',
    date: 'NOVEMBER 14, 2026',
    title: 'Inauguration & Pitch Arena',
    events: [
      {
        id: 'd1-ev1',
        time: '09:30 AM',
        title: 'Grand Opening & Keynote Address',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
      {
        id: 'd1-ev2',
        time: '11:00 AM',
        title: 'Startup Expo & Founder Alley Launch',
        tag: 'Expo Floor',
        venueId: 'expo_floor',
        ...VENUE_COORDS.expo_floor,
      },
      {
        id: 'd1-ev3',
        time: '02:00 PM',
        title: 'VC Pitch Arena: Qualifying Round',
        tag: 'Pitch Room',
        venueId: 'pitch_room',
        ...VENUE_COORDS.pitch_room,
      },
      {
        id: 'd1-ev4',
        time: '05:00 PM',
        title: '24-Hour National Hackathon Kickoff',
        tag: 'Hacker Lab',
        venueId: 'hacker_lab',
        ...VENUE_COORDS.hacker_lab,
      },
      {
        id: 'd1-ev5',
        time: '08:00 PM',
        title: 'VIP Investor & Founder Networking Dinner',
        tag: 'VIP Lounge',
        venueId: 'vip_lounge',
        ...VENUE_COORDS.vip_lounge,
      },
    ],
  },
  {
    num: '02',
    day: 'DAY 02',
    date: 'NOVEMBER 15, 2026',
    title: 'Hackathon Demos & Grand Finals',
    events: [
      {
        id: 'd2-ev1',
        time: '10:00 AM',
        title: 'DeepTech & GenAI VC Masterclass',
        tag: 'Auditorium',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
      {
        id: 'd2-ev2',
        time: '12:30 PM',
        title: 'Hackathon Live Project Demos & Judging',
        tag: 'Hacker Lab',
        venueId: 'hacker_lab',
        ...VENUE_COORDS.hacker_lab,
      },
      {
        id: 'd2-ev3',
        time: '03:00 PM',
        title: 'Grand Pitch Finals (₹7.5L Pool)',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
      {
        id: 'd2-ev4',
        time: '05:30 PM',
        title: 'Valedictory Keynote & Award Ceremony',
        tag: 'Main Stage',
        venueId: 'main_stage',
        ...VENUE_COORDS.main_stage,
      },
    ],
  },
]
