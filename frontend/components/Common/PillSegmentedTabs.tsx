'use client'

import React from 'react'

export interface PillTab<T extends string | number = string> {
  id: T
  label: React.ReactNode
  icon?: React.ComponentType<{ size?: number; className?: string }>
  badge?: React.ReactNode
}

interface PillSegmentedTabsProps<T extends string | number = string> {
  tabs: PillTab<T>[]
  activeTab: T
  onChange: (id: T) => void
  className?: string
  fullWidth?: boolean
  size?: 'sm' | 'md'
}

export function PillSegmentedTabs<T extends string | number = string>({
  tabs,
  activeTab,
  onChange,
  className = '',
  fullWidth = false,
  size = 'md',
}: PillSegmentedTabsProps<T>) {
  const isSm = size === 'sm'

  return (
    <div
      className={`p-1.5 rounded-full bg-panel-alt border border-border-subtle shadow-md overflow-x-auto no-scrollbar flex flex-row items-center gap-1.5 sm:gap-2 flex-nowrap ${
        fullWidth ? 'w-full' : 'inline-flex max-w-full'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={String(tab.id)}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full transition-all cursor-pointer whitespace-nowrap font-mono-data font-black uppercase tracking-wider flex items-center justify-center gap-2 ${
              fullWidth ? 'flex-1 min-w-[140px] sm:min-w-0 w-full shrink-0 sm:shrink' : 'shrink-0'
            } ${
              isSm
                ? 'px-3.5 py-1.5 text-xs'
                : 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm'
            } ${
              isSelected
                ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                : 'text-secondary hover:text-primary hover:bg-panel'
            }`}
          >
            {Icon && (
              <Icon
                size={isSm ? 13 : 15}
                className={isSelected ? 'text-void stroke-[2.5]' : 'text-mint'}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isSelected
                    ? 'bg-void text-mint'
                    : 'bg-panel text-secondary border border-border-subtle'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
