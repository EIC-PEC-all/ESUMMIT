'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-deep text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="font-mono-data text-xs text-mint font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-mint/10 border border-mint/20">
          404 — Page Not Found
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-primary tracking-tight uppercase">
          Lost in Cyberspace?
        </h1>
        <p className="text-xs text-secondary font-mono-data">
          The page or pass tier you are looking for does not exist or has moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full btn-mint-gradient font-mono-data text-xs font-black uppercase tracking-wider transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to E-Summit Home</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
