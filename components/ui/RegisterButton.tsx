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
        font-display bg-mint text-void shadow-md hover:brightness-110 hover:-translate-y-0.5
        ${className}`}
    >
      {label}
    </a>
  )
}
