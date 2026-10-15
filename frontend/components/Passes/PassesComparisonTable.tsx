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
    <div id="deliverables-comparison-table" className="w-full rounded-3xl bg-[#091712] border border-white/10 p-4 sm:p-7 md:p-9 overflow-hidden scroll-mt-28">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/10 text-xs font-mono-data tracking-wider uppercase text-gray-300">
              <th className="py-4 px-4 sm:px-6 w-[42%] font-black text-white text-sm">
                Features
              </th>

              {/* Silver Column */}
              <th className="py-4 px-3 sm:px-4 text-center w-[19%]">
                <span className="font-display text-base sm:text-lg font-black text-emerald-400 block">
                  Silver
                </span>
                <span className="text-[11px] text-emerald-300/80 font-bold block mt-0.5">
                  ₹1,000 + GST
                </span>
              </th>

              {/* Gold Column (Highlighted) */}
              <th className="py-4 px-3 sm:px-4 text-center w-[20%] bg-amber-500/10 border-x border-amber-400/40 rounded-t-2xl relative">
                <div className="inline-block px-2.5 py-0.5 mb-1 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest">
                  Popular
                </div>
                <span className="font-display text-base sm:text-lg font-black text-amber-400 block">
                  Gold
                </span>
                <span className="text-[11px] text-amber-300 font-bold block mt-0.5">
                  ₹3,500 + GST
                </span>
              </th>

              {/* Diamond Column */}
              <th className="py-4 px-3 sm:px-4 text-center w-[19%]">
                <span className="font-display text-base sm:text-lg font-black text-cyan-400 block">
                  Diamond
                </span>
                <span className="text-[11px] text-cyan-300/80 font-bold block mt-0.5">
                  ₹8,000 + GST
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/[0.06]">
            {COMPARISON_FEATURES.map((item) => (
              <tr
                key={item.name}
                className="hover:bg-white/[0.03] transition-colors"
              >
                {/* Feature Name */}
                <td className="py-3.5 px-4 sm:px-6 text-xs sm:text-sm text-gray-100 font-medium">
                  <span>{item.name}</span>
                </td>

                {/* Silver Value */}
                <td className="py-3.5 px-3 sm:px-4 text-center">
                  {typeof item.silver === 'string' ? (
                    <span className="font-mono-data text-xs font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-400/15 border border-emerald-400/30">
                      {item.silver}
                    </span>
                  ) : item.silver ? (
                    <Check
                      size={18}
                      className="text-emerald-400 stroke-[2.5] mx-auto"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm select-none">
                      —
                    </span>
                  )}
                </td>

                {/* Gold Value (Highlighted Column) */}
                <td className="py-3.5 px-3 sm:px-4 text-center bg-amber-500/10 border-x border-amber-400/40">
                  {typeof item.gold === 'string' ? (
                    <span className="font-mono-data text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-400/15 border border-amber-400/30">
                      {item.gold}
                    </span>
                  ) : item.gold ? (
                    <Check
                      size={18}
                      className="text-amber-400 stroke-[2.5] mx-auto"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm select-none">
                      —
                    </span>
                  )}
                </td>

                {/* Diamond Value */}
                <td className="py-3.5 px-3 sm:px-4 text-center">
                  {typeof item.diamond === 'string' ? (
                    <span className="font-mono-data text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-400/15 border border-cyan-400/30">
                      {item.diamond}
                    </span>
                  ) : item.diamond ? (
                    <Check
                      size={18}
                      className="text-cyan-400 stroke-[2.5] mx-auto"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm select-none">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Table Footer with Action Buttons */}
          <tfoot>
            <tr className="border-t border-white/10">
              <td className="py-5 px-4 sm:px-6 text-xs font-mono-data font-bold text-gray-400 uppercase tracking-wider">
                Select your pass
              </td>

              {/* Silver Button */}
              <td className="py-5 px-3 sm:px-4 text-center">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect('silver')}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-emerald-400 text-black hover:bg-emerald-300 transition-colors cursor-pointer active:scale-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <Link
                    href="/passes?type=startup&tier=silver#startup-pass-form"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-emerald-400 text-black hover:bg-emerald-300 transition-colors"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </Link>
                )}
              </td>

              {/* Gold Button (Highlighted Column) */}
              <td className="py-5 px-3 sm:px-4 text-center bg-amber-500/10 border-x border-amber-400/40 rounded-b-2xl">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect('gold')}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-colors cursor-pointer active:scale-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <Link
                    href="/passes?type=startup&tier=gold#startup-pass-form"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-amber-400 text-black hover:bg-amber-300 transition-colors"
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
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-cyan-400 text-black hover:bg-cyan-300 transition-colors cursor-pointer active:scale-95"
                  >
                    <span>Select</span>
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </button>
                ) : (
                  <Link
                    href="/passes?type=startup&tier=diamond#startup-pass-form"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full font-mono-data text-xs font-black uppercase tracking-wider bg-cyan-400 text-black hover:bg-cyan-300 transition-colors"
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

