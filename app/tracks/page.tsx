'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Users, Store, Code2, Network, ArrowLeft, CheckCircle2, X, Sparkles } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
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
    color: '#F5D400',
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
    color: '#F5D400',
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
    color: '#FFB700',
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
    color: '#F5D400',
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
    color: '#F5D400',
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
      style: { background: '#151515', color: '#F2F2ED', border: '1px solid #F5D400' },
      iconTheme: { primary: '#F5D400', secondary: '#0A0A0A' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-volt-dim/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#F5D400_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-volt transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 mb-6">
              <Sparkles size={14} className="text-volt" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-volt">
                E-Summit 2025 Flagship Tracks
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              SUMMIT TRACKS &amp; <br />
              <span className="text-volt">COMPETITIONS</span>
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
                    background: activeCategory === cat ? 'var(--accent-volt)' : 'var(--bg-panel)',
                    color: activeCategory === cat ? '#0A0A0A' : 'var(--text-muted)',
                    fontWeight: activeCategory === cat ? 700 : 400,
                    border: `1px solid ${activeCategory === cat ? 'transparent' : 'rgba(138,118,0,0.3)'}`,
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
      <section className="py-20 bg-panel/30">
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
                  className="rounded-2xl p-8 flex flex-col justify-between border border-volt-dim/30 bg-panel hover:border-volt transition-all duration-300 group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center bg-void border border-volt-dim/40"
                      >
                        <IconComp size={24} className="text-volt" />
                      </div>
                      <span
                        className="font-mono-data text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-void text-muted border border-volt-dim/20"
                      >
                        {track.category}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl mb-2 text-primary group-hover:text-volt transition-colors">
                      {track.title}
                    </h3>
                    <p className="font-body text-sm text-muted mb-6">{track.tagline}</p>

                    <div className="space-y-2 mb-8 py-4 border-t border-b border-volt-dim/20 font-mono-data text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted">Prize / Value:</span>
                        <span className="text-volt font-semibold">{track.prize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Format:</span>
                        <span className="text-primary">{track.teams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Deadline:</span>
                        <span className="text-volt">{track.deadline}</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-8">
                      {track.highlights.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 font-body text-xs text-primary/80">
                          <CheckCircle2 size={14} className="text-volt shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => { setSelectedTrack(track); setRegistered(false) }}
                    className="w-full py-3.5 rounded-xl font-body font-semibold text-sm btn-ghost justify-center hover:border-volt hover:text-volt"
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
              className="w-full max-w-xl rounded-2xl p-8 bg-panel border border-volt-dim/40 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTrack(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-primary bg-void"
              >
                <X size={18} />
              </button>

              {!registered ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs uppercase tracking-widest text-volt">
                      ⚡ {selectedTrack.category} Track
                    </span>
                    <h3 className="font-display text-4xl text-primary mt-1">{selectedTrack.title}</h3>
                    <p className="font-body text-sm text-muted mt-1">{selectedTrack.tagline}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 rounded-xl bg-void border border-volt-dim/20">
                      <h4 className="font-mono-data text-xs uppercase text-volt mb-2">Key Highlights</h4>
                      <ul className="space-y-2">
                        {selectedTrack.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-primary/90">
                            <span className="text-volt">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-void border border-volt-dim/20">
                      <h4 className="font-mono-data text-xs uppercase text-volt mb-1">Eligibility Criteria</h4>
                      <p className="font-body text-xs text-muted leading-relaxed">{selectedTrack.eligibility}</p>
                    </div>
                  </div>

                  <form onSubmit={handleRegisterTrack} className="space-y-4">
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1">
                        Team Lead Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="team@startup.com"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                      />
                    </div>

                    <button type="submit" className="w-full btn-volt justify-center py-3.5 text-sm mt-4">
                      Submit Track Registration
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-volt/20 border border-volt text-volt flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="font-display text-3xl text-primary mb-2">Registration Submitted!</h3>
                  <p className="font-body text-sm text-muted mb-6">
                    You have successfully applied for <strong>{selectedTrack.title}</strong>. Check your inbox for confirmation details and submission guidelines.
                  </p>
                  <button onClick={() => setSelectedTrack(null)} className="btn-volt px-8 py-3">
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
