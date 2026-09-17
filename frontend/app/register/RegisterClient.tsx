'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ArrowLeft,
  Ticket,
  Download,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  LogOut,
  LogIn,
  KeyRound,
  Edit3,
  Trash2,
  X,
  CreditCard,
  Tag,
  Search,
  GraduationCap,
  Terminal,
  Briefcase,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
const TOAST_STYLE = {
  style: {
    background: '#13221C',
    color: '#ffffff',
    border: '1px solid rgba(74, 222, 128, 0.2)',
    fontSize: '12px',
    borderRadius: '8px',
  },
}
import { useAuth } from '@/context/AuthContext'
import {
  RegistrationRecord,
  createRegistrationRecord,
  getUserRegistrations,
  updateRegistrationRecord,
  deleteRegistrationRecord,
} from '@/lib/registrations'

import { MASTER_EVENTS, EventItem } from '@/data/summitData'
import { useSummitData } from '@/hooks/useSummitData'

export interface PassTier {
  id: string
  title: string
  tagline: string
  desc: string
  fee: number
  feeLabel: string
  badge: string
  defaultEventId?: string
  popular?: boolean
  icon: any
}

const PASS_TIERS: PassTier[] = [
  {
    id: 'student',
    title: 'Student Pass',
    tagline: 'General Access',
    desc: 'Keynotes, keynote panels, open startup expo, and all public workshops.',
    fee: 0,
    feeLabel: 'FREE',
    badge: 'STUDENT PASS',
    defaultEventId: 'ev-2',
    icon: GraduationCap,
  },
  {
    id: 'hackathon',
    title: 'Hackathon Pass',
    tagline: '24-Hour Sprint',
    desc: 'Overnight coding workspace, meals, mentorship, and ₹5L+ prize pool.',
    fee: 199,
    feeLabel: '₹199',
    badge: 'HACKATHON PASS',
    defaultEventId: 'ev-1',
    popular: true,
    icon: Terminal,
  },
  {
    id: 'founder',
    title: 'Pitch Pass',
    tagline: 'Startup Dealroom',
    desc: 'Pitch to VCs, angel investors, expo showcase stall, and 1:1 meetings.',
    fee: 799,
    feeLabel: '₹799',
    badge: 'FOUNDER PASS',
    defaultEventId: 'ev-5',
    icon: Briefcase,
  },
  {
    id: 'ambassador',
    title: 'Ambassador',
    tagline: 'Campus Leader',
    desc: 'Represent your college, get VIP access, leadership certification, and goodies.',
    fee: 0,
    feeLabel: 'FREE',
    badge: 'AMBASSADOR PASS',
    defaultEventId: 'ev-6',
    icon: Award,
  },
]

const INTEREST_TRACKS = [
  'Artificial Intelligence & ML',
  'Fintech & Venture Finance',
  'Pitch Competitions',
  '24-Hour Hackathons',
  'DeepTech & Robotics',
  'Web3 & Cloud Systems',
]

const EVENT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'pitch', label: 'Pitch & Startups' },
  { id: 'finance', label: 'Finance' },
  { id: 'workshops', label: 'Workshops' },
]

export default function RegisterClient() {
  const { user, loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword, logout } =
    useAuth()
  const { data: cmsData } = useSummitData()
  const summitDates = cmsData?.siteConfig?.summitDates || 'September 26–27, 2026'

  const [view, setView] = useState<'catalog' | 'checkout' | 'success' | 'passes' | 'auth'>('catalog')
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [selectedPassId, setSelectedPassId] = useState('student')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [eventsList, setEventsList] = useState<EventItem[]>(MASTER_EVENTS)
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(['ev-1', 'ev-2', 'ev-5'])
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>([])
  const [currentBadge, setCurrentBadge] = useState<RegistrationRecord | null>(null)
  const [editingPass, setEditingPass] = useState<RegistrationRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Enforce Step 1: Google Auth Gate if not logged in
  useEffect(() => {
    if (mounted && !user && (view === 'catalog' || view === 'checkout')) {
      setView('auth')
    }
  }, [mounted, user, view])

  // Fetch real events dynamically from MongoDB CMS API with MASTER_EVENTS fallback
  useEffect(() => {
    const loadCmsEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
        const res = await fetch(`${apiUrl}/events`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setEventsList(
              data.map((item: any, idx: number) => ({
                id: item.id || `ev-${idx + 1}`,
                number: item.number || String(idx + 1).padStart(2, '0'),
                title: item.title || item.name || 'Summit Event',
                category: item.category || 'Conference Event',
                eyebrow: item.eyebrow || item.badge || 'SUMMIT TRACK',
                image: item.image || '/gallery/pec_pitch_table.png',
                purpose: item.purpose || item.description || item.desc || '',
                delivery: item.delivery || '',
                expectedParticipation: item.expectedParticipation || '',
                tags: Array.isArray(item.tags) ? item.tags : [],
                partner: item.partner || '',
              }))
            )
          }
        }
      } catch {
        // Fallback gracefully to MASTER_EVENTS
      }
    }
    loadCmsEvents()
  }, [])

  // Promo Code
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)

  // Auth Inputs
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')

  // Form Inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    teamName: '',
    gradYear: '2026',
    referralCode: '',
  })

  // Pre-fill form when user logs in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: user.email || prev.email || '',
      }))
    }
  }, [user])

  const fetchRegistrations = useCallback(async () => {
    const records = await getUserRegistrations(user?.uid, user?.email || undefined)
    setMyRegistrations(records)
  }, [user])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const selectedTier = PASS_TIERS.find((p) => p.id === selectedPassId) || PASS_TIERS[0]
  const basePrice = selectedTier.fee
  const discountAmount = Math.round((basePrice * discountPercent) / 100)
  const finalPrice = Math.max(0, basePrice - discountAmount)

  const handlePassChange = (newPassId: string) => {
    setSelectedPassId(newPassId)
    const tier = PASS_TIERS.find((p) => p.id === newPassId)
    if (tier?.defaultEventId && !selectedEventIds.includes(tier.defaultEventId)) {
      setSelectedEventIds((prev) => [...prev, tier.defaultEventId!])
    }
  }

  const toggleEvent = (id: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleTrack = (track: string) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    )
  }

  // Filter events based on active category & search query
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev) => {
      const matchesSearch =
        !searchQuery.trim() ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      if (!matchesSearch) return false

      if (activeCategory === 'all') return true
      const cat = (ev.category + ' ' + ev.eyebrow + ' ' + ev.title).toLowerCase()
      if (activeCategory === 'hackathon') return cat.includes('hack') || cat.includes('code') || cat.includes('tech')
      if (activeCategory === 'pitch') return cat.includes('pitch') || cat.includes('startup') || cat.includes('ignite')
      if (activeCategory === 'finance') return cat.includes('auction') || cat.includes('finance') || cat.includes('ipl')
      if (activeCategory === 'workshops') return cat.includes('conclave') || cat.includes('workshop') || cat.includes('internship') || cat.includes('hunt')
      return true
    })
  }, [eventsList, activeCategory, searchQuery])

  // Apply Coupon
  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase()
    if (!code) {
      toast.error('Please enter a coupon code.', TOAST_STYLE)
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const res = await fetch(`${apiUrl}/payments/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, passType: selectedPassId }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.valid) {
          setDiscountPercent(data.discountPercent)
          toast.success(`Coupon applied: ${data.discountPercent}% discount!`, TOAST_STYLE)
          return
        }
      }
    } catch {
      // Fallback local coupon check
    }

    if (code === 'EARLYBIRD' || code === 'PECFAM' || code === 'FREEPASS') {
      setDiscountPercent(100)
      toast.success('Coupon Applied: 100% Discount!', TOAST_STYLE)
    } else if (code === 'STUDENT50') {
      setDiscountPercent(50)
      toast.success('Coupon Applied: 50% Discount!', TOAST_STYLE)
    } else if (code === 'SUMMIT20') {
      setDiscountPercent(20)
      toast.success('Coupon Applied: 20% Discount!', TOAST_STYLE)
    } else {
      toast.error('Invalid or expired coupon code.', TOAST_STYLE)
    }
  }

  // Handle proceed to checkout
  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in with Google to continue.', TOAST_STYLE)
      setView('auth')
      return
    }
    if (!formData.name.trim()) {
      toast.error('Please enter your full name.', TOAST_STYLE)
      return
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address.', TOAST_STYLE)
      return
    }
    setView('checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Complete Order
  const handleCompleteOrder = async () => {
    setIsSubmitting(true)
    const toastId = toast.loading('Securing your pass...', TOAST_STYLE)

    try {
      // If payment required (amount > 0)
      if (finalPrice > 0) {
        let orderData = { id: `order_${Date.now()}`, key_id: 'rzp_test_placeholder' }
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
          const orderRes = await fetch(`${apiUrl}/payments/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: finalPrice,
              passType: selectedPassId,
              email: formData.email,
              name: formData.name,
            }),
          })
          if (orderRes.ok) {
            orderData = await orderRes.json()
          }
        } catch {
          // Demo fallback
        }

        const isScriptLoaded = await new Promise<boolean>((resolve) => {
          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            resolve(true)
            return
          }
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })

        if (!isScriptLoaded || !(window as any).Razorpay) {
          toast.dismiss(toastId)
          await finalizeSuccessfulBooking('DEMO_TXN_' + Date.now())
          return
        }

        const options = {
          key: orderData.key_id || 'rzp_test_51MockKey',
          amount: finalPrice * 100,
          currency: 'INR',
          name: 'PEC E-Summit 2026',
          description: `${selectedTier.title} - Official Pass`,
          image: '/eic-logo.png',
          order_id: orderData.id.startsWith('order_') ? undefined : orderData.id,
          handler: async function (response: any) {
            await finalizeSuccessfulBooking(response.razorpay_payment_id || `txn_${Date.now()}`)
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone || '',
          },
          theme: {
            color: '#B5F23D',
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false)
              toast.dismiss(toastId)
              toast.error('Payment cancelled.', TOAST_STYLE)
            },
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
        toast.dismiss(toastId)
        return
      }

      // Free Pass
      await finalizeSuccessfulBooking(undefined)
      toast.dismiss(toastId)
    } catch (err) {
      console.error(err)
      toast.dismiss(toastId)
      toast.error('Booking failed. Please try again.', TOAST_STYLE)
      setIsSubmitting(false)
    }
  }

  const finalizeSuccessfulBooking = async (paymentId?: string) => {
    try {
      const selectedEventTitles = eventsList
        .filter((ev) => selectedEventIds.includes(ev.id))
        .map((ev) => ev.title)

      const record = await createRegistrationRecord({
        userId: user?.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college || 'PEC Chandigarh',
        category: selectedTier.title,
        tracks: selectedTracks.length > 0 ? selectedTracks : [selectedTier.title],
        selectedEvents: selectedEventTitles,
        amountPaid: finalPrice,
        paymentStatus: finalPrice === 0 ? 'FREE' : 'PAID',
        paymentId,
        teamName: formData.teamName,
      })

      setCurrentBadge(record)
      await fetchRegistrations()
      setView('success')
      toast.success('Your pass is confirmed!', TOAST_STYLE)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to save booking.', TOAST_STYLE)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)

    if (authMode === 'forgot') {
      const res = await resetPassword(authEmail)
      setAuthLoading(false)
      if (res.success) {
        toast.success('Password reset link sent to your email!', TOAST_STYLE)
        setAuthMode('login')
      } else {
        toast.error(res.error || 'Failed to send reset link.', TOAST_STYLE)
      }
      return
    }

    if (authMode === 'signup') {
      const res = await registerWithEmail(authEmail, authPassword, authName)
      setAuthLoading(false)
      if (res.success) {
        toast.success('Account created successfully!', TOAST_STYLE)
        setView('catalog')
      } else {
        toast.error(res.error || 'Failed to create account.', TOAST_STYLE)
      }
      return
    }

    // Login
    const res = await loginWithEmail(authEmail, authPassword)
    setAuthLoading(false)
    if (res.success) {
      toast.success('Welcome back!', TOAST_STYLE)
      setView('catalog')
    } else {
      toast.error(res.error || 'Invalid credentials.', TOAST_STYLE)
    }
  }

  const handleGoogleSignIn = async () => {
    setAuthLoading(true)
    const res = await loginWithGoogle()
    setAuthLoading(false)
    if (res.success) {
      toast.success('Signed in with Google!', TOAST_STYLE)
      setView('catalog')
    } else {
      toast.error(res.error || 'Google sign-in failed.', TOAST_STYLE)
    }
  }

  // Delete Pass
  const handleDeletePass = async (ticketId: string) => {
    if (!window.confirm('Are you sure you want to cancel this pass?')) {
      return
    }

    try {
      await deleteRegistrationRecord(ticketId)
      if (currentBadge?.id === ticketId) {
        setCurrentBadge(null)
      }
      await fetchRegistrations()
      toast.success('Booking cancelled.', TOAST_STYLE)
    } catch {
      toast.error('Failed to cancel booking.', TOAST_STYLE)
    }
  }

  // Instagram Story Badge Export
  const handleExportInstagramStory = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1920)
    bgGradient.addColorStop(0, '#0B1410')
    bgGradient.addColorStop(0.5, '#13221C')
    bgGradient.addColorStop(1, '#070A09')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, 1080, 1920)

    ctx.textAlign = 'center'
    ctx.fillStyle = '#B5F23D'
    ctx.font = 'bold 36px monospace'
    ctx.fillText('PEC E-SUMMIT 2026', 540, 220)

    ctx.fillStyle = '#FAFAFA'
    ctx.font = '900 84px sans-serif'
    ctx.fillText('OFFICIAL SUMMIT', 540, 320)

    ctx.fillStyle = '#B5F23D'
    ctx.font = '900 84px sans-serif'
    ctx.fillText('ENTRY PASS', 540, 410)

    const cardX = 100
    const cardY = 490
    const cardW = 880
    const cardH = 1080

    ctx.save()
    ctx.beginPath()
    ctx.rect(cardX, cardY, cardW, cardH)
    ctx.fillStyle = '#13221C'
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(181, 242, 61, 0.3)'
    ctx.stroke()
    ctx.restore()

    const categoryText = currentBadge?.category || 'SUMMIT PASS'
    ctx.fillStyle = 'rgba(181, 242, 61, 0.15)'
    ctx.beginPath()
    ctx.rect(540 - 180, cardY + 60, 360, 60)
    ctx.fill()
    ctx.strokeStyle = '#B5F23D'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = '#B5F23D'
    ctx.font = 'bold 26px monospace'
    ctx.fillText(categoryText.toUpperCase(), 540, cardY + 100)

    const nameText = (currentBadge?.name || formData.name || 'ATTENDEE NAME').toUpperCase()
    ctx.fillStyle = '#FAFAFA'
    ctx.font = '900 68px sans-serif'
    ctx.fillText(nameText, 540, cardY + 230)

    const collegeText = (
      currentBadge?.college ||
      formData.college ||
      'PUNJAB ENGINEERING COLLEGE'
    ).toUpperCase()
    ctx.fillStyle = '#94A3B8'
    ctx.font = 'bold 28px monospace'
    ctx.fillText(collegeText, 540, cardY + 290)

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(160, cardY + 340)
    ctx.lineTo(920, cardY + 340)
    ctx.stroke()

    const finishAndDownload = () => {
      const ticketId = currentBadge?.id || 'PEC-000000'
      ctx.fillStyle = '#B5F23D'
      ctx.font = 'bold 32px monospace'
      ctx.fillText(ticketId, 540, cardY + 760)

      ctx.fillStyle = '#FAFAFA'
      ctx.font = 'bold 28px sans-serif'
      ctx.fillText(`${summitDates.toUpperCase()}  •  PEC CHANDIGARH`, 540, cardY + 840)

      ctx.fillStyle = '#B5F23D'
      ctx.font = 'bold 32px sans-serif'
      ctx.fillText("I'M ATTENDING PEC E-SUMMIT '26!", 540, 1680)

      ctx.fillStyle = '#94A3B8'
      ctx.font = 'bold 24px monospace'
      ctx.fillText('JOIN ME AT ESUMMIT.PEC.AC.IN', 540, 1740)

      const link = document.createElement('a')
      link.download = `PEC_Summit_Story_${(currentBadge?.name || 'Attendee').replace(
        /\s+/g,
        '_'
      )}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('Instagram Story Badge Downloaded!', TOAST_STYLE)
    }

    const drawAndExport = (qrDataUrl?: string) => {
      if (qrDataUrl && typeof window !== 'undefined') {
        const qrImg = new (window as any).Image()
        qrImg.onload = () => {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(540 - 160, cardY + 390, 320, 320)
          ctx.drawImage(qrImg, 540 - 140, cardY + 410, 280, 280)
          finishAndDownload()
        }
        qrImg.onerror = () => finishAndDownload()
        qrImg.crossOrigin = 'anonymous'
        qrImg.src = qrDataUrl
      } else {
        finishAndDownload()
      }
    }

    const qrSrc = currentBadge?.qrCodeData || ''
    drawAndExport(qrSrc)
  }

  return (
    <main className="min-h-screen bg-[#0B1410] text-[#E2E8F0] flex flex-col justify-between selection:bg-mint/30 selection:text-white font-body antialiased">
      <Toaster position="top-center" />

      {/* ── TOP HEADER / MINIMALIST NAVIGATION ── */}
      <header className="w-full border-b border-white/[0.08] bg-[#0B1410]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group shrink-0 whitespace-nowrap"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-neutral-400 shrink-0" />
            <span className="hidden sm:inline">Back to E-Summit &apos;26</span>
            <span className="sm:hidden text-xs">Back</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {!mounted ? (
              <div className="w-16 h-7" />
            ) : user ? (
              <div className="flex items-center gap-1.5 bg-[#13221C] border border-white/10 rounded-md px-2 py-1 text-xs text-neutral-300">
                <span className="font-medium max-w-[80px] sm:max-w-[120px] truncate text-neutral-200 text-[11px] sm:text-xs">
                  {user.displayName || user.email?.split('@')[0]}
                </span>

                <button
                  type="button"
                  onClick={() => setView(view === 'passes' ? 'catalog' : 'passes')}
                  className={`px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
                    view === 'passes'
                      ? 'bg-mint text-void font-bold'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <Ticket size={11} className="shrink-0" />
                  <span className="hidden sm:inline">My Passes</span>
                  <span>({myRegistrations.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  title="Sign Out"
                  className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-400 hover:text-red-300 transition-all shrink-0 whitespace-nowrap"
                >
                  <LogOut size={12} className="shrink-0" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setView('auth')
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition-all shrink-0 whitespace-nowrap"
              >
                <LogIn size={13} className="text-mint shrink-0" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── BODY CONTENT ── */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 relative z-10">
        <AnimatePresence mode="wait">
          {/* ══════════════════════════════════════════════════════════════
              VIEW: AUTH (LOGIN / SIGNUP / FORGOT PASSWORD)
          ══════════════════════════════════════════════════════════════ */}
          {view === 'auth' && (
            <motion.div
              key="auth-view"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="max-w-sm mx-auto space-y-5 pt-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-[10px] font-bold tracking-wider uppercase font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
                  Step 1 of 2: Sign In
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {authMode === 'login' && 'Sign in to PEC E-Summit'}
                  {authMode === 'signup' && 'Create Attendee Account'}
                  {authMode === 'forgot' && 'Reset Password'}
                </h1>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  {authMode === 'login' && 'Sign in with Google to claim, personalize, and link your official summit pass.'}
                  {authMode === 'signup' && 'Register your account to book passes and unlock hackathon tracks.'}
                  {authMode === 'forgot' && 'Enter your email to receive a password reset link.'}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#13221C] p-5 space-y-3.5">
                {/* Google Sign-in option */}
                {authMode !== 'forgot' && (
                  <>
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={handleGoogleSignIn}
                      className="w-full py-2 px-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <div className="flex items-center gap-2 py-0.5">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold font-mono">
                        or
                      </span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                  </>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="block text-[11px] font-medium text-neutral-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="Aryan Sharma"
                        className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[11px] font-medium text-neutral-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@college.edu or gmail.com"
                      className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                    />
                  </div>

                  {authMode !== 'forgot' && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          Password
                        </label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            onClick={() => setAuthMode('forgot')}
                            className="text-[10px] text-neutral-400 hover:text-white"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2 rounded-md bg-mint hover:bg-white text-void text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1"
                  >
                    {authLoading ? (
                      <span>Loading...</span>
                    ) : (
                      <span>
                        {authMode === 'login' && 'Sign In'}
                        {authMode === 'signup' && 'Create Account'}
                        {authMode === 'forgot' && 'Send Reset Link'}
                      </span>
                    )}
                  </button>
                </form>

                <div className="pt-2 border-t border-white/10 text-center text-xs text-neutral-400">
                  {authMode === 'login' && (
                    <p>
                      Don&apos;t have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className="text-mint font-semibold hover:underline"
                      >
                        Sign Up
                      </button>
                    </p>
                  )}
                  {authMode === 'signup' && (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setAuthMode('login')}
                        className="text-mint font-semibold hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                  {authMode === 'forgot' && (
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-neutral-300 hover:text-white text-xs"
                    >
                      &larr; Back to sign in
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setView('catalog')}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Continue to pass booking &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: STEP 1 - COMPACT PROFESSIONAL PASS CATALOG
          ══════════════════════════════════════════════════════════════ */}
          {view === 'catalog' && (
            <motion.div
              key="catalog-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Header Info */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#13221C] border border-white/10 text-[11px] font-medium text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                  <span>{summitDates} • PEC Chandigarh</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Get Your Summit Pass
                </h1>
                <p className="text-xs text-neutral-400 max-w-xl">
                  Choose your pass tier, select your event tracks, and complete your registration in under 2 minutes.
                </p>
              </div>

              <form onSubmit={handleProceedToCheckout} className="space-y-6">
                {/* ── 1. Pass Tier Selection Cards ── */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-white/10 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                        1
                      </span>
                      <span>Choose Your Ticket Tier</span>
                    </h2>
                    <span className="text-[11px] text-neutral-500">All passes include summit ID &amp; kit</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {PASS_TIERS.map((tier) => {
                      const isSelected = selectedPassId === tier.id

                      return (
                        <div
                          key={tier.id}
                          onClick={() => handlePassChange(tier.id)}
                          className={`relative cursor-pointer rounded-lg border p-3.5 transition-all flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'border-mint bg-[#182A23] shadow-sm'
                              : 'border-white/10 bg-[#13221C] hover:border-white/20 hover:bg-[#182A23]'
                          }`}
                        >
                          {tier.popular && (
                            <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-mint text-void text-[9px] font-bold uppercase tracking-wider">
                              Popular
                            </span>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                                {tier.tagline}
                              </span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'border-mint bg-mint text-void'
                                    : 'border-white/20'
                                }`}
                              >
                                {isSelected && <Check size={10} strokeWidth={3} />}
                              </div>
                            </div>

                            <h3 className="text-sm font-bold text-white leading-snug">
                              {tier.title}
                            </h3>

                            <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                              {tier.desc}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                            <span className="text-[10px] text-neutral-500">Registration Fee</span>
                            <span
                              className={`text-sm font-bold font-mono ${
                                tier.fee === 0 ? 'text-mint' : 'text-white'
                              }`}
                            >
                              {tier.fee === 0 ? 'FREE' : tier.feeLabel}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ── 2. Contact Details ── */}
                <div className="space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-white/10 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                      2
                    </span>
                    <span>Your Contact Details</span>
                  </h2>

                  <div className="rounded-lg border border-white/10 bg-[#13221C] p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          Full Name <span className="text-mint">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Aryan Sharma"
                          className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          Email Address <span className="text-mint">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. aryan@college.edu or gmail.com"
                          className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          WhatsApp / Contact Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          College / Institute
                        </label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="Punjab Engineering College, Chandigarh"
                          className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          Graduation Year
                        </label>
                        <select
                          value={formData.gradYear}
                          onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                          className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white outline-none focus:border-mint transition-colors"
                        >
                          <option value="2026">Class of 2026</option>
                          <option value="2027">Class of 2027</option>
                          <option value="2028">Class of 2028</option>
                          <option value="2029">Class of 2029</option>
                          <option value="Alumni">Alumni / Professional</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-medium text-neutral-300">
                          Referral / CA Code
                        </label>
                        <input
                          type="text"
                          value={formData.referralCode}
                          onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                          placeholder="e.g. PEC-CA-102"
                          className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-2 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-mint transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 3. Tracks & Interests (Optional) ── */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-white/10 text-white text-[10px] flex items-center justify-center font-mono font-bold">
                        3
                      </span>
                      <span>Topics You Care About</span>
                    </h2>
                    <span className="text-[11px] text-neutral-500 font-mono">Optional</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {INTEREST_TRACKS.map((track) => {
                      const isSelected = selectedTracks.includes(track)
                      return (
                        <button
                          type="button"
                          key={track}
                          onClick={() => toggleTrack(track)}
                          className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                            isSelected
                              ? 'border-mint bg-mint/10 text-mint font-medium'
                              : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span>{track}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── STICKY COMPACT BOTTOM ACTION BAR ── */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1410]/95 backdrop-blur-md border-t border-white/10 py-3 shadow-2xl">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[11px] text-neutral-400 block">
                          Selected: <span className="text-white font-semibold">{selectedTier.title}</span>
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-neutral-500">Total:</span>
                          <span className="font-mono text-sm sm:text-base font-bold text-mint">
                            {basePrice === 0 ? 'FREE' : `₹${basePrice}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-md bg-mint hover:bg-white text-void text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm active:scale-98"
                    >
                      <span>Continue to Summary</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: STEP 2 - CHECKOUT & PAYMENT PAGE
          ══════════════════════════════════════════════════════════════ */}
          {view === 'checkout' && (
            <motion.div
              key="checkout-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-5 max-w-4xl mx-auto pt-2"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Confirm Your Registration
                  </h1>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Review your pass details and complete booking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('catalog')}
                  className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 transition-colors"
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
                        <h3 className="text-sm font-bold text-white">
                          {selectedTier.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">{selectedTier.desc}</p>
                      </div>
                      <span className="text-xs font-bold text-mint font-mono px-2 py-0.5 rounded bg-mint/10 border border-mint/20 shrink-0 ml-3">
                        {selectedTier.fee === 0 ? 'FREE' : `₹${selectedTier.fee}`}
                      </span>
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
                        <span className="text-neutral-300 font-medium">{formData.college || 'PEC Chandigarh'}</span>
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
                  <div className="rounded-lg border border-white/10 bg-[#13221C] p-4 space-y-3.5 sticky top-20">
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
                            className="w-full rounded-md border border-white/10 bg-[#0B1410] px-2.5 py-1.5 pl-7 text-xs text-white uppercase outline-none focus:border-mint font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/15 text-xs font-semibold uppercase transition-colors shrink-0"
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
                      className="w-full py-2.5 rounded-md bg-mint hover:bg-white text-void text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
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
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: SUCCESS / ISSUED E-BADGE
          ══════════════════════════════════════════════════════════════ */}
          {view === 'success' && currentBadge && (
            <motion.div
              key="success-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-5 max-w-md mx-auto pt-4"
            >
              <div className="text-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-mint/10 border border-mint/30 text-mint mx-auto flex items-center justify-center">
                  <CheckCircle2 size={18} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Your Pass is Confirmed!
                </h2>
                <p className="text-xs text-neutral-400">
                  Save your entry pass or show your QR code at the registration desk.
                </p>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="rounded-lg border border-white/15 bg-[#13221C] p-4 relative space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="bg-mint text-void p-1 rounded font-bold">
                      <Ticket size={13} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">
                        PEC E-SUMMIT 2026
                      </span>
                      <span className="block text-[10px] text-neutral-400">
                        {summitDates} • PEC Chandigarh
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-mint/10 border border-mint/20 text-[10px] font-semibold text-mint">
                    {currentBadge.category}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-mono">
                        Attendee Name
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {currentBadge.name}
                      </h3>
                    </div>

                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-mono">
                        College / Institution
                      </span>
                      <p className="text-xs text-neutral-300 mt-0.5">{currentBadge.college}</p>
                    </div>

                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-mono">
                        Ticket ID
                      </span>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-xs font-bold text-mint">
                        {currentBadge.id}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-md shrink-0 flex flex-col items-center">
                    <Image
                      src={currentBadge.qrCodeData}
                      alt="Check-in QR"
                      width={90}
                      height={90}
                      className="w-20 h-20 object-contain mix-blend-multiply"
                      unoptimized
                    />
                    <span className="text-[8px] text-neutral-800 font-bold uppercase mt-0.5 font-mono">
                      Entry QR
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportInstagramStory}
                  className="py-2 px-3 rounded-md bg-mint hover:bg-white text-void text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} />
                  <span>Story Badge</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 px-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Print Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingPass(currentBadge)}
                  className="py-2 px-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={12} />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setView('passes')}
                  className="py-2 px-3 rounded-md border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Ticket size={12} />
                  <span>My Passes ({myRegistrations.length})</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              VIEW: MY PASSES & BOOKINGS (READ, UPDATE, DELETE)
          ══════════════════════════════════════════════════════════════ */}
          {view === 'passes' && (
            <motion.div
              key="passes-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Your Passes &amp; Tickets</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    View, download, or edit your summit passes anytime.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setView('catalog')}
                  className="px-3.5 py-1.5 rounded-md bg-mint hover:bg-white text-void text-xs font-bold transition-colors"
                >
                  + Book Another Pass
                </button>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="text-center py-14 border border-dashed border-white/10 rounded-lg p-6 bg-white/[0.01]">
                  <Ticket size={32} className="mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs text-neutral-400">You haven&apos;t booked any passes yet.</p>
                  <button
                    type="button"
                    onClick={() => setView('catalog')}
                    className="mt-2 text-xs font-semibold text-mint hover:underline uppercase tracking-wider font-mono"
                  >
                    Get your pass now &rarr;
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {myRegistrations.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-white/10 bg-[#13221C] p-4 flex flex-col justify-between gap-3 hover:border-white/20 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-mint/10 text-mint font-semibold font-mono">
                            {item.category}
                          </span>
                          <span className="font-mono text-xs text-neutral-400 font-bold">{item.id}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <p className="text-xs text-neutral-400 truncate">{item.college}</p>
                        {item.selectedEvents && item.selectedEvents.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedEvents.map((ev) => (
                              <span
                                key={ev}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 font-mono"
                              >
                                {ev}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                        <span className="text-neutral-500 font-mono text-[11px]">
                          {item.paymentStatus === 'PAID' ? `PAID: ₹${item.amountPaid || 0}` : 'FREE ENTRY'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentBadge(item)
                              setView('success')
                            }}
                            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
                          >
                            View Ticket
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPass(item)}
                            className="p-1 rounded border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white"
                            title="Edit Details"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePass(item.id)}
                            className="p-1 rounded border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400"
                            title="Cancel Booking"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── EDIT PASS MODAL ── */}
      <AnimatePresence>
        {editingPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-lg border border-white/15 bg-[#13221C] p-5 shadow-2xl space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 className="text-sm font-bold text-white">Edit Pass Details</h3>
                <button
                  type="button"
                  onClick={() => setEditingPass(null)}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10"
                >
                  <X size={15} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingPass) return
                  setIsSubmitting(true)
                  try {
                    await updateRegistrationRecord(editingPass.id, {
                      name: editingPass.name,
                      phone: editingPass.phone,
                      college: editingPass.college,
                    })
                    await fetchRegistrations()
                    if (currentBadge?.id === editingPass.id) {
                      setCurrentBadge({ ...currentBadge, ...editingPass })
                    }
                    setEditingPass(null)
                    toast.success('Pass updated successfully!', TOAST_STYLE)
                  } catch {
                    toast.error('Failed to update pass.', TOAST_STYLE)
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-300">Name</label>
                  <input
                    type="text"
                    required
                    value={editingPass.name}
                    onChange={(e) => setEditingPass({ ...editingPass, name: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-1.5 text-xs text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-300">College / Institution</label>
                  <input
                    type="text"
                    value={editingPass.college}
                    onChange={(e) => setEditingPass({ ...editingPass, college: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-1.5 text-xs text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-neutral-300">Phone</label>
                  <input
                    type="tel"
                    value={editingPass.phone || ''}
                    onChange={(e) => setEditingPass({ ...editingPass, phone: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-[#0B1410] px-3 py-1.5 text-xs text-white outline-none focus:border-mint"
                  />
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPass(null)}
                    className="px-3 py-1.5 rounded-md border border-white/10 text-neutral-400 hover:text-white text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 rounded-md bg-mint hover:bg-white text-void text-xs font-bold shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.08] py-4 text-center text-xs text-neutral-500 font-mono">
        PEC Entrepreneurship &amp; Incubation Cell • Sector 12, Chandigarh
      </footer>
    </main>
  )
}
