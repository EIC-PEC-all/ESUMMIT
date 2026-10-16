'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

interface StudentPassRow {
  name: string
  price: string
  included: string
  badge?: string
  popular?: boolean
  passId: string
}

const STUDENT_PASS_ROWS: StudentPassRow[] = [
  {
    name: 'Free Delegate Pass',
    price: 'Free',
    included: 'Startup expo, speaker sessions, panel discussions',
    badge: 'FOUNDATIONAL',
    passId: 'free-delegate',
  },
  {
    name: 'All-Access Pass',
    price: '₹249',
    included: 'All other competitions, interns fair, exclusive workshops + delegate access',
    badge: 'WORKSHOPS & FAIR',
    passId: 'all-access',
  },
  {
    name: 'Hackathon Pass',
    price: '₹350',
    included: 'Hackathon participation',
    badge: '24H HACKATHON',
    passId: 'hackathon',
  },
  {
    name: 'Ultimate Combo Pass',
    price: '₹499',
    included: 'Hackathon + all competitions + interns fair + workshops + delegate access',
    badge: 'BEST VALUE',
    popular: true,
    passId: 'ultimate-combo',
  },
]

export default function StudentPassesTable() {
  return (
    <div className="w-full mt-10 rounded-3xl bg-panel border border-border-panel p-5 sm:p-8 overflow-hidden shadow-2xl text-primary">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border-subtle">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-primary">
            Student Passes <span className="text-gradient-mint">Overview</span>
          </h3>
          <p className="text-xs text-secondary font-body mt-1">
            Compare access privileges, competition entries, and workshops at a glance.
          </p>
        </div>
        <span className="font-mono-data text-[11px] font-bold text-mint uppercase tracking-widest px-2.5 py-1 rounded-md bg-mint/10 border border-mint/30">
          STUDENT RATES
        </span>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle font-mono-data text-xs text-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Pass</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">What&apos;s Included</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {STUDENT_PASS_ROWS.map((row) => (
              <tr
                key={row.name}
                className={`transition-colors ${
                  row.popular ? 'bg-mint/[0.04]' : 'hover:bg-panel-alt/50'
                }`}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-base text-primary">
                      {row.name}
                    </span>
                    {row.badge && (
                      <span
                        className={`text-[9px] font-mono-data font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          row.popular
                            ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/40'
                            : 'bg-panel-alt text-secondary border border-border-subtle'
                        }`}
                      >
                        {row.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 font-display font-black text-lg text-mint whitespace-nowrap">
                  {row.price}
                </td>
                <td className="py-4 px-4 text-xs sm:text-sm text-secondary font-body leading-relaxed max-w-md">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="text-mint shrink-0 mt-0.5" />
                    <span>{row.included}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/register?pass=${row.passId}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono-data text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                      row.popular
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                        : 'bg-mint hover:opacity-90 text-white dark:text-void'
                    }`}
                  >
                    <span>Get Pass</span>
                    <ArrowRight size={12} strokeWidth={2.5} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="sm:hidden space-y-4">
        {STUDENT_PASS_ROWS.map((row) => (
          <div
            key={row.name}
            className={`p-4 rounded-xl border ${
              row.popular
                ? 'bg-mint/[0.04] border-amber-400/40'
                : 'bg-panel-alt border-border-subtle'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-display font-bold text-sm text-primary">{row.name}</h4>
              <span className="font-display font-black text-base text-mint">{row.price}</span>
            </div>
            <p className="text-xs text-secondary font-body mb-3">{row.included}</p>
            <Link
              href={`/register?pass=${row.passId}`}
              className="btn-mint-gradient w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-void font-black font-mono-data text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-98 transition-all"
            >
              <span>Get Pass</span>
              <ArrowRight size={12} strokeWidth={2.5} className="text-void" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
