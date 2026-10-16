'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, GraduationCap, Building2, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import PassCard from './PassCard'
import PassesComparisonTable from './PassesComparisonTable'
import StartupPassForm from './StartupPassForm'
import StudentPassForm from './StudentPassForm'
import { STARTUP_PACKAGES, STUDENT_PACKAGES } from './passesData'

interface PassesSectionProps {
  isStandalonePage?: boolean
}

export default function PassesSection({ isStandalonePage = false }: PassesSectionProps) {
  const searchParams = useSearchParams()
  const [passType, setPassType] = useState<'student' | 'startup'>('student')
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [selectedStudentPass, setSelectedStudentPass] = useState<string | null>(null)

  useEffect(() => {
    const type = searchParams?.get('type')?.toLowerCase()
    const tier = searchParams?.get('tier')?.toLowerCase()

    if (tier === 'silver' || tier === 'gold' || tier === 'diamond') {
      setSelectedTier(tier)
      setPassType('startup')
      setTimeout(() => {
        const formEl = document.getElementById('startup-pass-form')
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } else if (
      tier === 'free-delegate' ||
      tier === 'delegate' ||
      tier === 'all-access' ||
      tier === 'hackathon' ||
      tier === 'combo'
    ) {
      setSelectedStudentPass(tier)
      setPassType('student')
      setTimeout(() => {
        const formEl = document.getElementById('student-pass-form')
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    } else if (type === 'startup' || type === 'startups') {
      setPassType('startup')
    } else if (type === 'student' || type === 'students') {
      setPassType('student')
    }
  }, [searchParams])

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('type', 'startup')
      url.searchParams.set('tier', tier)
      window.history.replaceState({}, '', url.toString())
      setTimeout(() => {
        const formEl = document.getElementById('startup-pass-form')
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleSelectStudentPass = (passId: string) => {
    setSelectedStudentPass(passId)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('type', 'student')
      url.searchParams.set('tier', passId)
      window.history.replaceState({}, '', url.toString())
      setTimeout(() => {
        const formEl = document.getElementById('student-pass-form')
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  const handleBackToComparison = () => {
    setSelectedTier(null)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('tier')
      window.history.replaceState({}, '', url.toString())
      setTimeout(() => {
        const tableEl = document.getElementById('deliverables-comparison-table')
        if (tableEl) {
          tableEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 80)
    }
  }

  const handleBackToStudentCards = () => {
    setSelectedStudentPass(null)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('tier')
      window.history.replaceState({}, '', url.toString())
    }
  }

  return (
    <section
      id="passes"
      className={`relative z-10 overflow-hidden bg-section-1 text-primary ${
        isStandalonePage
          ? 'pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16'
          : '-mt-10 sm:-mt-12 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] border-t border-mint/20 py-16 sm:py-20 md:py-24'
      }`}
      aria-label="Passes and Packages"
    >
      {/* Background Ambience Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-mint/15 blur-[120px] rounded-full" />
      </div>

      <div className="section-container relative z-10">
        {/* Header Block */}
        <div className="mt-1 sm:mt-2 mb-4 sm:mb-5 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="font-mono-data text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-mint flex items-center gap-2 mb-1.5">
              <Sparkles size={14} />
              {passType === 'student' ? 'JOIN THE SUMMIT' : 'PARTNER WITH US'}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-primary leading-none">
              {passType === 'student' ? (
                <>STUDENT <span className="text-gradient-mint">PASSES</span></>
              ) : (
                <>STARTUP <span className="text-gradient-mint">PACKAGES</span></>
              )}
            </h2>
            <p className="font-mono-data text-xs sm:text-sm text-secondary font-bold uppercase tracking-widest mt-2">
              {passType === 'student'
                ? 'LEARN • COMPETE • NETWORK • BUILD'
                : 'SHOWCASE • NETWORK • HIRE • COLLABORATE'}
            </p>
          </div>

          <div className="max-w-md lg:text-right">
            <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
              {passType === 'student'
                ? "Join 5,000+ ambitious student engineers & innovators at North India's premier student-run entrepreneurship platform."
                : "Engage with 8,000+ students, founders, investors, and innovators at one of North India's largest student-run startup platforms."}
            </p>
            <span className="font-mono-data text-[11px] font-bold text-mint uppercase tracking-widest mt-1 block">
              CHOOSE THE TIER THAT FITS YOUR GOALS
            </span>
          </div>
        </div>

        {/* Structured Segmented Toggle: Student vs Startup */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border-subtle pb-3 sm:pb-4 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-panel-alt border border-border-subtle shadow-md">
            <button
              type="button"
              onClick={() => setPassType('student')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-mono-data font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                passType === 'student'
                  ? 'bg-mint text-void shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-panel'
              }`}
            >
              <GraduationCap size={16} />
              <span>Student Passes</span>
            </button>
            <button
              type="button"
              onClick={() => setPassType('startup')}
              className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-mono-data font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                passType === 'startup'
                  ? 'bg-mint text-void shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-panel'
              }`}
            >
              <Building2 size={16} />
              <span>Startup Packages</span>
            </button>
          </div>

          <span className="font-mono-data text-[11px] font-bold text-mint uppercase tracking-widest">
            {passType === 'student' ? 'FOR ATTENDEES & BUILDERS' : 'FOR FOUNDERS & VENTURES'}
          </span>
        </div>

        {/* Dynamic Cards Grid */}
        {passType === 'student' ? (
          <div id="student-packages-content">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch mb-6 sm:mb-8">
              {STUDENT_PACKAGES.map((pkg, idx) => (
                <PassCard
                  key={pkg.id}
                  pkg={pkg}
                  index={idx}
                  isCenter={pkg.popular}
                  isSelected={isStandalonePage && (selectedStudentPass === pkg.id || selectedStudentPass === pkg.tier)}
                  onSelect={isStandalonePage ? handleSelectStudentPass : undefined}
                />
              ))}
            </div>

            {isStandalonePage && selectedStudentPass && (
              <div className="mb-14 w-full">
                <StudentPassForm
                  selectedTier={selectedStudentPass}
                  onSelectTier={handleSelectStudentPass}
                  onBackToCards={handleBackToStudentCards}
                />
              </div>
            )}
          </div>
        ) : (
          <div id="startup-packages-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch mb-6 sm:mb-8">
              {STARTUP_PACKAGES.map((pkg, idx) => (
                <PassCard
                  key={pkg.id}
                  pkg={pkg}
                  index={idx}
                  isCenter={idx === 1}
                  isSelected={isStandalonePage && selectedTier === pkg.tier}
                  onSelect={isStandalonePage ? handleSelectTier : undefined}
                />
              ))}
            </div>

            {/* Dynamic view: When tier is selected, show Application Form; Otherwise show Comparison Table */}
            {isStandalonePage ? (
              selectedTier ? (
                <div className="mb-14 w-full">
                  <StartupPassForm
                    selectedTier={selectedTier}
                    onSelectTier={handleSelectTier}
                    onBackToComparison={handleBackToComparison}
                  />
                </div>
              ) : (
                <div className="mt-8 mb-6 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono-data uppercase tracking-[0.2em] text-gray-400 font-bold">
                      DELIVERABLES COMPARISON TABLE
                    </span>
                    <span className="text-xs font-mono-data text-mint font-bold uppercase tracking-wider">
                      Click &apos;Select&apos; on any pass to begin application
                    </span>
                  </div>
                  <PassesComparisonTable onSelect={handleSelectTier} />
                </div>
              )
            ) : (
              <div className="mt-6 text-center">
                <Link
                  href="/passes?type=startup"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono-data text-xs font-bold uppercase tracking-wider border border-white/15 hover:border-mint transition-all shadow-md hover:scale-105"
                >
                  <span>View Full Startup Packages &amp; Deliverables</span>
                  <ArrowRight size={14} className="text-mint" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}




