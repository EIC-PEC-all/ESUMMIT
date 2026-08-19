// lib/razorpay.ts
// Minimal loader + typings for Razorpay Checkout.js. Only used when
// NEXT_PUBLIC_DEMO_PAYMENTS is not 'true' and the backend hands back a
// truthy razorpayKeyId — see hooks/usePassPayment.ts for the decision logic.

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: { color?: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (response: unknown) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

let loadPromise: Promise<boolean> | null = null

/** Injects the Razorpay Checkout.js script once and resolves true/false. */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = CHECKOUT_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  return loadPromise
}

export function openRazorpayCheckout(options: RazorpayOptions): RazorpayInstance | null {
  if (typeof window === 'undefined' || !window.Razorpay) return null
  const instance = new window.Razorpay(options)
  instance.open()
  return instance
}
