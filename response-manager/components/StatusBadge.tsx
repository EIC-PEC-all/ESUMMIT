import React from 'react'
import { ApplicationStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<ApplicationStatus, { label: string; bg: string; text: string; border: string }> = {
    PENDING_REVIEW: {
      label: 'Pending Review',
      bg: 'dark:bg-amber-500/10 bg-amber-50',
      text: 'dark:text-amber-400 text-amber-950 font-bold',
      border: 'dark:border-amber-500/30 border-amber-300',
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      bg: 'dark:bg-blue-500/10 bg-blue-50',
      text: 'dark:text-blue-400 text-blue-950 font-bold',
      border: 'dark:border-blue-500/30 border-blue-300',
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      bg: 'dark:bg-purple-500/10 bg-purple-50',
      text: 'dark:text-purple-400 text-purple-950 font-bold',
      border: 'dark:border-purple-500/30 border-purple-300',
    },
    MOU_SENT: {
      label: 'MoU Sent',
      bg: 'dark:bg-indigo-500/10 bg-indigo-50',
      text: 'dark:text-indigo-400 text-indigo-950 font-bold',
      border: 'dark:border-indigo-500/30 border-indigo-300',
    },
    MOU_ACCEPTED: {
      label: 'MoU Accepted',
      bg: 'dark:bg-[#74FB44]/15 bg-emerald-100',
      text: 'dark:text-[#74FB44] text-emerald-950 font-bold',
      border: 'dark:border-[#74FB44]/40 border-emerald-400',
    },
    PAYMENT_CONFIRMED: {
      label: 'Payment Confirmed',
      bg: 'dark:bg-emerald-500/15 bg-emerald-100',
      text: 'dark:text-emerald-400 text-emerald-950 font-bold',
      border: 'dark:border-emerald-500/40 border-emerald-500',
    },
    REJECTED: {
      label: 'Not Selected',
      bg: 'dark:bg-rose-500/10 bg-rose-50',
      text: 'dark:text-rose-400 text-rose-950 font-bold',
      border: 'dark:border-rose-500/30 border-rose-300',
    },
  }

  const config = configs[status] || configs.PENDING_REVIEW

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono-data uppercase tracking-[0.15em] border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
      {config.label}
    </span>
  )
}
