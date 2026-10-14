'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { REGISTRATION_STEPS } from './passesData'

export default function HowToRegister() {
  return (
    <div className="mt-16 sm:mt-20 pt-12 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono-data text-xs font-black uppercase tracking-[0.25em] text-mint block mb-1">
            APPLICATION LIFECYCLE
          </span>
          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            HOW TO REGISTER
          </h3>
        </div>
        <p className="font-body text-xs sm:text-sm text-gray-400 max-w-sm">
          Four structured steps from initial screening to confirmed exhibition booth &amp; stage pitch.
        </p>
      </div>

      {/* Steps Grid with Connectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {REGISTRATION_STEPS.map((step, idx) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-mint/30 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center font-mono-data text-sm font-black text-mint">
                  {step.number}
                </span>

                {idx < REGISTRATION_STEPS.length - 1 && (
                  <span className="hidden lg:inline text-gray-600">
                    <ArrowRight size={16} />
                  </span>
                )}
              </div>

              <h4 className="font-display text-base font-black uppercase tracking-wide text-white mb-2">
                {step.title}
              </h4>

              <p className="font-body text-xs text-gray-300 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
