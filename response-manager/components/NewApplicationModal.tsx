'use client'

import { FormEvent, useState } from 'react'
import { X, GraduationCap, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { Registration, PassCategory, ApplicationStatus } from '@/lib/types'

interface Props {
  onClose: () => void
  onCreated: (application: Registration) => void
  initialCategory?: 'student' | 'startup'
}

export function NewApplicationModal({ onClose, onCreated, initialCategory = 'startup' }: Props) {
  const [category, setCategory] = useState<PassCategory>(initialCategory)
  const [saving, setSaving] = useState(false)

  // Common fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [motive, setMotive] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('PENDING_REVIEW')

  // Student fields
  const [college, setCollege] = useState('')
  const [courseYear, setCourseYear] = useState('1st Year (Class of 2030)')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [studentTier, setStudentTier] = useState('delegate')

  // Startup fields
  const [organization, setOrganization] = useState('')
  const [role, setRole] = useState('Founder')
  const [startupTier, setStartupTier] = useState<'silver' | 'gold' | 'diamond'>('gold')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      const payload: Partial<Registration> = {
        category,
        fullName,
        email,
        phone,
        linkedin,
        motive,
        status,
        ...(category === 'student'
          ? {
              college,
              courseYear,
              city,
              state,
              passTier: studentTier,
              passTierName:
                studentTier === 'hackathon'
                  ? 'HACKATHON BUILDER'
                  : studentTier === 'all-access'
                  ? 'ALL-ACCESS PASS'
                  : 'FREE DELEGATE PASS',
              passPrice:
                studentTier === 'hackathon'
                  ? '₹350'
                  : studentTier === 'all-access'
                  ? '₹999'
                  : 'FREE',
            }
          : {
              organization,
              role,
              passTier: startupTier,
              passTierName: `${startupTier.toUpperCase()} PASS`,
              passPrice:
                startupTier === 'diamond'
                  ? '₹8,000 + GST'
                  : startupTier === 'gold'
                  ? '₹3,500 + GST'
                  : '₹1,000 + GST',
            }),
      }

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Could not create registration')
      }
      onCreated(data.application)
      toast.success('Registration created successfully')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create registration')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1814] shadow-2xl cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081310] p-5 sm:p-6">
          <div>
            <p className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-mint">
              Response Manager
            </p>
            <h2 className="font-display text-2xl font-black uppercase text-slate-900 dark:text-white">
              Add New Registration
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2.5 bg-white dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-xs"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category Switcher */}
        <div className="px-6 pt-5 pb-1">
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#12241F] border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => setCategory('student')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                category === 'student'
                  ? 'bg-white dark:bg-[#0D1C18] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap size={15} />
              <span>Student Pass</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory('startup')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                category === 'startup'
                  ? 'bg-white dark:bg-[#0D1C18] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase size={15} />
              <span>Startup Pass</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Fields */}
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6 text-xs">
          {/* Full Name */}
          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Full Name *
            </span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>

          {/* Email */}
          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Email *
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>

          {/* Phone */}
          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Phone / WhatsApp *
            </span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>

          {/* LinkedIn */}
          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              LinkedIn Profile
            </span>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>

          {category === 'student' ? (
            <>
              {/* College */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  College / Institution *
                </span>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Punjab Engineering College"
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
                />
              </label>

              {/* Course Year */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  Course / Year
                </span>
                <input
                  type="text"
                  value={courseYear}
                  onChange={(e) => setCourseYear(e.target.value)}
                  placeholder="e.g. 2nd Year (Class of 2028)"
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
                />
              </label>

              {/* City */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  City
                </span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chandigarh"
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
                />
              </label>

              {/* State */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  State
                </span>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Punjab"
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
                />
              </label>

              {/* Student Pass Tier */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  Pass Tier
                </span>
                <select
                  value={studentTier}
                  onChange={(e) => setStudentTier(e.target.value)}
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs cursor-pointer"
                >
                  <option value="delegate">Free Delegate Pass (₹0)</option>
                  <option value="hackathon">Hackathon Builder (₹350)</option>
                  <option value="all-access">All-Access Pass (₹999)</option>
                </select>
              </label>
            </>
          ) : (
            <>
              {/* Startup / Organization */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  Organization / Startup Name *
                </span>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Acme AI Technologies"
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
                />
              </label>

              {/* Role */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  Role
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs cursor-pointer"
                >
                  <option value="Founder">Founder / Co-Founder</option>
                  <option value="Investor">Investor</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Startup/Institute Representative">Startup / Institute Representative</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {/* Startup Pass Tier */}
              <label>
                <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                  Pass Tier
                </span>
                <select
                  value={startupTier}
                  onChange={(e) => setStartupTier(e.target.value as 'silver' | 'gold' | 'diamond')}
                  className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs cursor-pointer"
                >
                  <option value="gold">Gold Pass (₹3,500 + GST)</option>
                  <option value="silver">Silver Pass (₹1,000 + GST)</option>
                  <option value="diamond">Diamond Pass (₹8,000 + GST)</option>
                </select>
              </label>
            </>
          )}

          {/* Payment Status */}
          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Payment Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs cursor-pointer"
            >
              <option value="PENDING_REVIEW">Payment Pending</option>
              <option value="PAYMENT_CONFIRMED">Payment Confirmed</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </label>

          {/* Motive / Notes */}
          <label className="sm:col-span-2">
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Motive / Notes
            </span>
            <textarea
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              rows={2}
              placeholder="e.g. Competing in Hackathon, Pitching to Investors, etc."
              className="w-full resize-y rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081310] p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 font-mono-data text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-mint-gradient rounded-full px-6 py-2.5 font-mono-data text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Creating…' : 'Create Registration'}
          </button>
        </div>
      </form>
    </div>
  )
}
