'use client'
// components/Concierge/index.tsx
// Floating Agentic Summit Agent + "My Plan" Persistent Itinerary Drawer (Money/Fintech Green Theme)

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, TrendingUp, ChevronDown, Calendar, Plus, Trash2, Bookmark, Check, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAgentResponse, SUGGESTED_STARTERS, type ItinerarySession } from './agent'
import { FEST_CONTEXT } from '@/lib/data'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp: Date
  suggestedReplies?: string[]
  itinerary?: {
    title: string
    sessions: ItinerarySession[]
  }
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-mint">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return part
      })}
    </span>
  )
}

export default function Concierge() {
  const [open, setOpen] = useState(false)
  const [planOpen, setPlanOpen] = useState(false)
  const [myPlan, setMyPlan] = useState<ItinerarySession[]>([])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: `Hey! I'm the Summit Agent. I can answer questions, scroll to sections, or **generate a personalized itinerary** for you. Ask me "Build my Day 1 plan" or "Recommend AI sessions"!`,
      timestamp: new Date(),
      suggestedReplies: SUGGESTED_STARTERS.slice(0, 3),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pec_summit_my_plan')
      if (saved) setMyPlan(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    const handleOpenPlan = () => {
      setPlanOpen(true)
    }
    const handleOpenConcierge = () => {
      setOpen(true)
      setPlanOpen(true)
    }

    window.addEventListener('open-my-plan', handleOpenPlan)
    window.addEventListener('open-concierge', handleOpenConcierge)
    return () => {
      window.removeEventListener('open-my-plan', handleOpenPlan)
      window.removeEventListener('open-concierge', handleOpenConcierge)
    }
  }, [])

  const savePlan = useCallback((newPlan: ItinerarySession[]) => {
    setMyPlan(newPlan)
    try {
      localStorage.setItem('pec_summit_my_plan', JSON.stringify(newPlan))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const addToPlan = (session: ItinerarySession) => {
    if (myPlan.some((s) => s.id === session.id)) return
    const updated = [...myPlan, session]
    savePlan(updated)
    toast.success(`Added "${session.title}" to My Plan!`)
  }

  const removeFromPlan = (sessionId: string) => {
    const updated = myPlan.filter((s) => s.id !== sessionId)
    savePlan(updated)
    toast.success('Removed session from My Plan.')
  }

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const res = await getAgentResponse(userText, FEST_CONTEXT)
      setIsTyping(false)

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: res.text,
        timestamp: new Date(),
        suggestedReplies: res.suggestedReplies,
        itinerary: res.itinerary,
      }

      setMessages((prev) => [...prev, botMsg])
      if (!open) setUnread((u) => u + 1)
    } catch (err) {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'bot',
          text: 'Apologies, I encountered a temporary connection issue. How else can I assist with E-Summit 2026?',
          timestamp: new Date(),
        },
      ])
    }
  }

  return (
    <>
      {/* Floating Concierge Action Pill */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-14 right-6 z-[2500] px-4 py-3 rounded-full bg-mint text-void font-mono-data text-xs font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Summit AI Concierge Assistant"
      >
        <Bot size={18} />
        <span className="hidden sm:inline">Ask AI Agent</span>
        {!open && (
          <motion.span
            className="w-2 h-2 rounded-full bg-void"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-4 sm:right-8 left-auto z-[2500] w-[390px] max-w-[calc(100vw-32px)] rounded-3xl overflow-hidden flex flex-col shadow-2xl bg-[#0A1A17]/95 [.light_&]:bg-[#1E2B12]/95 backdrop-blur-2xl border border-mint/40"
            style={{ height: '560px' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 shrink-0 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-2xl bg-mint/20 border border-mint/40 flex items-center justify-center">
                  <Bot size={18} className="text-mint" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                    Summit AI Assistant
                  </p>
                  <p className="font-mono-data text-[10px] text-mint font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
                    <span>Official E-Cell Assistant</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {myPlan.length > 0 && (
                  <button
                    onClick={() => setPlanOpen(true)}
                    className="px-2.5 py-1 rounded-xl bg-mint/20 text-mint border border-mint/30 font-mono-data text-[10px] font-bold flex items-center gap-1 hover:bg-mint hover:text-void transition-all"
                  >
                    <Bookmark size={11} />
                    <span>Plan ({myPlan.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close Assistant"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Messages Log */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-body text-sm scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'user' ? (
                      <div className="w-7 h-7 rounded-full bg-mint/20 border border-mint flex items-center justify-center shrink-0">
                        <TrendingUp size={13} className="text-mint" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                        <Bot size={13} className="text-mint" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                        msg.role === 'user'
                          ? 'bg-mint text-void font-bold rounded-br-none shadow-md'
                          : 'bg-white/10 border border-white/15 text-white rounded-bl-none shadow-md backdrop-blur-md'
                      }`}
                    >
                      <FormattedText text={msg.text} />
                    </div>
                  </div>

                  {/* Render Inline Itinerary Card */}
                  {msg.itinerary && (
                    <div className="mt-3 ml-8 w-[88%] rounded-2xl p-4 bg-white/5 border border-mint/40 shadow-xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono-data text-mint uppercase font-bold">
                        <Calendar size={14} />
                        <span>{msg.itinerary.title}</span>
                      </div>
                      <div className="space-y-2">
                        {msg.itinerary.sessions.map((session) => {
                          const isInPlan = myPlan.some((s) => s.id === session.id)
                          return (
                            <div
                              key={session.id}
                              className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-mono-data text-[10px] text-mint font-bold">
                                  [{session.day}] {session.time}
                                </p>
                                <p className="font-body text-xs font-bold text-white truncate">{session.title}</p>
                              </div>
                              <button
                                onClick={() => addToPlan(session)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-data shrink-0 flex items-center gap-1 transition-all ${
                                  isInPlan
                                    ? 'bg-mint/20 text-mint border border-mint/40'
                                    : 'bg-mint text-void font-bold hover:opacity-90'
                                }`}
                              >
                                {isInPlan ? <Check size={10} /> : <Plus size={10} />}
                                <span>{isInPlan ? 'Saved' : 'Add'}</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suggested Quick Replies */}
                  {msg.role === 'bot' && msg.suggestedReplies && msg.id === messages[messages.length - 1].id && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-8">
                      {msg.suggestedReplies.map((r) => (
                        <button
                          key={r}
                          onClick={() => sendMessage(r)}
                          className="px-3.5 py-1.5 rounded-full text-xs font-mono-data bg-white/10 hover:bg-mint hover:text-void text-white border border-white/20 transition-all font-semibold shadow-sm cursor-pointer"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <p className="text-xs font-mono-data text-mint ml-8 animate-pulse">Agent is thinking...</p>}
              <div ref={bottomRef} />
            </div>

            {/* Input Form Container */}
            <div className="p-3 bg-white/5 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  sendMessage(input)
                }}
                className="flex items-center gap-2 bg-black/40 border border-white/20 focus-within:border-mint rounded-2xl p-1.5 transition-all"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about schedule, tracks, or plan..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-white placeholder:text-gray-400 outline-none font-body"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl bg-mint text-void font-bold flex items-center justify-center disabled:opacity-30 hover:scale-105 transition-all shrink-0 cursor-pointer"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent "My Plan" Itinerary Drawer */}
      <AnimatePresence>
        {planOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-void/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-panel border-l border-[var(--accent-mint)]/40 h-full flex flex-col p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--accent-mint)]/30 mb-6">
                <div className="flex items-center gap-2">
                  <Bookmark size={18} className="text-[var(--accent-mint)] fill-[var(--accent-mint)]/20" />
                  <h3 className="font-display text-2xl text-white">My Personal Itinerary</h3>
                </div>
                <button onClick={() => setPlanOpen(false)} className="p-2 rounded-lg text-muted hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {myPlan.length === 0 ? (
                  <div className="py-16 text-center text-muted font-body text-sm">
                    <Calendar size={36} className="mx-auto mb-3 opacity-30 text-[var(--accent-mint)]" />
                    <p>Your plan is empty.</p>
                    <p className="text-xs text-muted/70 mt-1">Ask Summit Agent in chat to build a custom itinerary for you!</p>
                  </div>
                ) : (
                  myPlan.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-void border border-[var(--accent-mint)]/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono-data text-[10px] uppercase text-[var(--accent-mint)] block mb-1 font-bold">
                          [{session.day}] {session.time}
                        </span>
                        <h4 className="font-body font-semibold text-sm text-white mb-1">{session.title}</h4>
                        <span className="font-mono-data text-[9px] uppercase px-2 py-0.5 rounded bg-panel text-muted">
                          {session.type}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromPlan(session.id)}
                        className="p-2 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {myPlan.length > 0 && (
                <div className="pt-4 border-t border-[var(--accent-mint)]/30 mt-4 flex justify-between items-center">
                  <span className="font-mono-data text-xs text-muted">{myPlan.length} Saved Sessions</span>
                  <button
                    onClick={() => savePlan([])}
                    className="font-mono-data text-xs text-red-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
