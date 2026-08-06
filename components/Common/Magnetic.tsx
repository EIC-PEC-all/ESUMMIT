'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export default function Magnetic({ children }: { children: ReactNode; strength?: number; className?: string }) {
  return <>{children}</>
}
