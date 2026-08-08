'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import { STATS } from '@/lib/data'
import { Zap, Users, Trophy, Layers } from 'lucide-react'
import CircuitBoard from '../Hero/CircuitBoard'

const STAT_ICONS = [Users, Zap, Trophy, Layers]

function BurstCard({
  stat,
  index,
  inView,
}: {
  stat: (typeof STATS)[0]
  index: number
  inView: boolean
}) {
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
      className="hover:border-mint/60 group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-panel p-5 shadow-xl transition-all duration-300 sm:p-6"
      whileHover={{ y: -4 }}
    >
      {/* Mouse spotlight radial glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(250px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--accent-green-glow), transparent 40%)',
        }}
      />

      {/* Background accent icon */}
      <div className="pointer-events-none absolute -bottom-2 -right-2 text-mint opacity-5 transition-all duration-300 group-hover:opacity-15">
        <Icon size={70} />
      </div>

      <div className="relative z-10 mb-4 flex items-center justify-between">
        <div className="bg-mint/10 flex h-8 w-8 items-center justify-center rounded-lg text-mint transition-transform duration-300 group-hover:scale-110">
          <Icon size={16} />
        </div>
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
      </div>

      <div className="relative z-10">
        <span
          className="mb-1.5 block font-mono-data font-bold leading-none text-primary"
          style={{
            fontSize: 'clamp(26px, 3.2vw, 42px)',
          }}
        >
          {stat.prefix}
          {count}
          <span className="text-mint">{stat.suffix}</span>
        </span>
        <span className="block font-mono-data text-[11px] font-semibold uppercase tracking-widest text-secondary sm:text-xs">
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
    <section ref={sectionRef} className="relative overflow-hidden bg-void py-20">
      {/* Global Circuit board pattern layer */}
      <CircuitBoard prefersReduced={false} />

      {/* Top Divider Line */}
      <div className="current-line-horizontal pointer-events-none absolute left-0 right-0 top-0" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, idx) => (
            <BurstCard key={stat.id} stat={stat} index={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
