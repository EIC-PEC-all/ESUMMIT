'use client'
// components/Account/MyPassesPanel.tsx
// Live delegate passes from GET /registrations/my-passes. Shared by /account
// and the "My E-Badges" tab on /register.

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { QrCode, ShieldCheck, Ticket, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import type { FormattedRegistration } from '@/lib/api-types'

interface Props {
  onViewBadge?: (pass: FormattedRegistration) => void
  /** Rendered when the visitor is signed out. */
  signedOutSlot?: React.ReactNode
}

export default function MyPassesPanel({ onViewBadge, signedOutSlot }: Props) {
  const { data: session, status } = useSession()
  const [passes, setPasses] = useState<FormattedRegistration[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const accessToken = session?.accessToken

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false

    api
      .getMyPasses(accessToken)
      .then((data) => {
        if (!cancelled) setPasses(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load your passes.')
      })

    return () => {
      cancelled = true
    }
  }, [accessToken])

  if (status === 'loading') {
    return <p className="text-muted py-8 text-center text-sm">Loading your passes…</p>
  }

  if (status === 'unauthenticated') {
    return (
      <>
        {signedOutSlot ?? (
          <div className="border-line rounded-2xl border border-dashed p-8 text-center">
            <Ticket className="text-muted mx-auto mb-3 h-8 w-8" />
            <p className="text-muted text-sm">
              Sign in to view your digital passes.
            </p>
          </div>
        )}
      </>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (!passes) {
    return <p className="text-muted py-8 text-center text-sm">Loading your passes…</p>
  }

  if (passes.length === 0) {
    return (
      <div className="border-line rounded-2xl border border-dashed p-8 text-center">
        <Ticket className="text-muted mx-auto mb-3 h-8 w-8" />
        <p className="text-muted text-sm">
          No passes yet — register to generate your E-Badge.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {passes.map((pass) => (
        <div
          key={pass.id}
          className="border-line bg-panel flex items-center gap-4 rounded-2xl border p-4"
        >
          <img
            src={pass.qrCodeDataUrl}
            alt={`QR code for pass ${pass.passId}`}
            className="h-16 w-16 rounded-lg bg-white p-1"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold">{pass.categoryTitle}</p>
              {pass.isCheckedIn && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#7ED321]/15 px-2 py-0.5 text-[10px] font-semibold text-[#7ED321]">
                  <CheckCircle2 className="h-3 w-3" /> CHECKED IN
                </span>
              )}
            </div>
            <p className="text-muted font-mono text-xs">{pass.passId}</p>
            <p className="text-muted mt-1 text-xs">
              {pass.amountPaid > 0 ? `₹${pass.amountPaid} paid` : 'Free pass'}
              {pass.payment ? ` · ${pass.payment.status}` : ''}
            </p>
          </div>

          {onViewBadge && (
            <button
              type="button"
              onClick={() => onViewBadge(pass)}
              className="border-line hover:border-accent shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
            >
              View badge
            </button>
          )}
        </div>
      ))}

      <p className="text-muted flex items-center justify-center gap-1.5 pt-2 text-[11px]">
        <ShieldCheck className="h-3 w-3" />
        Passes are cryptographically signed and verified at the gate.
      </p>
    </div>
  )
}
