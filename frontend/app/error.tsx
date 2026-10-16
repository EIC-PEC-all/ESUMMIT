'use client'

import { useEffect } from 'react'
import { RotateCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-deep text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="font-mono-data text-xs text-rose-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
          Something went wrong
        </span>
        <h1 className="text-xl sm:text-2xl font-display font-black text-primary tracking-tight uppercase">
          Application Error
        </h1>
        <p className="text-xs text-secondary font-mono-data">
          An unexpected error occurred while rendering this view.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-mint hover:bg-white text-void font-mono-data text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_var(--border-glow)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCw size={13} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border-subtle bg-panel-alt hover:bg-panel text-primary font-mono-data text-xs font-bold uppercase tracking-wider transition-all hover:border-mint"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
