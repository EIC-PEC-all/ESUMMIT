// components/Common/LimeEdgeMasks.tsx
'use client'

import React from 'react'

export default function LimeEdgeMasks() {
  return (
    <>
      {/* Top Boundary-to-Center Black Tinted Linear Edge Mask */}
      <div
        className="fixed top-0 left-0 right-0 z-30 h-28 sm:h-36 pointer-events-none select-none transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(to bottom, rgba(4, 6, 5, 0.95) 0%, rgba(4, 6, 5, 0.5) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom Boundary-to-Center Black Tinted Linear Edge Mask */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 h-28 sm:h-36 pointer-events-none select-none transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(to top, rgba(4, 6, 5, 0.95) 0%, rgba(4, 6, 5, 0.5) 50%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}

