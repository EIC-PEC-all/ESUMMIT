// components/Common/LimeEdgeMasks.tsx
'use client'

import React from 'react'

export default function LimeEdgeMasks() {
  return (
    <>
      {/* Top Boundary-to-Center Linear Edge Mask (Theme Adaptive) */}
      <div
        className="fixed top-0 left-0 right-0 z-30 h-24 sm:h-32 pointer-events-none select-none transition-all duration-300 edge-mask-top"
        aria-hidden="true"
      />

      {/* Bottom Boundary-to-Center Linear Edge Mask (Theme Adaptive) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 h-24 sm:h-32 pointer-events-none select-none transition-all duration-300 edge-mask-bottom"
        aria-hidden="true"
      />
    </>
  )
}

