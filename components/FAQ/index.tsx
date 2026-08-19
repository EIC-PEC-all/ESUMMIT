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
      className="mb-4 rounded-2xl overflow-hidden transition-all duration-300 bg-[#07130F] border border-[#193B2F] hover:border-mint/50 shadow-md hover:scale-[1.01]"
    >
      <button
        id={`faq-btn-${faq.id}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${faq.id}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors duration-150 group"
      >
        <span
          className={`font-body font-bold text-base sm:text-lg leading-snug transition-colors ${
            isOpen ? 'text-mint' : 'text-white group-hover:text-mint'
          }`}
        >
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-[#0E241D] border border-[#193B2F]"
          aria-hidden="true"
        >
          <ChevronDown size={18} className={isOpen ? 'text-mint' : 'text-gray-300'} />
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
            <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10">
              <p className="font-body text-sm sm:text-base leading-relaxed text-[#E6EFE0] font-medium">
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
      className="py-24 lg:py-32 relative bg-[#0D1812] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 overflow-hidden border-t border-white/10"
      aria-labelledby="faq-heading"
    >
      <div className="section-container relative z-10">
        {/* Centered Large Section Title */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h2
            id="faq-heading"
            className="font-display font-black uppercase leading-none tracking-tight text-center text-mint mb-4"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 160px)' }}
          >
            FAQ
          </h2>
          <p className="font-body text-sm sm:text-base leading-relaxed text-gray-300 max-w-lg">
            If you don&apos;t find your answer here, our Concierge agent (bottom right) can assist — or email us directly at{' '}
            <a href="mailto:info@ecellpec.in" className="text-mint underline underline-offset-4 font-semibold">
              info@ecellpec.in
            </a>
          </p>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full"
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
