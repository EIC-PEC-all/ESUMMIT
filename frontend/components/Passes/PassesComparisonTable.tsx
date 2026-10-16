'use client'

import React from 'react'
import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { COMPARISON_FEATURES } from './passesData'

interface PassesComparisonTableProps {
  onSelect?: (tier: string) => void
}

export default function PassesComparisonTable({ onSelect }: PassesComparisonTableProps = {}) {
  return (
    <div id="deliverables-comparison-table" className="w-full rounded-2xl bg-panel border border-border-panel p-4 sm:p-7 md:p-9 overflow-hidden scroll-mt-28 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border-subtle text-xs font-mono-data tracking-wider uppercase text-secondary">
              <th className="py-4 px-4 sm:px-6 w-[42%] font-black text-primary text-sm">
                Features
              </th>

              {/* Silver Column */}
              <th className="py-4 px-3 sm:px-4 text-center w-[19%]">
                <span className="font-display text-base sm:text-lg font-black text-emerald-500 dark:text-emerald-400 block">
                  Silver
                </span>
                <span className="text-[11px] text-secondary font-bold block mt-0.5">
                  ₹1,000 + GST
                </span>
              </th>

              {/* Gold Column (Highlighted) */}
              <th className="py-4 px-3 sm:px-4 text-center w-[20%] bg-amber-500/10 border-x border-amber-400/40 rounded-t-xl relative">
                <div className="inline-block px-2.5 py-0.5 mb-1 rounded-md bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest">
                  Popular
                </div>
                <span className="font-display text-base sm:text-lg font-black text-amber-500 dark:text-amber-400 block">
                  Gold
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-300 font-bold block mt-0.5">
                  ₹3,500 + GST
                </span>
              </th>

              {/* Diamond Column */}
              <th className="py-4 px-3 sm:px-4 text-center w-[19%]">
                <span className="font-display text-base sm:text-lg font-black text-indigo-600 dark:text-blue block">
                  Diamond
                </span>
                <span className="text-[11px] text-secondary font-bold block mt-0.5">
                  ₹8,000 + GST
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border-subtle">
            {COMPARISON_FEATURES.map((item) => (
              <tr
                key={item.name}
                className="hover:bg-panel-alt/50 transition-colors"
              >
                {/* Feature Name */}
                <td className="py-3.5 px-4 sm:px-6 text-xs sm:text-sm text-primary font-medium">
                  <span>{item.name}</span>
                </td>

                {/* Silver Value */}
                <td className="py-3.5 px-3 sm:px-4 text-center">
                  {typeof item.silver === 'string' ? (
                    <span className="font-mono-data text-xs font-bold text-emerald-600 dark:text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                      {item.silver}
                    </span>
                  ) : item.silver ? (
                    <Check
                      size={18}
                      className="text-emerald-500 dark:text-emerald-400 stroke-[2.5] mx-auto"
                    />
                  ) : (
                    <span className="text-muted font-bold text-sm select-none">
                      —
                    </span>
                  )}
                </td>

                {/* Gold Value (Highlighted Column) */}
                <td className="py-3.5 px-3 sm:px-4 text-center bg-amber-500/10 border-x border-amber-400/40">
                  {typeof item.gold === 'string' ? (
                    <span className="font-mono-data text-xs font-bold text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/30">
                      {item.gold}
                    </span>
                  ) : item.gold ? (
                    <Check
                      size={18}
                      className="text-amber-500 dark:text-amber-400 stroke-[2.5] mx-auto"
                    />
                  ) : (
                    <span className="text-muted font-bold text-sm select-none">
                      —
                    </span>
                  )}
                </td>

                {/* Diamond Value */}
                <td className="py-3.5 px-3 sm:px-4 text-center">
                  {typeof item.diamond === 'string' ? (
                    <span className="font-mono-data text-xs font-bold text-indigo-600 dark:text-blue px-2 py-0.5 rounded-md bg-indigo-500/15 dark:bg-blue/15 border border-indigo-500/30 dark:border-blue/30">
                      {item.diamond}
                    </span>
                  ) : item.diamond ? (
                    <Check
                      size={18}
                      className="text-indigo-600 dark:text-blue stroke-[2.5] mx-auto"
                    />
                  ) : (
                    <span className="text-muted font-bold text-sm select-none">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer with Action Buttons */}
          <tfoot>
            <tr className="border-t border-border-subtle">
              <td className="py-5 px-4 sm:px-6 text-xs font-mono-data font-bold text-secondary uppercase tracking-wider">
                Select your pass
              </td>

              {/* Silver Button */}
              <td className="py-5 px-3 sm:px-4 text-center">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect('silver')}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider btn-mint-gradient transition-all cursor-pointer active:scale-95 shadow-md hover:opacity-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <Link
                    href="/passes?type=startup&tier=silver#startup-pass-form"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider btn-mint-gradient transition-all shadow-md hover:opacity-95 cursor-pointer active:scale-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </Link>
                )}
              </td>

              {/* Gold Button (Highlighted Column) */}
              <td className="py-5 px-3 sm:px-4 text-center bg-amber-500/10 border-x border-amber-400/40 rounded-b-xl">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect('gold')}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold transition-all cursor-pointer active:scale-95 shadow-md hover:brightness-105"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <Link
                    href="/passes?type=startup&tier=gold#startup-pass-form"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-extrabold transition-all shadow-md hover:brightness-105 cursor-pointer active:scale-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </Link>
                )}
              </td>

              {/* Diamond Button */}
              <td className="py-5 px-3 sm:px-4 text-center">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect('diamond')}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-extrabold transition-all cursor-pointer active:scale-95 shadow-md hover:brightness-105"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <Link
                    href="/passes?type=startup&tier=diamond#startup-pass-form"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-extrabold transition-all shadow-md hover:brightness-105 cursor-pointer active:scale-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </Link>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

