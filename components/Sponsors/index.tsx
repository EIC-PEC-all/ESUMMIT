'use client'
// components/Sponsors/index.tsx
// Tiered sponsor grid: Title / Gold / Silver / Media Partners

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { SPONSORS } from '@/lib/data'

type Sponsor = { id: string; name: string; logo: null; url: string }

function SponsorLogo({
  sponsor,
  size,
}: {
  sponsor: Sponsor
  size: 'title' | 'gold' | 'silver' | 'media'
}) {
  const sizeMap = {
    title: { height: '100px', minWidth: '220px', fontSize: '1.1rem', opacity: 0.9 },
    gold: { height: '76px', minWidth: '180px', fontSize: '0.9rem', opacity: 0.75 },
    silver: { height: '60px', minWidth: '140px', fontSize: '0.8rem', opacity: 0.6 },
    media: { height: '52px', minWidth: '120px', fontSize: '0.75rem', opacity: 0.55 },
  }
  const s = sizeMap[size]

  return (
    <motion.a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center rounded-lg px-6 group relative overflow-hidden"
      style={{
        height: s.height,
        minWidth: s.minWidth,
        background: 'rgba(138,144,166,0.05)',
        border: '1px solid rgba(138,144,166,0.1)',
      }}
      whileHover={{
        borderColor: 'rgba(255,77,61,0.25)',
        background: 'rgba(255,77,61,0.04)',
      }}
      transition={{ duration: 0.2 }}
      aria-label={`${sponsor.name} - sponsor`}
    >
      {/* TODO: replace with real <Image> when logos are available */}
      <span
        className="font-body font-semibold tracking-wide transition-opacity group-hover:opacity-90 text-center"
        style={{ color: 'var(--text-muted)', fontSize: s.fontSize, opacity: s.opacity }}
      >
        {sponsor.name}
      </span>
      <ExternalLink
        size={10}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
        aria-hidden="true"
      />
    </motion.a>
  )
}

function TierSection({
  label,
  eyebrow,
  sponsors,
  size,
  delay = 0,
}: {
  label: string
  eyebrow: string
  sponsors: Sponsor[]
  size: 'title' | 'gold' | 'silver' | 'media'
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay }}
      className="mb-14"
    >
      <div className="flex items-center gap-4 mb-6">
        <span
          className="font-mono-data text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-muted)' }}
        >
          {eyebrow}
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(138,144,166,0.1)' }} />
        <span
          className="font-mono-data text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-muted)', opacity: 0.5 }}
        >
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
        {sponsors.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + i * 0.05 }}
          >
            <SponsorLogo sponsor={s} size={size} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Sponsors() {
  return (
    <section
      id="sponsors"
      className="py-24 lg:py-32"
      style={{ background: 'var(--bg-panel)' }}
      aria-labelledby="sponsors-heading"
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="font-mono-data text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: 'var(--accent-ignite)' }}
          >
            Powered By
          </p>
          <h2
            id="sponsors-heading"
            className="font-display leading-none"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
          >
            OUR<br />PARTNERS
          </h2>
        </motion.div>

        <TierSection
          label="Title Sponsor"
          eyebrow="Presenting"
          sponsors={SPONSORS.title}
          size="title"
          delay={0}
        />
        <TierSection
          label="Gold Sponsors"
          eyebrow="Gold"
          sponsors={SPONSORS.gold}
          size="gold"
          delay={0.1}
        />
        <TierSection
          label="Silver Sponsors"
          eyebrow="Silver"
          sponsors={SPONSORS.silver}
          size="silver"
          delay={0.15}
        />
        <TierSection
          label="Media Partners"
          eyebrow="Media"
          sponsors={SPONSORS.media}
          size="media"
          delay={0.2}
        />

        {/* CTA for prospective sponsors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ border: '1px dashed rgba(255,77,61,0.2)', background: 'rgba(255,77,61,0.04)' }}
        >
          <div>
            <p className="font-body font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
              Interested in sponsoring PEC Summit?
            </p>
            <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
              {/* TODO: update with real email */}
              Reach 3,000+ students, founders, and investors. Contact partnerships@ecellpec.in
            </p>
          </div>
          <a
            href="mailto:partnerships@ecellpec.in"
            className="btn-ignite shrink-0"
            id="sponsor-cta-btn"
          >
            Partner With Us
          </a>
        </motion.div>
      </div>
    </section>
  )
}
