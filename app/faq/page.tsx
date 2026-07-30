'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, Search, HelpCircle, Mail, ArrowLeft, Sparkles, Send } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
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
      style: { background: 'var(--bg-panel)', color: 'var(--text-primary)' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[#8A90A6]/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#3DD9FF_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-signal transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 mb-6">
              <Sparkles size={14} className="text-signal" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-signal">
                E-Summit Help &amp; FAQ Center
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              FREQUENTLY ASKED <br />
              <span style={{ color: 'var(--accent-ignite)' }}>QUESTIONS</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
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
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-panel border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-20 bg-panel/30">
        <div className="section-container max-w-4xl">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-[#8A90A6]/12 bg-panel overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-body font-medium text-base text-primary hover:text-signal transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: isOpen ? 'rgba(255,77,61,0.15)' : 'rgba(138,144,166,0.08)',
                        border: `1px solid ${isOpen ? 'rgba(255,77,61,0.3)' : 'rgba(138,144,166,0.12)'}`,
                      }}
                    >
                      {isOpen ? <Minus size={14} className="text-ignite" /> : <Plus size={14} className="text-muted" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-[#8A90A6]/10">
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
          <div className="mt-16 p-8 rounded-2xl bg-panel border border-[#8A90A6]/15">
            <h3 className="font-display text-3xl text-primary mb-2">Have an Unanswered Question?</h3>
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
                  className="flex-1 px-4 py-3 rounded-xl bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-ignite"
                />
                <button type="submit" className="btn-ignite shrink-0 justify-center">
                  <Send size={16} /> Submit Question
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-signal/10 border border-signal/30 text-signal font-mono-data text-xs">
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
