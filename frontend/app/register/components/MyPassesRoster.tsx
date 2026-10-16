'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Edit3, Trash2, X } from 'lucide-react'
import { RegistrationRecord } from '@/lib/registrations'

interface MyPassesRosterProps {
  myRegistrations: RegistrationRecord[]
  onBookAnother: () => void
  onViewBadge: (pass: RegistrationRecord) => void
  onDeletePass: (passId: string) => void
  editingPass: RegistrationRecord | null
  setEditingPass: (pass: RegistrationRecord | null) => void
  handleSaveEdit: (e: React.FormEvent) => void
  isSubmitting: boolean
}

export const MyPassesRoster: React.FC<MyPassesRosterProps> = ({
  myRegistrations,
  onBookAnother,
  onViewBadge,
  onDeletePass,
  editingPass,
  setEditingPass,
  handleSaveEdit,
  isSubmitting,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-xl font-bold text-white">Your Passes &amp; Tickets</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            View, download, or edit your summit passes anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={onBookAnother}
          className="px-4 py-2 rounded-full btn-mint-gradient text-xs font-bold transition-all cursor-pointer shadow-md"
        >
          + Book Another Pass
        </button>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-white/10 rounded-lg p-6 bg-white/[0.01]">
          <Ticket size={32} className="mx-auto text-neutral-600 mb-2" />
          <p className="text-xs text-neutral-400">You haven&apos;t booked any passes yet.</p>
          <button
            type="button"
            onClick={onBookAnother}
            className="mt-2 text-xs font-semibold text-mint hover:underline uppercase tracking-wider font-mono cursor-pointer"
          >
            Get your pass now &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {myRegistrations.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-white/10 bg-[#13221C] p-4 flex flex-col justify-between gap-3 hover:border-white/20 transition-colors shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-mint/10 text-mint font-semibold font-mono">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs text-neutral-400 font-bold">{item.id}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{item.name}</h3>
                <p className="text-xs text-neutral-400 truncate">{item.college}</p>
                {item.selectedEvents && item.selectedEvents.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.selectedEvents.map((ev) => (
                      <span
                        key={ev}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 font-mono"
                      >
                        {ev}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                <span className="text-neutral-500 font-mono text-[11px]">
                  {item.paymentStatus === 'PAID' ? `PAID: ₹${item.amountPaid || 0}` : 'FREE ENTRY'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onViewBadge(item)}
                    className="px-3.5 py-1.5 rounded-full btn-mint-gradient text-void text-[11px] font-mono-data font-black uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                  >
                    View Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPass(item)}
                    className="p-1 rounded border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white cursor-pointer"
                    title="Edit Details"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePass(item.id)}
                    className="p-1 rounded border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 cursor-pointer"
                    title="Cancel Booking"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EDIT PASS MODAL ── */}
      <AnimatePresence>
        {editingPass && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingPass(null)
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/15 bg-[#13221C] p-5 shadow-2xl space-y-3.5 cursor-default"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-sm font-bold text-white">Edit Pass Details</h3>
                <button
                  type="button"
                  onClick={() => setEditingPass(null)}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-300">Name</label>
                  <input
                    type="text"
                    required
                    value={editingPass.name}
                    onChange={(e) =>
                      setEditingPass({ ...editingPass, name: e.target.value })
                    }
                    className="w-full rounded-md border border-white/10 bg-[#081310] px-3 py-1.5 text-xs text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-300">
                    College / Institution
                  </label>
                  <input
                    type="text"
                    value={editingPass.college}
                    onChange={(e) =>
                      setEditingPass({ ...editingPass, college: e.target.value })
                    }
                    className="w-full rounded-md border border-white/10 bg-[#081310] px-3 py-1.5 text-xs text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-300">Phone</label>
                  <input
                    type="tel"
                    value={editingPass.phone || ''}
                    onChange={(e) =>
                      setEditingPass({ ...editingPass, phone: e.target.value })
                    }
                    className="w-full rounded-md border border-white/10 bg-[#081310] px-3 py-1.5 text-xs text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPass(null)}
                    className="px-4 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-white text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-1.5 rounded-full btn-mint-gradient text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
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
