'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gem, Crown, Shield, ArrowRight, Sparkles, Terminal, GraduationCap, Check } from 'lucide-react'
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
  let IconComponent = Shield
  if (pkg.tier === 'diamond' || pkg.tier === 'combo') {
    IconComponent = Gem
  } else if (pkg.tier === 'gold' || pkg.tier === 'all-access') {
    IconComponent = Crown
  } else if (pkg.tier === 'hackathon') {
    IconComponent = Terminal
  } else if (pkg.tier === 'delegate') {
    IconComponent = GraduationCap
  }

  const isStartup = 'gstText' in pkg
  const passHref = isStartup
    ? `/passes?type=startup&tier=${pkg.tier}#startup-pass-form`
    : `/register?pass=${pkg.id}`

  const hasPopularBadge = isCenter || ('popular' in pkg && pkg.popular)

  const tierGlow =
    pkg.tier === 'silver' || pkg.tier === 'delegate'
      ? 'border-2 border-tier-delegate ring-2 ring-tier-delegate/40 scale-[1.01]'
      : pkg.tier === 'gold' || pkg.tier === 'combo'
      ? 'border-2 border-tier-combo ring-2 ring-tier-combo/40 scale-[1.01]'
      : pkg.tier === 'hackathon'
      ? 'border-2 border-tier-hackathon ring-2 ring-tier-hackathon/40 scale-[1.01]'
      : 'border-2 border-tier-allaccess ring-2 ring-tier-allaccess/40 scale-[1.01]'

  const tierBadge = 'bg-mint text-void'

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
      className={`pass-tier-card relative flex flex-col justify-between h-full rounded-3xl p-5 sm:p-6 md:p-7 transition-all duration-300 bg-panel text-primary shadow-xl ${
        onSelect ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? `${tierGlow}`
          : `${pkg.accentColor.border} hover:-translate-y-1`
      }`}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div
          className={`absolute -top-3.5 left-1/2 -translate-x-1/2 ${tierBadge} font-mono-data text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md flex items-center gap-1.5 z-20`}
        >
          <Check className="w-3 h-3 stroke-[3]" />
          Selected Pass
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-4 h-10">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border shrink-0 ${pkg.accentColor.iconBg}`}
          >
            <IconComponent size={18} className={pkg.accentColor.iconColor} strokeWidth={2.4} />
          </div>

          <span
            className={`font-mono-data text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-md border flex items-center gap-1.5 shrink-0 ${pkg.accentColor.badgeBg}`}
          >
            {hasPopularBadge && <Sparkles size={10} className="stroke-[2.5]" />}
            {pkg.badgeText}
          </span>
        </div>

        {/* Tier Name on its own row with uniform height */}
        <h3 className={`font-display text-xl sm:text-2xl font-black uppercase tracking-tight mb-2 min-h-[52px] sm:min-h-[58px] flex items-center leading-snug ${pkg.accentColor.titleColor}`}>
          {pkg.name}
        </h3>

        {/* Price Row with uniform height */}
        <div className="flex items-baseline gap-2 mb-2 min-h-[46px]">
          <span className={`font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl ${pkg.accentColor.priceColor}`}>
            {pkg.price}
          </span>
          {isStartup && pkg.gstText && (
            <span className="font-mono-data text-xs text-muted font-bold uppercase tracking-wider">
              {pkg.gstText}
            </span>
          )}
        </div>

        {/* Tagline with uniform height */}
        <p className="font-body text-xs text-secondary leading-relaxed mb-5 min-h-[44px] line-clamp-2">
          {pkg.tagline}
        </p>

        {/* Deliverables Bullet List */}
        <div className="space-y-2 mb-6 pt-3.5 border-t border-border-subtle flex-1">
          {pkg.deliverables.slice(0, 4).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-xs leading-tight">
              <span className={`font-mono-data font-bold text-xs mt-0.5 shrink-0 ${pkg.accentColor.deliverablesTitleColor}`}>✓</span>
              <div>
                <span className="font-bold text-primary">{d.title}: </span>
                <span className="text-secondary font-body text-[11px] leading-snug">{d.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button (Rounded-Full Pill Button) */}
      <div className="pt-2 mt-auto">
        {onSelect ? (
          isSelected ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(pkg.id || pkg.tier)
              }}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-transform duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${pkg.accentColor.buttonBg}`}
              aria-label={`Selected ${pkg.name}`}
            >
              <Check size={14} className="stroke-[3]" />
              <span>Selected • View Form ↓</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(pkg.id || pkg.tier)
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-all duration-150 cursor-pointer border border-border-subtle text-secondary hover:border-mint hover:text-mint hover:bg-mint/10 hover:scale-[1.02] active:scale-[0.98]"
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

