'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#060D0B] text-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="font-mono-data text-xs text-mint font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-mint/10 border border-mint/20">
          404 — Page Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight uppercase">
          Lost in Cyberspace?
        </h1>
        <p className="text-xs text-neutral-400 font-mono-data">
          The page or pass tier you are looking for does not exist or has moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mint hover:bg-white text-void font-mono-data text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Return to E-Summit Home</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
