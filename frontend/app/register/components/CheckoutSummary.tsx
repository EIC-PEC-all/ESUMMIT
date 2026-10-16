'use client'

import React from 'react'
import { CheckCircle2, CreditCard, Tag, ArrowLeft } from 'lucide-react'
import { PassTier, RegistrationFormData } from '../types'
import { EventItem } from '@/data/summitData'

interface CheckoutSummaryProps {
  selectedTier: PassTier
  eventsList: EventItem[]
  selectedEventIds: string[]
  formData: RegistrationFormData
  couponCode: string
  setCouponCode: (code: string) => void
  discountPercent: number
  applyCoupon: () => void
  basePrice: number
  discountAmount: number
  finalPrice: number
  isSubmitting: boolean
  handleCompleteOrder: () => void
  onBackToEdit: () => void
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  selectedTier,
  eventsList,
  selectedEventIds,
  formData,
  couponCode,
  setCouponCode,
  discountPercent,
  applyCoupon,
  basePrice,
  discountAmount,
  finalPrice,
  isSubmitting,
  handleCompleteOrder,
  onBackToEdit,
}) => {
  return (
    <div className="space-y-5 max-w-4xl mx-auto pt-2">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white">Confirm Your Registration</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Review your pass details and complete booking.
          </p>
        </div>
        <button
          type="button"
          onClick={onBackToEdit}
          className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:border-mint/50 transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={13} />
          <span>Back to Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Side: Order Items */}
        <div className="lg:col-span-7 space-y-3">
          {/* Selected Pass Card */}
          <div className="rounded-lg border border-white/10 bg-[#13221C] p-4 space-y-1.5">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              Selected Ticket
            </span>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedTier.title}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{selectedTier.desc}</p>
              </div>
              <span className="text-xs font-bold text-mint font-mono px-2 py-0.5 rounded bg-mint/10 border border-mint/20 shrink-0 ml-3">
                {selectedTier.fee === 0 ? 'FREE' : `₹${selectedTier.fee}`}
              </span>
            </div>
          </div>

          {/* Included Competitions */}
          <div className="rounded-lg border border-white/10 bg-[#13221C] p-4 space-y-2">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono">
              Events &amp; Workshops ({selectedEventIds.length})
            </span>

            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
              {eventsList
                .filter((ev) => selectedEventIds.includes(ev.id))
                .map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between p-2 rounded bg-[#081310] text-xs"
                  >
                    <span className="text-neutral-200 text-xs truncate mr-2">{ev.title}</span>
                    <span className="text-mint text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-mint/10 shrink-0 font-mono">
                      Included
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Attendee Profile */}
          <div className="rounded-lg border border-white/10 bg-[#13221C] p-4 space-y-2 text-xs text-neutral-400">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider font-mono block">
              Attendee Info
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">Name</span>
                <span className="text-white font-medium">{formData.name}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Email</span>
                <span className="text-white font-medium">{formData.email}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">College</span>
                <span className="text-neutral-300 font-medium">
                  {formData.college || 'PEC Chandigarh'}
                </span>
              </div>
              {formData.phone && (
                <div>
                  <span className="text-neutral-500 block text-[10px]">Phone</span>
                  <span className="text-neutral-300 font-medium">{formData.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Payment & Pricing Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-lg border border-white/10 bg-[#13221C] p-4 space-y-3.5 sticky top-20 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 border-b border-white/10 pb-2">
              Payment Summary
            </h3>

            {/* Promo Code Input */}
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                Promo / Discount Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    size={12}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="EARLYBIRD"
                    className="w-full rounded-md border border-white/10 bg-[#081310] px-2.5 py-1.5 pl-7 text-xs text-white uppercase outline-none focus:border-mint font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/15 text-xs font-semibold uppercase transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </div>
              {discountPercent > 0 && (
                <p className="text-[10px] text-mint font-medium">
                  ✓ Coupon applied: {discountPercent}% discount
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs border-t border-white/10 pt-2.5 text-neutral-300">
              <div className="flex justify-between">
                <span>Ticket Fee:</span>
                <span className="font-mono">{basePrice === 0 ? '₹0' : `₹${basePrice}`}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-mint">
                  <span>Discount ({discountPercent}%):</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Platform Fee:</span>
                <span className="text-mint font-mono">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                <span>Total Payable:</span>
                <span className="text-mint font-mono text-base">
                  {finalPrice === 0 ? 'FREE' : `₹${finalPrice}`}
                </span>
              </div>
            </div>

            {/* Submit / Pay Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleCompleteOrder}
              className="w-full py-3 px-5 rounded-full btn-mint-gradient text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : finalPrice === 0 ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Confirm Free Registration</span>
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  <span>Pay ₹{finalPrice} &amp; Get Pass</span>
                </>
              )}
            </button>

            <p className="text-center text-[10px] text-neutral-500 font-mono">
              Your entry ticket will be sent to {formData.email}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
