'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Gem, Crown, Shield, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { StartupPassPackage } from './passesData'

interface PassCardProps {
  pkg: StartupPassPackage
  index: number
  isCenter?: boolean
}

export default function PassCard({ pkg, index, isCenter = false }: PassCardProps) {
  const IconComponent =
    pkg.tier === 'diamond' ? Gem : pkg.tier === 'gold' ? Crown : Shield

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-transform duration-200 ${pkg.accentColor.cardBg} ${pkg.accentColor.border} hover:-translate-y-1`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${pkg.accentColor.iconBg}`}
          >
            <IconComponent size={20} className={pkg.accentColor.iconColor} strokeWidth={2.4} />
          </div>

          <span
            className={`font-mono-data text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 ${pkg.accentColor.badgeBg}`}
          >
            {isCenter && <Sparkles size={11} className="stroke-[2.5]" />}
            {pkg.badgeText}
          </span>
        </div>

        {/* Tier Name on its own row */}
        <h3 className={`font-display text-2xl sm:text-3xl font-black uppercase tracking-tight mb-2 ${pkg.accentColor.titleColor}`}>
          {pkg.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className={`font-display font-black tracking-tight text-4xl sm:text-5xl ${pkg.accentColor.priceColor}`}>
            {pkg.price}
          </span>
          <span className="font-mono-data text-xs text-gray-300 font-bold uppercase tracking-wider">
            {pkg.gstText}
          </span>
        </div>

        {/* Tagline */}
        <p className="font-body text-xs sm:text-sm text-gray-200 leading-relaxed mb-6 min-h-[38px]">
          {pkg.tagline}
        </p>
      </div>

      {/* Action Button (Flat, vibrant, zero glow) */}
      <div className="pt-2">
        <Link
          href={`/register?tier=${pkg.tier}`}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-full font-mono-data text-xs font-black uppercase tracking-wider py-3.5 px-5 transition-transform duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${pkg.accentColor.buttonBg}`}
          aria-label={`Apply for ${pkg.name}`}
        >
          <span>Choose {pkg.name.split(' ')[0]}</span>
          <ArrowRight size={14} className="stroke-[2.5]" />
        </Link>
      </div>
    </motion.div>
  )
}
