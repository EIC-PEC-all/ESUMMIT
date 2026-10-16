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
      className="alumni-card group relative shrink-0 flex flex-col items-center text-center outline-none cursor-pointer p-4 sm:p-5 rounded-[28px] sm:rounded-[32px] backdrop-blur-xl bg-panel/90 hover:bg-panel border border-border-subtle hover:border-mint transition-all duration-300 select-none shadow-lg hover:-translate-y-1"
      style={{
        width: 'clamp(230px, 70vw, 260px)',
      }}
      aria-label={`View profile details for ${person.name}`}
    >
      {/* Circular Avatar with Clean Glass Rim */}
      <div className="alumni-avatar-rim relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 border border-border-subtle group-hover:border-mint transition-colors duration-300 shadow-md bg-panel-alt">
        <div className="relative w-full h-full rounded-full overflow-hidden bg-panel-alt">
          <BlurImage
            src={person.imageUrl}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 140px, 160px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="alumni-card-name mt-4 font-display text-base sm:text-lg font-bold uppercase tracking-wider text-primary group-hover:text-mint transition-colors line-clamp-1 leading-snug">
        {person.name}
      </h3>

      {/* Year */}
      <p className="mt-1 font-mono-data text-[10.5px] uppercase tracking-wider text-mint font-bold">
        {person.batch}
      </p>

      {/* Translucent Glass Pill View Story Button */}
      <div className="alumni-story-btn w-full mt-4 py-2 px-4 rounded-full bg-panel-alt group-hover:bg-mint/15 border border-border-subtle group-hover:border-mint text-secondary group-hover:text-mint font-mono-data text-[9.5px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all duration-300">
        <span>VIEW STORY</span>
        <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  )
}
