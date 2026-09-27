'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Linkedin, Sparkles } from 'lucide-react'
import BlurImage from '@/components/ui/BlurImage'
import PageBanner from '@/components/Common/PageBanner'

const PREVIOUS_SPEAKERS = [
  { name: 'Sandeep Jain', role: 'Founder, GeeksforGeeks', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/1.jpg' },
  { name: 'Vishal Malhotra', role: 'Actor, KeyNote Speaker', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/2.jpg' },
  { name: 'Rupinder Singh', role: 'Founder, BioHouse, Public Speaker, Mentor & Investor', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/3.jpg' },
  { name: 'Sourabh Goyal', role: 'Founder, SuccessBrew', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/4.jpg' },
  { name: 'Mandeep Kaur Tangra', role: 'Founder, SimbaQuartz', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/5.jpg' },
  { name: 'Aanan Khurma', role: 'Co-Founder & CEO, WellVersed', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/6.jpg' },
  { name: 'Drishti Kharbanda', role: 'Founder, Bake Cosmetics', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/7.jpg' },
  { name: 'Aseem Ghavri', role: 'Co Founder,Third Unicorn', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/8.jpg' },
  { name: 'Komal Talwar', role: 'Founder, TT Consultants', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/9.jpg' },
  { name: 'Sarvjeet Singh', role: 'Founder, Finvasia', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/10.jpg' },
  { name: 'Paresh Gupta', role: 'Founder, CUETPro, GCEC, Brevitty', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/11.jpg' },
  { name: 'Sharad Sagar', role: 'Founder & CEO, Dexterity Global Group', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/12.jpg' },
  { name: 'Paritosh Anand', role: 'Founder, WeSmile and Believe Clothing', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/13.jpg' },
  { name: 'Aditya Arora', role: 'Android Lead at SAP, Mobile Centre of Excellence', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/14.jpg' },
  { name: 'Nandu Nandkishore', role: 'Former Global CEO, Nestle Nutrition', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/15.jpg' },
  { name: 'Daksh Sethi', role: 'Founder & CEO, Guby Rogers', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/16.jpg' },
  { name: 'Hardik Banga', role: 'Co-Founder, Adsworm', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/17.jpg' },
  { name: 'Rakshit Jain', role: 'Software developer at TCS Digital', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/18.jpg' },
  { name: 'Kunika Rathore', role: 'Founder, The Unknowns', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/19.jpg' },
  { name: 'Basundha Shrivastava', role: 'Founder, Empfly Services Pvt Ltd', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/20.jpg' },
  { name: 'Kailash Nath', role: 'AVP-Seed at Chiratae Ventures', image: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1/esummit/speakers/21.jpg' },
]

function SpeakerCard({ person }: { person: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="bg-[#0B1512] border border-white/10 hover:border-mint/40 rounded-2xl overflow-hidden transition-colors duration-300 group"
    >
      <div className="relative w-full aspect-[4/5] bg-[#070E0C] overflow-hidden">
        {person.image ? (
          <BlurImage
            src={person.image}
            alt={person.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <span className="font-mono-data text-white/20 text-4xl font-bold uppercase">{person.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 flex flex-col justify-end">
          <h3 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wider text-white line-clamp-1 leading-snug">
            {person.name}
          </h3>
          <p className="font-mono-data text-[10px] sm:text-xs uppercase tracking-wider text-mint font-semibold mt-1 line-clamp-2">
            {person.role}
          </p>
        </div>
      </div>
    </motion.div>
  )
}


export default function SpeakersList() {
  return (
    <>
      <PageBanner 
        title="SPEAKERS" 
        subtitle="AT E-SUMMIT '26" 
      />
      <section id="speakers" className="relative min-h-screen bg-section-1 text-white pt-12 pb-20 sm:pb-24 px-4 sm:px-8 lg:px-12 z-10">

      {/* --- Previous Speakers --- */}
      <div className="max-w-7xl mx-auto w-full mb-24 sm:mb-28">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white">
            Previous Speakers
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {PREVIOUS_SPEAKERS.map((speaker, idx) => (
            <SpeakerCard key={idx} person={speaker} />
          ))}
        </div>
      </div>

      {/* --- E-Summit '26 Speakers (Coming Soon) --- */}
      <div className="max-w-7xl mx-auto w-full mt-16 sm:mt-20 mb-12">
        <div className="rounded-2xl border border-white/10 bg-[#0B1512] p-8 sm:p-14 text-center flex flex-col items-center justify-center space-y-5">
          <Sparkles className="text-mint w-8 h-8 opacity-80" />
          
          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-white">
              E-Summit '26 <span className="text-mint">Speakers</span>
            </h2>
            <p className="text-neutral-400 max-w-md mx-auto font-mono-data text-xs sm:text-sm tracking-wider uppercase">
              Curating a stellar lineup of visionary founders, investors, and industry leaders.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-mint/30 bg-mint/10 text-mint font-mono-data text-xs font-bold uppercase tracking-wider mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint" />
            Coming Soon
          </div>
        </div>
      </div>

    </section>
    </>
  )
}
