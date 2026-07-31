'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import { STATS } from '@/lib/data'
import { Zap, Users, Trophy, Layers } from 'lucide-react'

const STAT_ICONS = [Users, Zap, Trophy, Layers]

function BurstCard({ stat, index, inView }: { stat: typeof STATS[0]; index: number; inView: boolean }) {
  const count = useCountUp(stat.value, 2000, inView)
  const Icon = STAT_ICONS[index % STAT_ICONS.length]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 40 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl p-8 overflow-hidden group flex flex-col justify-between"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid rgba(158, 100, 11, 0.25)',
      }}
      whileHover={{ y: -6, borderColor: '#F8A21A', boxShadow: '0 0 24px rgba(248,162,26,0.25)' }}
    >
      {/* Background accent icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5 text-amber group-hover:opacity-15 transition-all duration-300">
        <Icon size={120} />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-void border border-amber-dim/40"
        >
          <Icon size={20} className="text-amber" />
        </div>
        <span className="font-mono-data text-[10px] uppercase tracking-widest text-muted">
          ⚡ #0{index + 1}
        </span>
      </div>

      <div className="relative z-10">
        <span
          className="font-mono-data font-bold block leading-none mb-2"
          style={{
            fontSize: 'clamp(44px, 6vw, 76px)',
            color: 'var(--text-primary)',
          }}
        >
          {stat.prefix}
          {count}
          <span className="text-amber">{stat.suffix}</span>
        </span>
        <span className="font-body text-sm font-semibold text-muted uppercase tracking-wider block">
          {stat.label}
        </span>
      </div>
    </motion.div>
  )
}

export default function StatBurst() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section
      ref={sectionRef}
      className="py-20 relative border-t border-b border-amber-dim/20"
      style={{ background: 'rgba(22, 31, 27, 0.5)' }}
    >
      {/* Current Line Top Divider */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <BurstCard key={stat.id} stat={stat} index={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
