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
      style: { background: '#0D140E', color: '#F5F5F0', border: '1px solid #7ED321' },
      iconTheme: { primary: '#7ED321', secondary: '#070B08' },
    })
  }

  return (
    <main className="min-h-screen bg-[#070B08] text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 border-b border-[#7ED321]/20 overflow-hidden">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-[#8A9488] hover:text-[#7ED321] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7ED321]/15 border border-[#7ED321]/30 mb-6">
              <Sparkles size={14} className="text-[#7ED321]" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-[#7ED321] font-bold">
                E-Summit Help &amp; FAQ Center
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              FREQUENTLY ASKED <br />
              <span className="text-stroke-green">QUESTIONS</span>
            </h1>

            <p className="font-body text-lg text-[#8A9488] max-w-xl leading-relaxed mb-8">
              Everything you need to know about passes, venue, accommodation, competition rules, and registration.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-4 top-4 text-[#8A9488]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions (e.g., tickets, hackathon, venue, hostel)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0D140E] border border-[#7ED321]/30 text-white font-body text-sm outline-none focus:border-[#7ED321]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="py-20 bg-[#111A12]">
        <div className="section-container max-w-4xl">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border transition-all duration-300 overflow-hidden"
                  style={{
                    background: '#0D140E',
                    borderColor: isOpen ? '#7ED321' : 'rgba(126,211,33,0.15)',
                    boxShadow: isOpen ? '0 0 20px rgba(126,211,33,0.2)' : 'none',
                  }}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-body font-medium text-base text-white hover:text-[#7ED321] transition-colors"
                  >
                    <span className={isOpen ? 'text-[#7ED321] font-semibold' : ''}>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: isOpen ? 'rgba(126,211,33,0.2)' : 'rgba(7,11,8,0.8)',
                        border: `1px solid ${isOpen ? '#7ED321' : 'rgba(126,211,33,0.2)'}`,
                      }}
                    >
                      <ChevronDown size={16} className={isOpen ? 'text-[#7ED321]' : 'text-[#8A9488]'} />
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
                        <div className="px-6 pb-6 pt-2 border-t border-[#7ED321]/10">
                          <p className="font-body text-sm text-[#8A9488] leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Ask Unanswered Question Form */}
          <div className="mt-16 p-8 rounded-2xl bg-[#0D140E] border border-[#7ED321]/25">
            <h3 className="font-display text-3xl text-white mb-2">Have an Unanswered Question?</h3>
            <p className="font-body text-sm text-[#8A9488] mb-6">
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
                  className="flex-1 px-4 py-3 rounded-xl bg-[#070B08] border border-[#7ED321]/30 text-white font-body text-sm outline-none focus:border-[#7ED321]"
                />
                <button type="submit" className="btn-green shrink-0 justify-center font-bold">
                  <Send size={16} /> Submit Question
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-[#7ED321]/15 border border-[#7ED321]/30 text-[#7ED321] font-mono-data text-xs font-bold">
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
