'use client'
// components/Concierge/index.tsx
// Floating agentic chat widget — bottom-right, expandable

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAgentResponse, SUGGESTED_STARTERS } from './agent'
import { FEST_CONTEXT } from '@/lib/data'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp: Date
  suggestedReplies?: string[]
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2" aria-label="Concierge is typing" role="status">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,77,61,0.15)', border: '1px solid rgba(255,77,61,0.3)' }}>
        <Bot size={13} style={{ color: 'var(--accent-ignite)' }} />
      </div>
      <div className="chat-bubble-bot px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: 'var(--text-muted)',
                animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={
          isUser
            ? { background: 'rgba(61,217,255,0.15)', border: '1px solid rgba(61,217,255,0.3)' }
            : { background: 'rgba(255,77,61,0.15)', border: '1px solid rgba(255,77,61,0.3)' }
        }
        aria-hidden="true"
      >
        {isUser
          ? <User size={13} style={{ color: 'var(--accent-signal)' }} />
          : <Bot size={13} style={{ color: 'var(--accent-ignite)' }} />
        }
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Simple markdown bold support */}
        {message.text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
          i % 2 === 1
            ? <strong key={i} style={{ color: isUser ? '#fff' : 'var(--text-primary)' }}>{part}</strong>
            : <span key={i}>{part}</span>
        )}
      </div>
    </div>
  )
}

export default function Concierge() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: `Hey! I'm the PEC Summit Concierge. I can answer questions about tracks, speakers, and the schedule — or take you directly to any section. What would you like to know?`,
      timestamp: new Date(),
      suggestedReplies: SUGGESTED_STARTERS.slice(0, 3),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, open])

  // Focus input when opened
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
      }
      setMessages((m) => [...m, botMsg])

      if (response.toast) {
        toast.success(response.toast, {
          style: {
            background: 'var(--bg-panel)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(61,217,255,0.3)',
          },
          iconTheme: { primary: '#3DD9FF', secondary: '#131829' },
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const lastBotMsg = [...messages].reverse().find((m) => m.role === 'bot')

  return (
    <>
      {/* Bounce-keyframe inline */}
      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>

      {/* Floating toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: open ? 'var(--bg-panel)' : 'var(--accent-ignite)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        aria-label={open ? 'Close Concierge chat' : 'Open PEC Summit Concierge'}
        aria-expanded={open}
        aria-haspopup="dialog"
        id="concierge-toggle-btn"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} style={{ color: 'var(--text-primary)' }} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} style={{ color: '#fff' }} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-mono-data text-[10px] font-bold"
            style={{ background: 'var(--accent-signal)', color: '#0B0E1A' }}
            aria-label={`${unread} unread messages`}
          >
            {unread}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="PEC Summit Concierge chat"
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden flex flex-col"
            style={{
              height: '520px',
              background: 'var(--bg-void)',
              border: '1px solid rgba(138,144,166,0.12)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,77,61,0.08)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{
                borderBottom: '1px solid rgba(138,144,166,0.08)',
                background: 'var(--bg-panel)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,77,61,0.15)' }}
                aria-hidden="true"
              >
                <Bot size={18} style={{ color: 'var(--accent-ignite)' }} />
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  Fest Concierge
                </p>
                <p className="font-mono-data text-[10px]" style={{ color: 'var(--accent-signal)' }}>
                  ● Online — PEC Summit
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Minimise chat"
              >
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  <MessageBubble message={msg} />
                  {/* Suggested replies after bot messages */}
                  {msg.role === 'bot' && msg.suggestedReplies && msg.id === messages[messages.length - 1].id && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-9">
                      {msg.suggestedReplies.map((r) => (
                        <button
                          key={r}
                          onClick={() => sendMessage(r)}
                          className="px-3 py-1.5 rounded-full font-body text-xs transition-all duration-150"
                          style={{
                            background: 'rgba(138,144,166,0.08)',
                            color: 'var(--text-muted)',
                            border: '1px solid rgba(138,144,166,0.15)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,77,61,0.4)'
                            e.currentTarget.style.color = 'var(--accent-ignite)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(138,144,166,0.15)'
                            e.currentTarget.style.color = 'var(--text-muted)'
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="shrink-0 px-3 py-3"
              style={{ borderTop: '1px solid rgba(138,144,166,0.08)' }}
            >
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about tracks, speakers, schedule…"
                  className="flex-1 bg-transparent outline-none font-body text-sm placeholder:text-muted/50"
                  style={{
                    color: 'var(--text-primary)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(138,144,166,0.06)',
                    border: '1px solid rgba(138,144,166,0.12)',
                  }}
                  aria-label="Message input"
                  maxLength={400}
                  disabled={isTyping}
                  id="concierge-input"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150"
                  style={{
                    background: input.trim() ? 'var(--accent-ignite)' : 'rgba(138,144,166,0.1)',
                    color: input.trim() ? '#fff' : 'var(--text-muted)',
                  }}
                  aria-label="Send message"
                  id="concierge-send-btn"
                >
                  <Send size={15} />
                </button>
              </form>
              <p className="text-center font-mono-data text-[9px] mt-2" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                Powered by E-Cell PEC · Frontend demo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
