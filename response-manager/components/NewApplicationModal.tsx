'use client'

import { FormEvent, useState } from 'react'
import { Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { FundingApplication } from '@/lib/types'

interface Props {
  onClose: () => void
  onCreated: (application: FundingApplication) => void
}

const initial = {
  startupName: '',
  founderName: '',
  email: '',
  phone: '',
  founderLinkedIn: '',
  websiteUrl: '',
  passTier: 'gold',
  stage: 'Idea / concept',
  sector: '',
  revenueStage: 'Pre-revenue',
  totalFundingRaised: '₹0',
  currentAsk: '',
  preMoneyValuation: '',
  committedCapital: '',
  pitchDeckUrl: '',
  demoVideoUrl: '',
  mouComfortable: 'Yes, I am comfortable with the fee and can proceed after reviewing the MoU.',
}

const fields: Array<[keyof typeof initial, string, string?, boolean?]> = [
  ['startupName', 'Startup name', 'text', true],
  ['founderName', 'Founder name', 'text', true],
  ['email', 'Email', 'email', true],
  ['phone', 'Phone / WhatsApp', 'tel', true],
  ['founderLinkedIn', 'LinkedIn URL', 'url', true],
  ['websiteUrl', 'Website URL', 'url'],
  ['sector', 'Sector', 'text', true],
  ['currentAsk', 'Current fundraise ask', 'text', true],
  ['pitchDeckUrl', 'Pitch deck URL', 'url', true],
  ['demoVideoUrl', 'Demo video URL', 'url'],
  ['preMoneyValuation', 'Pre-money valuation'],
  ['committedCapital', 'Committed capital'],
]

export function NewApplicationModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  const update = (key: keyof typeof initial, value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Could not create application')
      onCreated(data.application)
      toast.success('Application created')
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create application')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-application-title"
    >
      <form
        onSubmit={submit}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1814] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081310] p-5 sm:p-6">
          <div>
            <p className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-mint">
              Response manager
            </p>
            <h2 id="new-application-title" className="font-display text-2xl font-black uppercase text-slate-900 dark:text-white">
              Add application
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

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6 text-xs">
          {fields.map(([key, label, type = 'text', required]) => (
            <label key={key}>
              <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                {label}
                {required ? ' *' : ''}
              </span>
              <input
                type={type}
                required={required}
                value={form[key]}
                onChange={(event) => update(key, event.target.value)}
                className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
              />
            </label>
          ))}

          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Pass tier
            </span>
            <select
              value={form.passTier}
              onChange={(event) => update('passTier', event.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs cursor-pointer"
            >
              <option value="diamond">Diamond pass</option>
              <option value="gold">Gold pass</option>
              <option value="silver">Silver pass</option>
            </select>
          </label>

          <label>
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Startup stage
            </span>
            <select
              value={form.stage}
              onChange={(event) => update('stage', event.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs cursor-pointer"
            >
              <option>Idea / concept</option>
              <option>MVP</option>
              <option>Early revenue</option>
              <option>Growth stage</option>
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              Revenue stage
            </span>
            <input
              value={form.revenueStage}
              onChange={(event) => update('revenueStage', event.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block font-mono-data text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
              MoU readiness
            </span>
            <textarea
              required
              value={form.mouComfortable}
              onChange={(event) => update('mouComfortable', event.target.value)}
              rows={2}
              className="w-full resize-y rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0D1C18] focus:border-emerald-500 focus:outline-none shadow-xs"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#081310] p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 font-mono-data text-xs font-bold uppercase tracking-wider bg-white hover:bg-slate-100 dark:bg-[#12241F] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={saving}
            className="rounded-full px-5 py-2.5 font-mono-data text-xs font-bold uppercase tracking-wider disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-mint dark:text-[#060D0B] shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {saving ? 'Saving…' : (
              <>
                <Plus size={14} className="stroke-[2.5]" />
                <span>Create application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
