# Read the file
with open('lib/data.ts', 'r') as f:
    content = f.read()

# Find the first CAMPUS_VENUES and add the missing venues from the second definition
# The first CAMPUS_VENUES ends with "}" at line 360 (before SCHEDULE)
# We need to add the missing venues before the closing brace of CAMPUS_VENUES

# The missing venues from the second CAMPUS_VENUES that need to be added:
additional_venues = '''
  'main-auditorium': {
    id: 'main-auditorium',
    name: 'Main Auditorium (CCA)',
    building: 'CCA Building',
    coordinates: [76.78426071541261, 30.76551511053145] as [number, number],
    type: 'auditorium',
  },
  'expo-hall': {
    id: 'expo-hall',
    name: 'Expo Hall (SPIC Centre)',
    building: 'SPIC Centre',
    coordinates: [76.78585010939216, 30.765833700196882] as [number, number],
    type: 'expo',
  },
  'seminar-hall': {
    id: 'seminar-hall',
    name: 'Seminar Hall (NAB)',
    building: 'NAB Building',
    coordinates: [76.7861161958663, 30.768068775179547] as [number, number],
    type: 'seminar',
  },
  'admin-block': {
    id: 'admin-block',
    name: 'Admin Block (Electrical Dept)',
    building: 'Electrical Engineering Department',
    coordinates: [76.78647612578088, 30.767251839321425] as [number, number],
    type: 'admin',
  },
  'cse-block': {
    id: 'cse-block',
    name: 'CSE & ECE Block (Hackathon Lab)',
    building: 'CSE & ECE Department',
    coordinates: [76.78532031055364, 30.76782763758229] as [number, number],
    type: 'lab',
  },
  'main-gate': {
    id: 'main-gate',
    name: 'Main Gate (Gate 1)',
    building: 'Campus Entrance - Gate 1',
    coordinates: [76.78367500421939, 30.763153888145272] as [number, number],
    type: 'entrance',
  },
  'student-center': {
    id: 'student-center',
    name: 'Student Center (PEC Market)',
    building: 'PEC Market Area',
    coordinates: [76.78348530072951, 30.766326667038925] as [number, number],
    type: 'social',
  },
  'workshop-hall': {
    id: 'workshop-hall',
    name: 'Workshop Hall',
    building: 'CCA Building (Upper Floor)',
    coordinates: [76.7845, 30.7657] as [number, number],
    type: 'seminar',
  },
  'job-fair-zone': {
    id: 'job-fair-zone',
    name: 'Job Fair Zone',
    building: 'Expo Hall (SPIC Centre) - Hall B',
    coordinates: [76.7856, 30.7656] as [number, number],
    type: 'expo',
  },
  'rd-conclave-hall': {
    id: 'rd-conclave-hall',
    name: 'R&D Conclave Hall',
    building: 'NAB Building - Conference Room',
    coordinates: [76.7860, 30.7678] as [number, number],
    type: 'seminar',
  },
  'ipl-auction-room': {
    id: 'ipl-auction-room',
    name: 'IPL Auction Room',
    building: 'CCA Building - Seminar Room',
    coordinates: [76.7843, 30.7653] as [number, number],
    type: 'seminar',
  },
  'ignite-stage': {
    id: 'ignite-stage',
    name: 'Ignite Stage',
    building: 'Main Auditorium (CCA)',
    coordinates: [76.78426071541261, 30.76551511053145] as [number, number],
    type: 'auditorium',
  },
  'treasure-hunt-start': {
    id: 'treasure-hunt-start',
    name: 'Treasure Hunt Start',
    building: 'Student Center (PEC Market)',
    coordinates: [76.78348530072951, 30.766326667038925] as [number, number],
    type: 'social',
  },
  'baazar-zone': {
    id: 'baazar-zone',
    name: 'Baazar Marketplace',
    building: 'PEC Market / Open Grounds',
    coordinates: [76.7837, 30.7661] as [number, number],
    type: 'social',
  },
  'quiz-hall': {
    id: 'quiz-hall',
    name: 'Quiz Hall',
    building: 'Seminar Hall (NAB)',
    coordinates: [76.7861161958663, 30.768068775179547] as [number, number],
    type: 'seminar',
  },
  'funding-conclave-room': {
    id: 'funding-conclave-room',
    name: 'Funding Conclave Room',
    building: 'Admin Block - Meeting Room',
    coordinates: [76.7863, 30.7670] as [number, number],
    type: 'admin',
  },
  'case-competition-room': {
    id: 'case-competition-room',
    name: 'Case Competition Room',
    building: 'CSE & ECE Block - Seminar Room',
    coordinates: [76.7852, 30.7676] as [number, number],
    type: 'lab',
  },
'''

# Find the closing brace of the first CAMPUS_VENUES (before SCHEDULE)
# The first CAMPUS_VENUES ends with "} as const" before SCHEDULE
# We need to insert the additional venues before the closing brace

# Find the position of the first CAMPUS_VENUES closing
parts = content.split('export const SCHEDULE = {')
if len(parts) >= 2:
    before_schedule = parts[0]
    after_schedule = 'export const SCHEDULE = {' + parts[1]
    
    # Find the closing of first CAMPUS_VENUES (the "} as const" before SCHEDULE)
    # Look for the pattern "} as const" followed by "export const SCHEDULE"
    cves_end = before_schedule.rfind('} as const')
    if cves_end != -1:
        # Find the closing brace of the object (before "as const")
        # We need to insert before the closing brace of the object
        obj_end = before_schedule.rfind('}', cves_end - 50, cves_end)
        if obj_end != -1:
            # Insert the additional venues before the closing brace
            new_before = before_schedule[:obj_end] + ',\n' + additional_venues + before_schedule[obj_end:]
            content = new_before + 'export const SCHEDULE = {' + after_schedule

with open('lib/data.ts', 'w') as f:
    f.write(content)

print("Done adding missing venues")