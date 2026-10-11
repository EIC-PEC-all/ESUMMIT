'use client'

import React from 'react'
import BlurImage from '@/components/ui/BlurImage'
import { ArrowUpRight } from 'lucide-react'
import type { AlumniMember } from './AlumniDetailModal'

interface AlumniCardProps {
  person: AlumniMember
  onSelect: (person: AlumniMember) => void
}

export default function AlumniCard({ person, onSelect }: AlumniCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(person)}
      className="group relative shrink-0 flex flex-col items-center text-center outline-none cursor-pointer p-4 sm:p-5 rounded-[28px] sm:rounded-[32px] backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/15 hover:border-mint/50 transition-all duration-300 select-none shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.2)]"
      style={{
        width: 'clamp(230px, 70vw, 260px)',
      }}
      aria-label={`View profile details for ${person.name}`}
    >
      {/* Circular Avatar with Clean Glass Rim */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 border border-white/20 group-hover:border-mint/60 transition-colors duration-300 shadow-md">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-white/5">
          <BlurImage
            src={person.imageUrl}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 140px, 160px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Translucent Milestone / Valuation Pill ("nasdaq wali line") */}
      {person.valuation && (
        <span className="mt-3.5 inline-block font-mono-data text-[8.5px] font-bold tracking-wider text-mint uppercase bg-mint/10 border border-mint/25 px-2.5 py-0.5 rounded-full line-clamp-1 max-w-[200px]">
          {person.valuation}
        </span>
      )}

      {/* Name */}
      <h3 className="mt-2 font-display text-base sm:text-lg font-bold uppercase tracking-wider text-white group-hover:text-mint transition-colors line-clamp-1 leading-snug">
        {person.name}
      </h3>

      {/* Year */}
      <p className="mt-1 font-mono-data text-[10px] uppercase tracking-wider text-mint font-bold">
        {person.batch}
      </p>

      {/* Translucent Glass View Story Button */}
      <div className="w-full mt-3.5 py-2 px-3 rounded-xl bg-white/[0.05] group-hover:bg-mint/15 border border-white/10 group-hover:border-mint/40 text-white/80 group-hover:text-mint font-mono-data text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-300">
        <span>VIEW STORY</span>
        <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  )
}
