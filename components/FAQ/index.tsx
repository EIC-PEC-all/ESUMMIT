'use client'
// components/FAQ/index.tsx
// Animated accordion — one open at a time

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { FAQS } from '@/lib/data'

function FAQItem({ faq, isOpen, onToggle }: {
  faq: typeof FAQS[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="border-b"
      style={{ borderColor: 'rgba(138,144,166,0.08)' }}
    >
      <button
        id={`faq-btn-${faq.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${faq.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors duration-150 group"
        style={{ color: isOpen ? 'var(--text-primary)' : 'var(--text-muted)' }}
      >
        <span className="font-body font-medium text-base leading-snug group-hover:text-primary transition-colors">
          {faq.question}
        </span>
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isOpen ? 'rgba(255,77,61,0.15)' : 'rgba(138,144,166,0.08)',
            border: `1px solid ${isOpen ? 'rgba(255,77,61,0.3)' : 'rgba(138,144,166,0.12)'}`,
          }}
          aria-hidden="true"
        >
          {isOpen
            ? <Minus size={13} style={{ color: 'var(--accent-ignite)' }} />
            : <Plus size={13} style={{ color: 'var(--text-muted)' }} />
          }
        </span>
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
            <div className="pb-5 pr-12">
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
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
      className="py-24 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="section-container">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">

          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="font-mono-data text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--accent-signal)' }}
            >
              Common Questions
            </p>
            <h2
              id="faq-heading"
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              GOT<br />QUESTIONS?
            </h2>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              If you don&apos;t find your answer here, the Fest Concierge (bottom right) can help — or email us at{' '}
              {/* TODO: confirm email */}
              <a href="mailto:info@ecellpec.in" style={{ color: 'var(--accent-signal)' }}>
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
