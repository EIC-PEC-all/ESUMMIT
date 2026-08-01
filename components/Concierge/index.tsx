'use client'
// components/Concierge/index.tsx
// Floating Agentic Summit Agent + "My Plan" Persistent Itinerary Drawer (Official Logo Theme)

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, ChevronDown, Calendar, Plus, Trash2, Bookmark, Check, Zap } from 'lucide-react'
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
      console.warn('Failed to load My Plan:', e)
    }
  }, [])

  const savePlan = (newPlan: ItinerarySession[]) => {
    setMyPlan(newPlan)
    try {
      localStorage.setItem('pec_summit_my_plan', JSON.stringify(newPlan))
    } catch (e) {
      console.warn('Failed to save My Plan:', e)
    }
  }

  const addToPlan = (session: ItinerarySession) => {
    if (myPlan.some((s) => s.id === session.id)) {
      toast('Session already in My Plan', { icon: 'ℹ️', style: { background: '#161F1B', color: '#F9FAF6' } })
      return
    }
    const updated = [...myPlan, session]
    savePlan(updated)
    toast.success(`Added "${session.title}" to My Plan!`, {
      style: { background: '#161F1B', color: '#F9FAF6', border: '1px solid #FF9900' },
      iconTheme: { primary: '#FF9900', secondary: '#0D1110' },
    })
  }

  const removeFromPlan = (id: string) => {
    const updated = myPlan.filter((s) => s.id !== id)
    savePlan(updated)
    toast('Removed from My Plan', { icon: '🗑️', style: { background: '#161F1B', color: '#F9FAF6' } })
  }

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
      setUnread(0)
    }
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await getAgentResponse(trimmed, FEST_CONTEXT)

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: 'bot',
        text: response.text,
        timestamp: new Date(),
        suggestedReplies: response.suggestedReplies,
        itinerary: response.itinerary,
      }
      setMessages((m) => [...m, botMsg])

      if (response.toast) {
        toast.success(response.toast, {
          style: {
            background: '#161F1B',
            color: '#F9FAF6',
            border: '1px solid #FF9900',
          },
          iconTheme: { primary: '#FF9900', secondary: '#0D1110' },
        })
      }

      if (!open) setUnread((n) => n + 1)
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: 'bot',
          text: 'Something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }, [isTyping, open])

  return (
    <>
      {/* Floating My Plan Drawer Button — Desktop only to prevent mobile overlap */}
      <button
        onClick={() => setPlanOpen(true)}
        className="hidden md:flex fixed top-20 right-6 z-30 px-3.5 py-2 rounded-xl bg-panel border border-orange-dim/40 text-primary font-mono-data text-xs items-center gap-2 shadow-lg hover:border-orange transition-all"
        aria-label="Open My Plan itinerary drawer"
      >
        <Bookmark size={14} className="text-orange fill-orange/20" />
        <span>My Plan</span>
        <span className="w-5 h-5 rounded-full bg-orange text-black font-bold text-[10px] flex items-center justify-center">
          {myPlan.length}
        </span>
      </button>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: open ? '#161F1B' : '#FF9900',
          border: '1px solid rgba(255,153,0,0.4)',
          color: open ? '#F9FAF6' : '#0D1110',
        }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close Summit Agent' : 'Open Summit Agent'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <X size={22} />
          ) : (
            <MessageCircle size={22} />
          )}
        </AnimatePresence>
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange text-black font-mono-data text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </motion.button>

      {/* Chat Widget Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden flex flex-col shadow-2xl bg-void border border-orange-dim/40"
            style={{ height: '540px' }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0 bg-panel border-b border-orange-dim/30">
              <div className="w-9 h-9 rounded-xl bg-orange/20 border border-orange/40 flex items-center justify-center">
                <Bot size={18} className="text-orange" />
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm text-primary flex items-center gap-1.5">
                  Summit Agent <Zap size={12} className="text-orange fill-orange" />
                </p>
                <p className="font-mono-data text-[10px] text-orange font-bold">⚡ Official E-Cell Assistant</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-muted hover:text-primary">
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Messages Log */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-body text-sm">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: msg.role === 'user' ? 'rgba(30,70,55,0.5)' : 'rgba(255,153,0,0.2)',
                        border: `1px solid ${msg.role === 'user' ? '#1E4637' : '#FF9900'}`,
                      }}
                    >
                      {msg.role === 'user' ? <User size={13} className="text-orange" /> : <Bot size={13} className="text-orange" />}
                    </div>

                    <div
                      className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-orange text-black font-semibold rounded-br-none'
                          : 'bg-panel border-l-4 border-l-orange border-t border-r border-b border-orange-dim/30 text-primary rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Render Inline Itinerary Card */}
                  {msg.itinerary && (
                    <div className="mt-3 ml-9 w-[85%] rounded-xl p-4 bg-panel border border-orange/50 shadow-lg space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono-data text-orange uppercase font-bold">
                        <Calendar size={14} />
                        <span>{msg.itinerary.title}</span>
                      </div>
                      <div className="space-y-2">
                        {msg.itinerary.sessions.map((session) => {
                          const isInPlan = myPlan.some((s) => s.id === session.id)
                          return (
                            <div
                              key={session.id}
                              className="p-2.5 rounded-lg bg-void border border-orange-dim/30 flex items-center justify-between gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-mono-data text-[10px] text-muted">
                                  [{session.day}] {session.time}
                                </p>
                                <p className="font-body text-xs font-semibold text-primary truncate">{session.title}</p>
                              </div>
                              <button
                                onClick={() => addToPlan(session)}
                                className={`px-2 py-1 rounded text-[10px] font-mono-data shrink-0 flex items-center gap-1 transition-all ${
                                  isInPlan
                                    ? 'bg-orange/20 text-orange border border-orange/40'
                                    : 'bg-orange text-black font-bold hover:bg-orange/90'
                                }`}
                              >
                                {isInPlan ? <Check size={10} /> : <Plus size={10} />}
                                <span>{isInPlan ? 'Added' : 'Add'}</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suggested Quick Replies */}
                  {msg.role === 'bot' && msg.suggestedReplies && msg.id === messages[messages.length - 1].id && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-9">
                      {msg.suggestedReplies.map((r) => (
                        <button
                          key={r}
                          onClick={() => sendMessage(r)}
                          className="px-3 py-1 rounded-full text-xs font-mono-data bg-panel border border-orange-dim/40 text-muted hover:border-orange hover:text-orange transition-all"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <p className="text-xs font-mono-data text-orange ml-9">Agent is planning...</p>}
              <div ref={bottomRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-panel border-t border-orange-dim/30">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about tracks, speakers, or build an itinerary..."
                  className="flex-1 bg-void border border-orange-dim/40 rounded-lg px-3 py-2 text-sm text-primary placeholder:text-muted/60 outline-none focus:border-orange font-body"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-lg bg-orange text-black flex items-center justify-center disabled:opacity-40"
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
              className="w-full max-w-md bg-panel border-l border-orange-dim/40 h-full flex flex-col p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-orange-dim/30 mb-6">
                <div className="flex items-center gap-2">
                  <Bookmark size={18} className="text-orange fill-orange/20" />
                  <h3 className="font-display text-2xl text-primary">My Personal Itinerary</h3>
                </div>
                <button onClick={() => setPlanOpen(false)} className="p-2 rounded-lg text-muted hover:text-primary">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {myPlan.length === 0 ? (
                  <div className="py-16 text-center text-muted font-body text-sm">
                    <Calendar size={36} className="mx-auto mb-3 opacity-30 text-orange" />
                    <p>Your plan is empty.</p>
                    <p className="text-xs text-muted/70 mt-1">Ask Summit Agent in chat to build a custom itinerary for you!</p>
                  </div>
                ) : (
                  myPlan.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-void border border-orange-dim/30 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono-data text-[10px] uppercase text-orange block mb-1 font-bold">
                          [{session.day}] {session.time}
                        </span>
                        <h4 className="font-body font-semibold text-sm text-primary mb-1">{session.title}</h4>
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
                <div className="pt-4 border-t border-orange-dim/30 mt-4 flex justify-between items-center">
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
