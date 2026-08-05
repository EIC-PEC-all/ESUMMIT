'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import { STATS } from '@/lib/data'
import { Zap, Users, Trophy, Layers } from 'lucide-react'
import CircuitBoard from '../Hero/CircuitBoard'

const STAT_ICONS = [Users, Zap, Trophy, Layers]

function BurstCard({ stat, index, inView }: { stat: typeof STATS[0]; index: number; inView: boolean }) {
  const count = useCountUp(stat.value, 2000, inView)
  const Icon = STAT_ICONS[index % STAT_ICONS.length]

  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <motion.div
      onMouseMove={handleSpotlight}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl p-8 overflow-hidden group flex flex-col justify-between transition-all duration-300 bg-[#070B08]/90 border border-[#7ED321]/20 hover:border-[#7ED321]/60"
      style={{
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      }}
      whileHover={{ y: -6 }}
    >
      {/* Mouse spotlight radial glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(126,211,33,0.15), transparent 40%)',
        }}
      />

      {/* Background accent icon */}
      <div className="absolute -right-4 -bottom-4 opacity-5 text-[#7ED321] group-hover:opacity-15 transition-all duration-300 pointer-events-none">
        <Icon size={120} />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#070B08] border border-[#7ED321]/30 text-[#7ED321] group-hover:scale-110 transition-transform duration-300">
          <Icon size={20} />
        </div>
        <div className="w-2 h-2 rounded-full bg-[#7ED321] animate-pulse" />
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
          <span className="text-[#7ED321]">{stat.suffix}</span>
        </span>
        <span className="font-body text-sm font-semibold text-[#8A9488] uppercase tracking-wider block">
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
      className="py-20 relative overflow-hidden bg-[#111A12] border-t border-b border-[#7ED321]/15"
    >
      {/* Global Circuit board pattern layer */}
      <CircuitBoard prefersReduced={false} />

      {/* Top Divider Line */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <BurstCard key={stat.id} stat={stat} index={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
