import React from 'react'
import { ApplicationStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<ApplicationStatus, { label: string; bg: string; text: string; border: string }> = {
    PENDING_REVIEW: {
      label: 'Pending Review',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    MOU_SENT: {
      label: 'MoU Sent',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
    },
    MOU_ACCEPTED: {
      label: 'MoU Accepted',
      bg: 'bg-[#00F5D4]/15',
      text: 'text-[#00F5D4]',
      border: 'border-[#00F5D4]/40',
    },
    PAYMENT_CONFIRMED: {
      label: 'Payment Confirmed',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
    },
    REJECTED: {
      label: 'Not Selected',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
    },
  }

  const config = configs[status] || configs.PENDING_REVIEW

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono-data uppercase tracking-[0.15em] font-bold border ${config.bg} ${config.text} ${config.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
      {config.label}
    </span>
  )
}
