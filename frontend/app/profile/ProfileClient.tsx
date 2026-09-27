'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, ArrowLeft, LogOut, CheckCircle2, Download, Sparkles, Edit3, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  RegistrationRecord,
  getUserRegistrations,
  updateRegistrationRecord,
  deleteRegistrationRecord,
} from '@/lib/registrations'
import toast, { Toaster } from 'react-hot-toast'
import NavHeader from '@/components/Nav/NavHeader'
import { useSummitData } from '@/hooks/useSummitData'
import { TOAST_STYLE } from '@/lib/constants'

export default function ProfileClient() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>([])
  const [loading, setLoading] = useState(true)
  
  const [currentBadge, setCurrentBadge] = useState<RegistrationRecord | null>(null)
  const [editingPass, setEditingPass] = useState<RegistrationRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data } = useSummitData()
  const summitDates = data?.siteConfig?.summitDates || 'MARCH 19 - 21'

  const fetchRegistrations = useCallback(async () => {
    if (!user) return
    try {
      const records = await getUserRegistrations(user.uid)
      setMyRegistrations(records)
    } catch (err) {
      console.error('Failed to fetch user registrations', err)
      toast.error('Failed to load your passes.', TOAST_STYLE)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/register')
      return
    }
    fetchRegistrations()
  }, [user, authLoading, router, fetchRegistrations])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleDeletePass = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return
    try {
      await deleteRegistrationRecord(id)
      await fetchRegistrations()
      toast.success('Booking cancelled successfully', TOAST_STYLE)
      if (currentBadge?.id === id) {
        setCurrentBadge(null)
      }
    } catch {
      toast.error('Failed to cancel booking', TOAST_STYLE)
    }
  }


  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex items-center gap-2 text-mint font-mono text-sm uppercase">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          Loading Profile...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void text-white selection:bg-mint/30 flex flex-col relative overflow-hidden font-sans">
      <Toaster position="bottom-center" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-mint/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-mint/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-void/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/esummit-logo.png"
              alt="E-Summit Logo"
              width={140}
              height={40}
              className="h-7 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              href="/register"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              Book Passes
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        
        {/* Profile Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display mb-1">
              Attendee Profile
            </h1>
            <p className="text-sm text-neutral-400">
              Welcome back, <span className="text-white font-bold">{user?.displayName || 'Delegate'}</span>!
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentBadge ? (
            <motion.div
              key="ticket-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentBadge(null)}
                  className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 transition-colors"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Profile</span>
                </button>
              </div>

              {/* Digital E-Badge */}
              <div className="relative rounded-[2rem] overflow-hidden bg-[#0A1611] border border-mint/20 shadow-2xl p-6 sm:p-8 flex flex-col justify-between mb-6">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Image src="/esummit-mark.png" alt="Mark" width={120} height={120} />
                </div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Image src="/esummit-logo.png" alt="Logo" width={100} height={30} className="h-6 w-auto" />
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        {summitDates} • PEC
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-xs font-bold uppercase tracking-wider text-mint">
                    {currentBadge.category}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-4 flex-1">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono mb-1">
                        Attendee Name
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {currentBadge.name}
                      </h3>
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono mb-1">
                        College / Institution
                      </span>
                      <p className="text-sm font-medium text-neutral-300">{currentBadge.college}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono mb-1">
                        Pass ID
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-xs font-bold text-mint">
                        {currentBadge.id}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl shrink-0 flex flex-col items-center">
                    <Image
                      src={currentBadge.qrCodeData}
                      alt="Check-in QR"
                      width={120}
                      height={120}
                      className="w-24 h-24 object-contain mix-blend-multiply"
                      unoptimized
                    />
                    <span className="text-[9px] text-neutral-800 font-bold uppercase mt-1 font-mono tracking-wider">
                      Entry QR
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Link
                  href="/register"
                  className="py-2.5 px-3 rounded-full bg-mint hover:bg-white text-void text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Story Badge</span>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Print Pass</span>
                </button>
                <button
                  onClick={() => setEditingPass(currentBadge)}
                  className="py-2.5 px-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={14} />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => handleDeletePass(currentBadge.id)}
                  className="py-2.5 px-3 rounded-full border border-white/15 bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Cancel Pass</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {myRegistrations.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl p-6 bg-white/[0.01]">
                  <Ticket size={48} className="mx-auto text-neutral-600 mb-4 stroke-1" />
                  <h3 className="text-xl font-bold text-white mb-2 font-display uppercase tracking-wider">No Passes Booked</h3>
                  <p className="text-sm text-neutral-400 mb-6">You haven&apos;t registered for any summit passes yet.</p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint text-void font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    <span>Get Your Pass Now</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myRegistrations.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-white/10 bg-[#13221C] p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-white/20 transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-mint/10 text-mint font-bold uppercase tracking-wider font-mono">
                            {item.category}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500 font-bold">#{item.id.slice(-6)}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-mint transition-colors">{item.name}</h3>
                          <p className="text-xs text-neutral-400 truncate mt-1">{item.college}</p>
                        </div>
                        {item.selectedEvents && item.selectedEvents.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.selectedEvents.map((ev) => (
                              <span
                                key={ev}
                                className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 font-mono uppercase tracking-wider"
                              >
                                {ev}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                        <span className="text-neutral-500 font-mono text-[10px] font-semibold uppercase tracking-wider">
                          {item.paymentStatus === 'PAID' ? `₹${item.amountPaid || 0}` : 'FREE ENTRY'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentBadge(item)}
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                          >
                            View Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Edit Pass Modal */}
      <AnimatePresence>
        {editingPass && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[2rem] border border-white/15 bg-[#13221C] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Edit Pass Details</h3>
                <button
                  type="button"
                  onClick={() => setEditingPass(null)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingPass) return
                  setIsSubmitting(true)
                  try {
                    await updateRegistrationRecord(editingPass.id, {
                      name: editingPass.name,
                      phone: editingPass.phone,
                      college: editingPass.college,
                    })
                    await fetchRegistrations()
                    if (currentBadge?.id === editingPass.id) {
                      setCurrentBadge({ ...currentBadge, ...editingPass })
                    }
                    setEditingPass(null)
                    toast.success('Pass updated successfully!', TOAST_STYLE)
                  } catch {
                    toast.error('Failed to update pass.', TOAST_STYLE)
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingPass.name}
                    onChange={(e) => setEditingPass({ ...editingPass, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1410] px-3.5 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">Phone</label>
                  <input
                    type="tel"
                    value={editingPass.phone || ''}
                    onChange={(e) => setEditingPass({ ...editingPass, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1410] px-3.5 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">College</label>
                  <input
                    type="text"
                    value={editingPass.college}
                    onChange={(e) => setEditingPass({ ...editingPass, college: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0B1410] px-3.5 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-bold text-void hover:bg-white transition-colors disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
