'use client'
// hooks/usePassPayment.ts
// Shared checkout flow for /register and /passes: POST /payments/create-order,
// then either the real Razorpay Checkout.js modal or a labeled demo bypass —
// both end at POST /payments/verify.
//
// The backend's RAZORPAY_KEY_SECRET is intentionally unset in this environment,
// so it accepts any {orderId, transactionId} pair. NEXT_PUBLIC_DEMO_PAYMENTS
// (see .env.local) short-circuits straight to that path instead of trying to
// open a Checkout.js modal against a synthetic order the real Razorpay backend
// has never heard of.

import { useCallback, useState } from 'react'
import { api, ApiError } from '@/lib/api'
import type { CreateOrderResponse, VerifyPaymentResponse } from '@/lib/api-types'
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay'

export type PaymentPhase = 'idle' | 'creating-order' | 'ready' | 'processing' | 'success' | 'error'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_PAYMENTS === 'true'

function randomDemoTxnId(): string {
  return `demo_txn_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

interface Customer {
  name: string
  email: string
  phone?: string | null
}

export function usePassPayment() {
  const [phase, setPhase] = useState<PaymentPhase>('idle')
  const [order, setOrder] = useState<CreateOrderResponse | null>(null)
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  /** Whether the real Razorpay Checkout.js modal is worth attempting. */
  const isRealGatewayAvailable = Boolean(order?.razorpayKeyId) && !DEMO_MODE

  const createOrder = useCallback(async (passId: string) => {
    setPhase('creating-order')
    setError(null)
    try {
      const res = await api.createOrder(passId)
      setOrder(res)
      setPhase('ready')
      return res
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not start checkout.')
      setPhase('error')
      throw err
    }
  }, [])

  const verify = useCallback(
    async (orderId: string, transactionId: string, signature?: string) => {
      setPhase('processing')
      setError(null)
      try {
        const res = await api.verifyPayment({ orderId, transactionId, signature })
        setResult(res)
        if (res.success) {
          setPhase('success')
        } else {
          setPhase('error')
          setError(res.message || 'Payment verification failed.')
        }
        return res
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Payment verification failed.')
        setPhase('error')
        throw err
      }
    },
    [],
  )

  const payWithRazorpay = useCallback(
    async (customer: Customer) => {
      if (!order) return
      setPhase('processing')
      setError(null)

      const loaded = await loadRazorpayScript()
      if (!loaded) {
        setError('Could not load the payment gateway. Use the test payment option below.')
        setPhase('error')
        return
      }

      try {
        openRazorpayCheckout({
          key: order.razorpayKeyId,
          amount: order.amountInPaisa,
          currency: order.currency,
          name: 'PEC Summit 2026',
          description: `Delegate pass ${order.passId}`,
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone || undefined,
          },
          theme: { color: '#7ED321' },
          handler: (response) => {
            void verify(order.orderId, response.razorpay_payment_id, response.razorpay_signature)
          },
          modal: {
            ondismiss: () => {
              // User closed the modal without paying — return to the ready
              // state so they can retry or fall back to the demo path.
              setPhase((prev) => (prev === 'processing' ? 'ready' : prev))
            },
          },
        })
      } catch {
        setError('The payment gateway could not be opened. Use the test payment option below.')
        setPhase('error')
      }
    },
    [order, verify],
  )

  const payDemo = useCallback(async () => {
    if (!order) return
    return verify(order.orderId, randomDemoTxnId())
  }, [order, verify])

  const reset = useCallback(() => {
    setPhase('idle')
    setOrder(null)
    setResult(null)
    setError(null)
  }, [])

  return {
    phase,
    order,
    error,
    result,
    isRealGatewayAvailable,
    isDemoMode: DEMO_MODE,
    createOrder,
    payWithRazorpay,
    payDemo,
    reset,
  }
}
