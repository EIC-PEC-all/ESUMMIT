'use client'

import React, { useId } from 'react'
import { motion } from 'framer-motion'

export interface PillTab<T extends string | number = string> {
  id: T
  label: React.ReactNode
  icon?: React.ComponentType<{ size?: number | string; className?: string }> | React.ComponentType<any>
  badge?: React.ReactNode
}

export const APPLE_SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 340,
  damping: 24,
  mass: 0.55,
} as const

interface PillSegmentedTabsProps<T extends string | number = string> {
  tabs: PillTab<T>[]
  activeTab: T
  onChange: (id: T) => void
  className?: string
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  layoutId?: string
}

export function PillSegmentedTabs<T extends string | number = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  fullWidth = false,
  size = 'md',
  layoutId,
}: PillSegmentedTabsProps<T>) {
  const generatedId = useId()
  const activeLayoutId = layoutId || `pill-segment-${generatedId}`

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 sm:px-6 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 sm:px-8 py-3 text-sm',
  }[size]

  return (
    <div
      role="tablist"
      className={`p-1.5 rounded-full bg-panel-alt/90 backdrop-blur-md border border-border-subtle shadow-md overflow-x-auto no-scrollbar flex flex-row items-center gap-1.5 sm:gap-2 flex-nowrap ${
        fullWidth ? 'w-full' : 'inline-flex max-w-full'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id
        const Icon = tab.icon

        return (
          <motion.button
            key={String(tab.id)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className={`group relative rounded-full cursor-pointer whitespace-nowrap font-mono-data font-black uppercase tracking-wider flex items-center justify-center select-none ${
              fullWidth ? 'flex-1 min-w-[130px] sm:min-w-0 w-full shrink-0 sm:shrink' : 'shrink-0'
            } ${sizeClasses} ${
              isSelected ? 'text-void' : 'text-secondary hover:text-primary'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={activeLayoutId}
                className="absolute inset-0 rounded-full btn-mint-gradient shadow-[0_2px_14px_rgba(116,251,68,0.32),inset_0_1px_0_rgba(255,255,255,0.45)]"
                transition={APPLE_SPRING_TRANSITION}
              />
            )}
            <span
              className={`relative z-10 flex items-center justify-center gap-2 transition-colors duration-200 ${
                isSelected ? 'text-void' : 'text-secondary group-hover:text-primary'
              }`}
            >
              {Icon && (
                <Icon
                  size={size === 'sm' ? 13 : size === 'lg' ? 18 : 16}
                  className={`transition-colors duration-200 shrink-0 ${
                    isSelected ? 'text-void stroke-[2.5]' : 'text-mint'
                  }`}
                />
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors duration-200 ${
                    isSelected
                      ? 'bg-void/25 text-void'
                      : 'bg-panel text-secondary border border-border-subtle'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

