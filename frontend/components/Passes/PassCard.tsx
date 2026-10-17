'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import type { StartupPassPackage, StudentPassPackage } from './passesData'

interface PassCardProps {
  pkg: StartupPassPackage | StudentPassPackage
  index: number
  isCenter?: boolean
  isSelected?: boolean
  onSelect?: (tier: string) => void
}

export default function PassCard({
  pkg,
  index,
  isCenter = false,
  isSelected = false,
  onSelect,
}: PassCardProps) {
  const isStartup = 'gstText' in pkg
  const passHref = isStartup
    ? `/passes?type=startup&tier=${pkg.tier}#startup-pass-form`
    : `/register?pass=${pkg.id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      onClick={() => {
        if (onSelect) {
          onSelect(pkg.id || pkg.tier)
        }
      }}
      className={`relative flex flex-col justify-between h-full rounded-3xl p-6 sm:p-7 transition-all duration-300 text-white shadow-xl ${
        pkg.accentColor.cardBg
      } ${
        onSelect ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'ring-4 ring-white ring-offset-2 ring-offset-[#081310] scale-[1.02] shadow-2xl'
          : `${pkg.accentColor.border} hover:-translate-y-1`
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-gray-950 font-mono-data text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 z-20">
          <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
          Selected Pass
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Tier Name */}
        <h3 className={`font-display text-xl sm:text-2xl font-black uppercase tracking-tight mb-2 min-h-[52px] sm:min-h-[58px] flex items-center leading-snug ${pkg.accentColor.titleColor}`}>
          {pkg.name}
        </h3>

        {/* Price Row with uniform height */}
        <div className="flex items-baseline gap-2 mb-2 min-h-[46px]">
          <span className={`font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl ${pkg.accentColor.priceColor}`}>
            {pkg.price}
          </span>
          {isStartup && pkg.gstText && (
            <span className="font-mono-data text-xs text-white/80 font-bold uppercase tracking-wider">
              {pkg.gstText}
            </span>
          )}
        </div>

        {/* Tagline with uniform height */}
        <p className="font-body text-xs text-white/85 leading-relaxed mb-5 min-h-[44px] line-clamp-2">
          {pkg.tagline}
        </p>

        {/* Deliverables Bullet List */}
        <div className="space-y-2.5 mb-6 pt-3.5 border-t border-white/20 flex-1">
          {pkg.deliverables.slice(0, 4).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-xs leading-tight">
              <span className={`font-mono-data font-black text-xs mt-0.5 shrink-0 ${pkg.accentColor.deliverablesTitleColor}`}>✓</span>
              <div>
                <span className="font-bold text-white">{d.title}: </span>
                <span className="text-white/85 font-body text-[11px] leading-snug">{d.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 mt-auto">
        {onSelect ? (
          isSelected ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(pkg.id || pkg.tier)
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-transform duration-150 cursor-pointer bg-white text-gray-950 font-black hover:bg-white/95 shadow-lg active:scale-[0.98]"
              aria-label={`Selected ${pkg.name}`}
            >
              <Check size={14} className="stroke-[3] text-emerald-600" />
              <span>Selected • View Form ↓</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(pkg.id || pkg.tier)
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-all duration-150 cursor-pointer bg-black/25 hover:bg-black/40 border border-white/30 text-white font-black hover:scale-[1.02] active:scale-[0.98]"
              aria-label={`Select ${pkg.name}`}
            >
              <span>Select {pkg.name.replace(' PASS', '')}</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          )
        ) : (
          <Link
            href={passHref}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-transform duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${pkg.accentColor.buttonBg}`}
            aria-label={`Apply for ${pkg.name}`}
          >
            <span>Get {pkg.name.replace(' PASS', '')}</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
