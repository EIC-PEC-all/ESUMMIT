'use client'

import React from 'react'
import FlipFlopTransition from './FlipFlopTransition'

interface PageFlipTransitionWrapperProps {
  children?: React.ReactNode
}

export default function PageFlipTransitionWrapper({
  children,
}: PageFlipTransitionWrapperProps) {
  return (
    <>
      <FlipFlopTransition />
      {children}
    </>
  )
}

export { FlipFlopTransition }
