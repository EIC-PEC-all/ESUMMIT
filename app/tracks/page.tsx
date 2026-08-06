'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Users, Store, Code2, Network, ArrowLeft, CheckCircle2, X, Sparkles } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

const ICONS: Record<string, any> = {
  Zap, Users, Store, Code2, Network,
}

const DETAILED_TRACK_DATA = [
  {
    id: 'pitch',
    title: 'Pitch Competition',
    tagline: 'North India’s Flagship Startup Pitching Arena',
    prize: '₹7.5 Lakhs Pool',
    deadline: 'March 5, 2026',
    teams: '2-4 Members',
    category: 'Competitions',
    icon: 'Zap',
    color: 'var(--accent-mint)',
    highlights: [
      'Pitch directly to Surge, Sequoia EIRs, and Chandigarh Angels',
      'Top 3 teams get guaranteed incubation offer at PEC TBI',
      'Free Startup Expo booth for shortlisted finalists',
      'One-on-one deck feedback session prior to finals',
    ],
    eligibility: 'Open to college students & early-stage startups (Pre-series A, less than ₹1Cr funding).',
  },
  {
    id: 'hackathon',
    title: '24-Hour Hackathon',
    tagline: 'Code, Build, and Launch Overnight',
    prize: '₹5.0 Lakhs Pool + $500 Cloud Credits',
    deadline: 'March 8, 2026',
    teams: '2-4 Members',
    category: 'Competitions',
    icon: 'Code2',
    color: 'var(--accent-mint)',
    highlights: [
      'Problem statements revealed 48 hours before kickoff',
      'Tracks: AI/ML, ClimateTech, Web3, and Open Innovation',
      'All-night energy drinks, meals, and Hacker Lounge provided',
      'Direct interview fast-tracks for top engineering hackers',
    ],
    eligibility: 'Open to all undergraduate & postgraduate students with valid college ID.',
  },
  {
    id: 'expo',
    title: 'Startup Expo',
    tagline: 'Showcase Your MVP to 3,000+ Attendees & VCs',
    prize: '6 On-Spot LOIs & Mentorship',
    deadline: 'March 1, 2026',
    teams: '1-5 Members',
    category: 'Exhibitions',
    icon: 'Store',
    color: 'var(--accent-mint)',
    highlights: [
      'Dedicated exhibit booth with power, high-speed Wi-Fi, and signage',
      'Investor floor walks with 20+ active Angel Investors & VC Partners',
      'Product demo stage slots for selected high-traction startups',
      'Media coverage by TechCircle & StartupStory',
    ],
    eligibility: 'Student-led startups, PEC alumni startups, and early-stage tech companies.',
  },
  {
    id: 'panels',
    title: 'Thought Leadership Panels',
    tagline: 'Hard-hitting Founder Playbooks & VC Insights',
    prize: 'Certificate & VIP Access',
    deadline: 'Open Registration',
    teams: 'Individual',
    category: 'Sessions',
    icon: 'Users',
    color: 'var(--accent-mint)',
    highlights: [
      'Fundraising in Tough Times: Lessons from Series B Founders',
      'DeepTech India: AI & Hardware Innovation from Campus to Market',
      'Student-to-Founder Playbook: Balancing Academics and Equity',
      'Interactive Live Q&A from the floor during every session',
    ],
    eligibility: 'Included with all E-Summit General & VIP Passes.',
  },
  {
    id: 'networking',
    title: 'Investor & Peer Mixer',
    tagline: 'Structured Speed Networking & VC Office Hours',
    prize: '1-on-1 VC Slot Access',
    deadline: 'March 10, 2026',
    teams: 'Individual / Co-founders',
    category: 'Networking',
    icon: 'Network',
    color: 'var(--accent-mint)',
    highlights: [
      'Speed Networking: 5-minute rotation rounds with fellow builders',
      'Investor Open Hours: 15-minute 1-on-1 slots by prior booking',
      'Closing Evening Networking Social with music & refreshments',
      'Digital Attendee Directory access post-event',
    ],
    eligibility: 'Available for VIP Pass holders, Pitch Finalists & Registered Delegations.',
  },
]

export default function TracksLandingPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Competitions' | 'Exhibitions' | 'Sessions' | 'Networking'>('All')
  const [selectedTrack, setSelectedTrack] = useState<typeof DETAILED_TRACK_DATA[0] | null>(null)
  const [registered, setRegistered] = useState(false)

  const filteredTracks = DETAILED_TRACK_DATA.filter(
    (t) => activeCategory === 'All' || t.category === activeCategory
  )

  const handleRegisterTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setRegistered(true)
    toast.success(`Registered for ${selectedTrack?.title}! Details sent to email.`, {
      style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
      iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[var(--accent-mint)]/20 overflow-hidden">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-[var(--accent-mint)] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-mint)]/15 border border-[var(--accent-mint)]/30 mb-6">
              <Sparkles size={14} className="text-[var(--accent-mint)]" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-[var(--accent-mint)]">
                E-Summit 2026 Flagship Tracks
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              SUMMIT TRACKS &amp; <br />
              <span className="text-stroke-green">COMPETITIONS</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
              Explore our core tracks — pitch your startup, hack through the night, demo your product at the Expo, or connect with India’s leading venture capital partners.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3">
              {['All', 'Competitions', 'Exhibitions', 'Sessions', 'Networking'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className="px-5 py-2.5 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? 'var(--accent-mint)' : '#0A110E',
                    color: activeCategory === cat ? '#040605' : '#9CA3AF',
                    fontWeight: activeCategory === cat ? 700 : 400,
                    border: `1px solid ${activeCategory === cat ? 'transparent' : 'rgba(126,211,33,0.2)'}`,
                    boxShadow: activeCategory === cat ? '0 0 15px rgba(126,211,33,0.4)' : 'none',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className="py-20 bg-[#111A12]">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTracks.map((track) => {
              const IconComp = ICONS[track.icon] || Zap
              return (
                <motion.div
                  key={track.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl p-8 flex flex-col justify-between border border-[var(--accent-mint)]/20 bg-panel hover:border-[var(--accent-mint)] transition-all duration-300 group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-void border border-[var(--accent-mint)]/30"
                      >
                        <IconComp size={24} className="text-[var(--accent-mint)]" />
                      </div>
                      <span
                        className="font-mono-data text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-void text-muted border border-[var(--accent-mint)]/20"
                      >
                        {track.category}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl mb-2 text-white group-hover:text-[var(--accent-mint)] transition-colors">
                      {track.title}
                    </h3>
                    <p className="font-body text-sm text-muted mb-6">{track.tagline}</p>

                    <div className="space-y-2 mb-8 py-4 border-t border-b border-[var(--accent-mint)]/15 font-mono-data text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted">Prize / Value:</span>
                        <span className="text-[var(--accent-mint)] font-semibold">{track.prize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Format:</span>
                        <span className="text-white">{track.teams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Deadline:</span>
                        <span className="text-[var(--accent-mint)]">{track.deadline}</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-8">
                      {track.highlights.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 font-body text-xs text-gray-200">
                          <CheckCircle2 size={14} className="text-[var(--accent-mint)] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => { setSelectedTrack(track); setRegistered(false) }}
                    className="w-full py-3.5 rounded-xl font-body font-semibold text-sm btn-ghost justify-center hover:border-[var(--accent-mint)] hover:text-[var(--accent-mint)]"
                  >
                    View Guidelines &amp; Register
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Track Details Modal */}
      <AnimatePresence>
        {selectedTrack && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl p-8 bg-panel border border-[var(--accent-mint)]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTrack(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-white bg-void"
              >
                <X size={18} />
              </button>

              {!registered ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-mint)] font-bold">
                      ⚡ {selectedTrack.category} Track
                    </span>
                    <h3 className="font-display text-4xl text-white mt-1">{selectedTrack.title}</h3>
                    <p className="font-body text-sm text-muted mt-1">{selectedTrack.tagline}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-xl bg-void border border-[var(--accent-mint)]/20">
                      <h4 className="font-mono-data text-xs uppercase text-[var(--accent-mint)] mb-2 font-bold">Key Highlights</h4>
                      <ul className="space-y-2">
                        {selectedTrack.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-200">
                            <span className="text-[var(--accent-mint)]">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-void border border-[var(--accent-mint)]/20">
                      <h4 className="font-mono-data text-xs uppercase text-[var(--accent-mint)] mb-1 font-bold">Eligibility Criteria</h4>
                      <p className="font-body text-xs text-muted leading-relaxed">{selectedTrack.eligibility}</p>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterTrack} className="space-y-4">
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">
                        Team Lead Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="team@startup.com"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>

                    <button type="submit" className="w-full btn-green justify-center py-3.5 text-sm mt-4 font-bold">
                      Submit Track Registration
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-mint)]/20 border border-[var(--accent-mint)] text-[var(--accent-mint)] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display text-3xl text-white mb-2">Registration Submitted!</h3>
                  <p className="font-body text-sm text-muted mb-6">
                    You have successfully applied for <strong>{selectedTrack.title}</strong>. Check your inbox for confirmation details and submission guidelines.
                  </p>
                  <button onClick={() => setSelectedTrack(null)} className="btn-green px-8 py-3 font-bold">
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <Concierge />
    </main>
  )
}
