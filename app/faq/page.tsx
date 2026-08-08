'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, ArrowLeft, Sparkles, Send } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import { FAQS } from '@/lib/data'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

export default function FAQLandingPage() {
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id)
  const [userQuestion, setUserQuestion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  )

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userQuestion.trim()) return
    setSubmitted(true)
    toast.success('Question submitted! Our team will respond to your email.', {
      style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
      iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-border-subtle overflow-hidden bg-void">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-mint transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]">
              FREQUENTLY ASKED <br />
              <span className="text-mint">QUESTIONS</span>
            </h1>

            <p className="font-body text-lg text-secondary max-w-xl leading-relaxed mb-8">
              Everything you need to know about passes, venue, accommodation, competition rules, and registration.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-4 top-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions (e.g., tickets, hackathon, venue, hostel)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-panel border border-border-subtle text-white font-body text-sm outline-none focus:border-mint"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-20 bg-void">
        <div className="section-container max-w-4xl">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden bg-panel ${
                    isOpen ? 'border-mint shadow-[0_0_20px_rgba(126,211,33,0.2)]' : 'border-border-subtle'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-body font-medium text-base text-white hover:text-[var(--accent-mint)] transition-colors"
                  >
                    <span className={isOpen ? 'text-[var(--accent-mint)] font-semibold' : ''}>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: isOpen ? 'rgba(126,211,33,0.2)' : 'rgba(7,11,8,0.8)',
                        border: `1px solid ${isOpen ? 'var(--accent-mint)' : 'rgba(126,211,33,0.2)'}`,
                      }}
                    >
                      <ChevronDown size={16} className={isOpen ? 'text-[var(--accent-mint)]' : 'text-muted'} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-[var(--accent-mint)]/10">
                          <p className="font-body text-sm text-muted leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Ask Unanswered Question Form */}
          <div className="mt-16 p-8 rounded-2xl bg-panel border border-[var(--accent-mint)]/25">
            <h3 className="font-display text-3xl text-white mb-2">Have an Unanswered Question?</h3>
            <p className="font-body text-sm text-muted mb-6">
              Ask directly or chat with our Fest Concierge agent (bottom right).
            </p>

            {!submitted ? (
              <form onSubmit={handleAskQuestion} className="flex gap-3 flex-col sm:flex-row">
                <input
                  type="text"
                  required
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 px-4 py-3 rounded-xl bg-void border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                />
                <button type="submit" className="btn-green shrink-0 justify-center font-bold">
                  <Send size={16} /> Submit Question
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-[var(--accent-mint)]/15 border border-[var(--accent-mint)]/30 text-[var(--accent-mint)] font-mono-data text-xs font-bold">
                ✓ Question submitted successfully! We&apos;ll notify you when an answer is posted.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <Concierge />
    </main>
  )
}
