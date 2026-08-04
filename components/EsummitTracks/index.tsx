'use client'
// components/EsummitTracks/index.tsx
// Events section — white background with dark #0C0C0C text and volt-green number accents.
// Vertical numbered list of 5 E-Summit event tracks with staggered FadeIn.

import FadeIn from '@/components/ui/FadeIn'

const EVENTS = [
  {
    num: '01',
    name: 'Pitch Competition',
    description:
      'Present your startup idea to a panel of seasoned VCs and angel investors. Walk in with a deck, walk out with a deal. Categories: Pre-revenue, Revenue-stage, and Social Impact.',
  },
  {
    num: '02',
    name: 'Panel Discussions',
    description:
      'Hard-hitting conversations with founders, CXOs, and policymakers on fundraising in a tough climate, AI for startups, deep-tech in India, and the student-to-founder playbook.',
  },
  {
    num: '03',
    name: 'Startup Expo',
    description:
      'A live floor of 30+ student and early-stage startups showcasing their products to attendees and potential investors. Sectors: EdTech, AgriTech, HealthTech, SaaS, and Sustainability.',
  },
  {
    num: '04',
    name: 'Hackathon',
    description:
      '24 hours. One problem statement. Build something real — or build something ridiculous. Both have won before. Tracks: AI/ML, Web3, Climate Tech, Open Innovation.',
  },
  {
    num: '05',
    name: 'Networking Mixer',
    description:
      'Structured networking sessions: Speed Networking (5-min rotations), Investor Open Hours (one-on-one 15-min slots), and the closing Mixer evening. Meet the right people.',
  },
]

export default function EsummitTracks() {
  return (
    <section
      id="esummit-tracks"
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#FFFFFF', fontFamily: "'Kanit', sans-serif" }}
      aria-labelledby="tracks-heading"
    >
      {/* Heading */}
      <FadeIn>
        <h2
          id="tracks-heading"
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
          style={{
            color: '#070B08',
            fontFamily: "'Kanit', sans-serif",
            fontSize: 'clamp(3rem, 12vw, 160px)',
            lineHeight: 1,
          }}
        >
          Events
        </h2>
      </FadeIn>

      {/* Numbered event list */}
      <div className="max-w-5xl mx-auto">
        {EVENTS.map((event, i) => (
          <FadeIn key={event.num} delay={i * 0.12}>
            <div
              className="flex items-start gap-4 sm:gap-8 py-8 sm:py-10 md:py-12"
              style={{
                borderTop: i === 0 ? '1px solid rgba(7, 11, 8, 0.12)' : undefined,
                borderBottom: '1px solid rgba(7, 11, 8, 0.12)',
              }}
            >
              {/* Number — volt-green */}
              <span
                className="font-black shrink-0 leading-none select-none"
                style={{
                  color: '#7ED321',
                  fontFamily: "'Kanit', sans-serif",
                  fontSize: 'clamp(3rem, 10vw, 140px)',
                  lineHeight: 0.9,
                  textShadow: '0 0 30px rgba(126, 211, 33, 0.3)',
                }}
              >
                {event.num}
              </span>

              {/* Name + description */}
              <div className="flex flex-col gap-2 pt-1 sm:pt-2">
                <h3
                  className="font-medium uppercase"
                  style={{
                    color: '#070B08',
                    fontFamily: "'Kanit', sans-serif",
                    fontSize: 'clamp(1rem, 2.2vw, 2.1rem)',
                  }}
                >
                  {event.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl"
                  style={{
                    color: '#070B08',
                    opacity: 0.55,
                    fontFamily: "'Kanit', sans-serif",
                    fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)',
                  }}
                >
                  {event.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
