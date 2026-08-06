'use client'
// components/FAQ/index.tsx
// Animated accordion with Money/Fintech theme styling and measured-height smooth transitions

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'
import { FAQS } from '@/lib/data'
import CircuitBoard from '../Hero/CircuitBoard'

function FAQItem({ faq, isOpen, onToggle }: {
  faq: typeof FAQS[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="mb-4 rounded-xl overflow-hidden transition-all duration-300 bg-panel border border-border-subtle"
      style={{
        boxShadow: isOpen ? '0 0 20px var(--accent-green-glow)' : 'none',
      }}
    >
      <button
        id={`faq-btn-${faq.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${faq.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors duration-150 group"
      >
        <span
          className={`font-body font-semibold text-base leading-snug transition-colors ${
            isOpen ? 'text-mint' : 'text-primary group-hover:text-mint'
          }`}
        >
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 bg-void border border-border-subtle"
          aria-hidden="true"
        >
          <ChevronDown size={16} className={isOpen ? 'text-mint' : 'text-muted'} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${faq.id}`}
            role="region"
            aria-labelledby={`faq-btn-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-[var(--accent-mint)]/10">
              <p className="font-body text-sm leading-relaxed text-muted">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id)

  return (
    <section
      id="faq"
      className="py-24 lg:py-32 relative bg-void border-t border-b border-[var(--accent-mint)]/15 overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Circuit pattern overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">

          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2
              id="faq-heading"
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              GOT<br />
              <span className="text-stroke-green">QUESTIONS?</span>
            </h2>
            <p className="font-body text-sm leading-relaxed text-muted">
              If you don&apos;t find your answer here, our Concierge agent (bottom right) can assist — or email us directly at{' '}
              <a href="mailto:info@ecellpec.in" className="text-[var(--accent-mint)] underline underline-offset-4 font-semibold">
                info@ecellpec.in
              </a>
            </p>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {FAQS.map((faq) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
