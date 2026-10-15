'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { MASTER_SPONSORS } from '@/data/summitData'

export default function PreviousSponsorsGrid() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <div className="mt-6 sm:mt-8">
      <div className="text-center mb-10">
        <h3
          className="font-display font-black uppercase tracking-wider text-white mt-3 mb-2"
          style={{ fontSize: 'clamp(1.35rem, 2.8vw, 2rem)' }}
        >
          ORGANIZATIONS THAT HAVE <span className="text-gradient-mint">BACKED THE JOURNEY</span>
        </h3>
        <p className="font-mono-data text-[11px] text-gray-400 uppercase tracking-widest">
          PREVIOUS CORPORATE, VENTURE &amp; MEDIA SPONSORS
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {MASTER_SPONSORS.map((sp) => {
          const hasError = imageErrors[sp.id]
          const isSvg = sp.logo.endsWith('.svg')

          return (
            <div
              key={sp.id}
              className="flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#0D1C18]/80 border border-white/10 hover:border-mint/50 hover:bg-[#12241F] transition-all duration-300 text-center group shadow-lg hover:shadow-[0_0_20px_rgba(0,245,212,0.18)] hover:-translate-y-1"
            >
              <div className="w-full h-16 sm:h-20 flex items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-mint/20 group-hover:bg-white/[0.06] transition-all duration-300 mb-3 relative overflow-hidden">
                {!hasError && sp.logo ? (
                  isSvg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sp.logo}
                      alt={sp.name}
                      onError={() => handleImageError(sp.id)}
                      className="max-h-10 sm:max-h-12 max-w-[85%] object-contain filter brightness-95 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={sp.logo}
                        alt={sp.name}
                        fill
                        sizes="(max-width: 640px) 140px, (max-width: 1024px) 180px, 200px"
                        onError={() => handleImageError(sp.id)}
                        className="object-contain p-1 filter brightness-95 group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  )
                ) : (
                  <span className="font-display font-black text-sm text-mint tracking-wider">
                    {sp.name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="w-full flex flex-col items-center">
                <span className="font-display font-bold text-xs sm:text-[13px] text-gray-200 group-hover:text-mint transition-colors tracking-wide leading-snug line-clamp-1 mb-1">
                  {sp.name}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono-data text-gray-400 group-hover:text-gray-300 tracking-wider line-clamp-1">
                  {sp.category}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
