'use client'

import React from 'react'
import FlipFlopTransition from './FlipFlopTransition'

interface PageFlipTransitionWrapperProps {
  children?: React.ReactNode
  slatCount?: number
}

export default function PageFlipTransitionWrapper({
  children,
  slatCount = 10,
}: PageFlipTransitionWrapperProps) {
  return (
    <>
      <FlipFlopTransition slatCount={slatCount} />
      {children}
    </>
  )
}

export { FlipFlopTransition }
