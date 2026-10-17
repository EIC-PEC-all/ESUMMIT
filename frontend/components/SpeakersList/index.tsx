'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import BlurImage from '@/components/ui/BlurImage'
import PageBanner from '@/components/Common/PageBanner'
import { PillSegmentedTabs, type PillTab } from '@/components/Common/PillSegmentedTabs'

export type SpeakerCategory = 'all' | 'founders' | 'investors' | 'creators'

interface Speaker {
  name: string
  role: string
  image: string
  category: 'founders' | 'investors' | 'creators'
}

const CATEGORIES: PillTab<SpeakerCategory>[] = [
  { id: 'all', label: 'All' },
  { id: 'founders', label: 'Founders & CEOs' },
  { id: 'investors', label: 'Investors & VCs' },
  { id: 'creators', label: 'Creators & Tech Leads' },
]

const PREVIOUS_SPEAKERS: Speaker[] = [
  { name: 'Sandeep Jain', role: 'Founder, GeeksforGeeks', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/1.jpg', category: 'founders' },
  { name: 'Saurabh Munjal', role: 'Co-Founder & CEO, Lahori Zeera', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792025981/esummit/speakers/saurabh_munjal.jpg', category: 'founders' },
  { name: 'Aditi Bhutia Madan', role: 'Founder, Momo Mami (Shark Tank India)', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792025983/esummit/speakers/aditi_madan.jpg', category: 'founders' },
  { name: 'Varun Singla', role: 'Founder, Gate Smashers', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1792025984/esummit/speakers/varun_singla.jpg', category: 'creators' },
  { name: 'Vishal Malhotra', role: 'Actor, KeyNote Speaker', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/2.jpg', category: 'creators' },
  { name: 'Rupinder Singh', role: 'Founder, BioHouse, Mentor & Investor', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/3.jpg', category: 'investors' },
  { name: 'Sourabh Goyal', role: 'Founder, SuccessBrew', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/4.jpg', category: 'founders' },
  { name: 'Mandeep Kaur Tangra', role: 'Founder, SimbaQuartz', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/5.jpg', category: 'founders' },
  { name: 'Aahan Khurma', role: 'Co-Founder & CEO, Wellversed', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/6.jpg', category: 'founders' },
  { name: 'Drishti Kharbanda', role: 'Founder, Bake Cosmetics', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/7.jpg', category: 'founders' },
  { name: 'Aseem Ghavri', role: 'Co-Founder, Third Unicorn', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/8.jpg', category: 'founders' },
  { name: 'Komal Talwar', role: 'Founder, TT Consultants', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/9.jpg', category: 'founders' },
  { name: 'Sarvjeet Singh', role: 'Founder, Finvasia', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/10.jpg', category: 'founders' },
  { name: 'Paresh Gupta', role: 'Founder, CUETPro, GCEC, Brevitty', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/11.jpg', category: 'founders' },
  { name: 'Sharad Sagar', role: 'Founder & CEO, Dexterity Global Group', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/12.jpg', category: 'founders' },
  { name: 'Paritosh Anand', role: 'Founder, WeSmile and Believe Clothing', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/13.jpg', category: 'creators' },
  { name: 'Aditya Arora', role: 'Android Lead at SAP, Mobile Centre of Excellence', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/14.jpg', category: 'creators' },
  { name: 'Nandu Nandkishore', role: 'Former Global CEO, Nestle Nutrition', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/15.jpg', category: 'investors' },
  { name: 'Daksh Sethi', role: 'Founder & CEO, Guby Rogers', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/16.jpg', category: 'creators' },
  { name: 'Hardik Banga', role: 'Co-Founder, Adsworm', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/17.jpg', category: 'creators' },
  { name: 'Rakshit Jain', role: 'Software developer at TCS Digital', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/18.jpg', category: 'creators' },
  { name: 'Kunika Rathore', role: 'Founder, The Unknowns', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/19.jpg', category: 'founders' },
  { name: 'Basundha Shrivastava', role: 'Founder, Empfly Services Pvt Ltd', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/20.jpg', category: 'founders' },
  { name: 'Kailash Nath', role: 'AVP-Seed at Chiratae Ventures', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/21.jpg', category: 'investors' },
]

function SpeakerCard({ person }: { person: Speaker }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="bg-panel border border-border-subtle hover:border-mint/40 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-xl flex flex-col"
    >
      <div className="relative w-full aspect-[4/5] bg-panel-alt overflow-hidden">
        {person.image ? (
          <BlurImage
            src={person.image}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-panel-alt">
            <span className="font-mono-data text-muted text-4xl font-bold uppercase">{person.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Subtle Dark Vignette & Unified Contrast Scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-300 group-hover:via-black/50" />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />

        {/* Content Container with Dedicated Gradient Scrim */}
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 flex flex-col justify-end bg-gradient-to-t from-black via-black/85 to-transparent pt-12 speaker-overlay z-10">
          <h3 className="font-sans font-extrabold text-base sm:text-lg uppercase tracking-wide text-white keep-white line-clamp-1 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {person.name}
          </h3>
          <p className="font-mono-data text-[10px] sm:text-xs uppercase tracking-wider text-[#8AC53F] keep-mint font-bold mt-1 line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {person.role}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default function SpeakersList() {
  const [activeCategory, setActiveCategory] = useState<SpeakerCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSpeakers = useMemo(() => {
    return PREVIOUS_SPEAKERS.filter((speaker) => {
      const matchesCategory =
        activeCategory === 'all' || speaker.category === activeCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        speaker.name.toLowerCase().includes(q) ||
        speaker.role.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <>
      <PageBanner 
        title="SPEAKERS" 
        subtitle="AT E-SUMMIT '26" 
        bgImage="/speakers-banner-bg.jpg"
      />
      <section id="speakers" className="relative min-h-screen bg-section-1 text-primary pt-12 pb-20 sm:pb-24 px-4 sm:px-8 lg:px-12 z-10">

      {/* --- Previous Speakers --- */}
      <div className="max-w-7xl mx-auto w-full mb-24 sm:mb-28">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-primary">
            Previous Speakers
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border-subtle to-transparent" />
        </div>

        {/* Controls: Category Tabs + Search Bar (Rounded-Full Pill Styling) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <PillSegmentedTabs<SpeakerCategory>
            tabs={CATEGORIES}
            activeTab={activeCategory}
            onChange={setActiveCategory}
            layoutId="speakersActiveCategoryIndicator"
            className="shrink-0"
          />

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-72 lg:w-80">
            <div className="relative flex items-center bg-panel-alt border border-border-subtle focus-within:border-mint/50 focus-within:ring-2 focus-within:ring-mint/25 rounded-full px-4 py-2 transition-all">
              <Search size={14} className="text-muted mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search speakers or companies..."
                className="w-full bg-transparent text-xs text-primary placeholder:text-muted font-mono-data focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-muted hover:text-primary ml-2 cursor-pointer p-0.5 rounded-full hover:bg-panel transition-colors"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Speakers Grid or Empty State */}
        {filteredSpeakers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle bg-panel/50 p-12 text-center my-8">
            <p className="text-secondary font-mono-data text-xs sm:text-sm uppercase tracking-wider mb-4">
              No speakers found matching your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all')
                setSearchQuery('')
              }}
              className="px-6 py-2.5 rounded-full btn-dark-gradient border border-border-subtle text-xs font-mono-data font-bold uppercase tracking-wider text-primary transition-colors cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSpeakers.map((speaker, idx) => (
              <SpeakerCard key={speaker.name + idx} person={speaker} />
            ))}
          </div>
        )}
      </div>

      {/* --- E-Summit '26 Speakers (Coming Soon) --- */}
      <div className="max-w-7xl mx-auto w-full mt-16 sm:mt-20 mb-12">
        <div className="rounded-2xl border border-border-panel bg-panel p-8 sm:p-14 text-center flex flex-col items-center justify-center space-y-5">
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-primary">
              E-Summit &apos;26 <span className="text-mint">Speakers</span>
            </h2>
            <p className="text-neutral-400 max-w-md mx-auto font-mono-data text-xs sm:text-sm tracking-wider uppercase">
              Curating a stellar lineup of visionary founders, investors, and industry leaders.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-mint/30 bg-mint/10 text-mint font-mono-data text-xs font-bold uppercase tracking-wider mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            Coming Soon
          </div>
        </div>
      </div>

    </section>
    </>
  )
}

