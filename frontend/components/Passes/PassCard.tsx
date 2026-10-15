'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gem, Crown, Shield, ArrowRight, Sparkles, Terminal, GraduationCap, Award } from 'lucide-react'
import Link from 'next/link'
import type { StartupPassPackage, StudentPassPackage } from './passesData'

interface PassCardProps {
  pkg: StartupPassPackage | StudentPassPackage
  index: number
  isCenter?: boolean
}

export default function PassCard({ pkg, index, isCenter = false }: PassCardProps) {
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
    ? `/passes?tier=${pkg.tier}`
    : `/register?pass=${pkg.id}`

  const hasPopularBadge = isCenter || ('popular' in pkg && pkg.popular)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`relative flex flex-col justify-between h-full rounded-3xl p-5 sm:p-6 md:p-7 transition-transform duration-200 ${pkg.accentColor.cardBg} ${pkg.accentColor.border} hover:-translate-y-1`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-4 h-10">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center border shrink-0 ${pkg.accentColor.iconBg}`}
          >
            <IconComponent size={18} className={pkg.accentColor.iconColor} strokeWidth={2.4} />
          </div>

          <span
            className={`font-mono-data text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${pkg.accentColor.badgeBg}`}
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
            <span className="font-mono-data text-xs text-gray-300 font-bold uppercase tracking-wider">
              {pkg.gstText}
            </span>
          )}
        </div>

        {/* Tagline with uniform height */}
        <p className="font-body text-xs text-gray-200 leading-relaxed mb-5 min-h-[44px] line-clamp-2">
          {pkg.tagline}
        </p>

        {/* Deliverables Bullet List (all 4 items displayed consistently) */}
        <div className="space-y-2 mb-6 pt-3.5 border-t border-white/10 flex-1">
          {pkg.deliverables.slice(0, 4).map((d, i) => (
            <div key={i} className="flex items-start gap-2 text-xs leading-tight">
              <span className={`font-mono-data font-bold text-xs mt-0.5 shrink-0 ${pkg.accentColor.deliverablesTitleColor}`}>✓</span>
              <div>
                <span className="font-bold text-white/95">{d.title}: </span>
                <span className="text-gray-300 font-body text-[11px] leading-snug">{d.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 mt-auto">
        <Link
          href={passHref}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-transform duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${pkg.accentColor.buttonBg}`}
          aria-label={`Apply for ${pkg.name}`}
        >
          <span>Get {pkg.name.replace(' PASS', '')}</span>
          <ArrowRight size={14} className="stroke-[2.5]" />
        </Link>
      </div>
    </motion.div>
  )
}

