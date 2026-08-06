'use client'

import React from 'react'

export default function VerticalGalleryBg() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-void">
      {/* Background Image: Theme responsive 500 Rupee wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 [.light_&]:mix-blend-multiply [.light_&]:opacity-30"
        style={{ backgroundImage: 'url("/rupee-bg.jpg")' }}
      />
      
      {/* Light Mode Whitish Overlay */}
      <div className="hidden [.light_&]:block absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95 pointer-events-none z-[1]" />

      {/* Subtle radial scrim for hero text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void pointer-events-none z-[2]" />
    </div>
  )
}
