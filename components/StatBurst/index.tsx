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
      className="relative rounded-2xl p-5 sm:p-6 overflow-hidden group flex flex-col justify-between transition-all duration-300 bg-panel border border-border-subtle hover:border-mint/60 shadow-xl"
      whileHover={{ y: -4 }}
    >
      {/* Mouse spotlight radial glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--accent-green-glow), transparent 40%)',
        }}
      />

      {/* Background accent icon */}
      <div className="absolute -right-2 -bottom-2 opacity-5 text-mint group-hover:opacity-15 transition-all duration-300 pointer-events-none">
        <Icon size={70} />
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-mint/10 text-mint group-hover:scale-110 transition-transform duration-300">
          <Icon size={16} />
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
      </div>

      <div className="relative z-10">
        <span
          className="font-mono-data font-bold block leading-none mb-1.5 text-primary"
          style={{
            fontSize: 'clamp(26px, 3.2vw, 42px)',
          }}
        >
          {stat.prefix}
          {count}
          <span className="text-mint">{stat.suffix}</span>
        </span>
        <span className="font-mono-data text-[11px] sm:text-xs font-semibold text-secondary uppercase tracking-widest block">
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
      className="py-20 relative overflow-hidden bg-void"
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
