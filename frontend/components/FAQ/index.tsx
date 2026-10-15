'use client'
// components/FAQ/index.tsx
// Animated accordion with Money/Fintech theme styling and measured-height smooth transitions

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Zap } from 'lucide-react'
import { FAQS as STATIC_FAQS } from '@/lib/data'
import { useFaqs } from '@/hooks/useSummitData'

type FaqItem = { id: string; question: string; answer: string }

function FAQItem({ faq, isOpen, onToggle }: {
  faq: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className="mb-4 rounded-2xl overflow-hidden transition-colors duration-300 bg-white/[0.03] border border-white/10 hover:border-white/[0.18]"
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

import PageBanner from '@/components/Common/PageBanner'

export default function FAQ({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const { faqs: cmsFaqs } = useFaqs()
  const faqs: FaqItem[] = Array.isArray(cmsFaqs) && cmsFaqs.length > 0 ? cmsFaqs : STATIC_FAQS

  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <>
      {isStandalonePage && (
        <PageBanner 
          title="FAQ" 
          subtitle="Frequently Asked Questions"
        />
      )}
      <section
        id="faq"
        className={`relative z-10 overflow-hidden bg-[#081310] text-white ${
          isStandalonePage
            ? 'pt-12 pb-20 sm:pb-24'
            : '-mt-10 sm:-mt-12 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] border-t border-mint/20 py-16 sm:py-20 md:py-24'
        }`}
        aria-labelledby="faq-heading"
      >
        {/* Background Ambience Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-mint/15 blur-[120px] rounded-full" />
        </div>

        <div className="section-container relative z-10">
          {!isStandalonePage ? (
            <div className="mb-10 lg:mb-14 text-center max-w-3xl mx-auto">
              <span className="font-mono-data text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-mint flex items-center justify-center gap-2 mb-2">
                <Zap size={14} />
                COMMON INQUIRIES
              </span>
              <h2 id="faq-heading" className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
                FREQUENTLY ASKED <span className="text-gradient-mint">QUESTIONS</span>
              </h2>
              <p className="font-body text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed max-w-xl mx-auto">
                Everything you need to know about passes, registration, campus venue, and logistics.
              </p>
            </div>
          ) : (
            <div className="mb-12 flex flex-col items-center justify-center text-center">
              <p className="font-body text-sm sm:text-base leading-relaxed text-gray-300 max-w-lg">
                If you don&apos;t find your answer here, our Concierge agent (bottom right) can assist — or email us directly at{' '}
                <a href="mailto:info@ecellpec.in" className="text-mint underline underline-offset-4 font-semibold">
                  info@ecellpec.in
                </a>
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full"
            >
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                />
              ))}
            </motion.div>

            {/* Bottom Support Note */}
            <div className="mt-8 text-center">
              <p className="font-body text-xs sm:text-sm text-gray-400">
                Still have questions? Chat with our AI Concierge at the bottom-right or email{' '}
                <a href="mailto:eicpec@pec.edu.in" className="text-mint underline underline-offset-4 font-semibold hover:text-white transition-colors">
                  eicpec@pec.edu.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
