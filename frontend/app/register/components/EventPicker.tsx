'use client'

import React from 'react'
import { Check, Search } from 'lucide-react'
import { EVENT_CATEGORIES } from '../types'
import { EventItem } from '@/data/summitData'

interface EventPickerProps {
  eventsList: EventItem[]
  filteredEvents: EventItem[]
  selectedEventIds: string[]
  toggleEvent: (id: string) => void
  onSelectAll: () => void
  onClearAll: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string
  setActiveCategory: (cat: string) => void
}

export const EventPicker: React.FC<EventPickerProps> = ({
  filteredEvents,
  selectedEventIds,
  toggleEvent,
  onSelectAll,
  onClearAll,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-white/10 text-white text-[10px] flex items-center justify-center font-mono font-bold">
            2
          </span>
          <span>Pick Events &amp; Workshops ({selectedEventIds.length} Selected)</span>
        </h2>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-mint hover:underline text-[11px] font-semibold cursor-pointer"
          >
            Select All
          </button>
          <span className="text-neutral-600">•</span>
          <button
            type="button"
            onClick={onClearAll}
            className="text-neutral-400 hover:text-white text-[11px] cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hackathons, pitch, workshops..."
            className="w-full rounded-md border border-white/10 bg-[#13221C] pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-panel-alt border border-border-subtle shadow-xs overflow-x-auto no-scrollbar flex-nowrap max-w-full">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono-data font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                  : 'text-secondary hover:text-primary hover:bg-panel'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dense Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredEvents.map((ev) => {
          const isSelected = selectedEventIds.includes(ev.id)
          return (
            <div
              key={ev.id}
              onClick={() => toggleEvent(ev.id)}
              className={`cursor-pointer rounded-md border p-2.5 transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'border-mint bg-[#182A23]'
                  : 'border-white/10 bg-[#13221C] hover:border-white/20 hover:bg-[#182A23]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-mono font-semibold text-mint uppercase tracking-wider truncate">
                    {ev.eyebrow || ev.category}
                  </span>
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-mint bg-mint text-void'
                        : 'border-white/20'
                    }`}
                  >
                    {isSelected && <Check size={10} strokeWidth={3} />}
                  </div>
                </div>

                <h3 className="text-xs font-bold text-white leading-snug truncate">
                  {ev.number ? `${ev.number}. ` : ''}
                  {ev.title}
                </h3>

                <p className="text-[11px] text-neutral-400 line-clamp-1 leading-normal">
                  {ev.purpose}
                </p>
              </div>

              {ev.tags && ev.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                  {ev.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-400 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
