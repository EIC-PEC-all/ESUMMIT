'use client'
// components/ui/RegisterButton.tsx
// E-Summit green CTA pill button — volt green gradient, dark text, glow shadow

interface RegisterButtonProps {
  href?: string
  label?: string
  className?: string
}

export default function RegisterButton({
  href = '/register',
  label = 'Register Now',
  className = '',
}: RegisterButtonProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center rounded-full font-bold uppercase tracking-widest cursor-pointer transition-all duration-200
        px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
        text-xs sm:text-sm md:text-base
        font-kanit
        ${className}`}
      style={{
        background: 'linear-gradient(135deg, #7ED321 0%, #4C9E0D 100%)',
        color: '#070B08',
        boxShadow: '0 0 24px rgba(126, 211, 33, 0.5), 0 4px 16px rgba(126, 211, 33, 0.3)',
        fontFamily: "'Kanit', sans-serif",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(126, 211, 33, 0.7), 0 4px 24px rgba(126, 211, 33, 0.5)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(126, 211, 33, 0.5), 0 4px 16px rgba(126, 211, 33, 0.3)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {label}
    </a>
  )
}
