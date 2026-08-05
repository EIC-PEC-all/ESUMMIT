'use client'

import React from 'react'

const IMAGES_COL_1 = [
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
]

const IMAGES_COL_2 = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
]

const IMAGES_COL_3 = [
  'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80',
]

const COLUMNS = [
  { images: IMAGES_COL_1, dir: 'up' },
  { images: IMAGES_COL_2, dir: 'down' },
  { images: IMAGES_COL_3, dir: 'up' },
  { images: IMAGES_COL_1, dir: 'down' },
  { images: IMAGES_COL_2, dir: 'up' },
  { images: IMAGES_COL_3, dir: 'down' },
  { images: IMAGES_COL_1, dir: 'up' },
  { images: IMAGES_COL_2, dir: 'down' },
]

export default function VerticalGalleryBg() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#070B08]">
      {/* 6-8 Vertical Lined Clean Image Blocks Grid */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 p-3 -top-[30%] -bottom-[30%] opacity-90 pointer-events-none select-none">
        {COLUMNS.map((col, colIdx) => (
          <div key={colIdx} className="relative overflow-hidden h-[160vh]">
            <div
              className={`flex flex-col gap-3 sm:gap-4 ${
                col.dir === 'up' ? 'animate-vertical-up' : 'animate-vertical-down'
              }`}
            >
              {[...col.images, ...col.images, ...col.images].map((imgSrc, i) => (
                <div
                  key={`${colIdx}-${i}`}
                  className="relative w-full rounded-2xl overflow-hidden min-h-[170px] sm:min-h-[220px] shadow-lg"
                >
                  <img
                    src={imgSrc}
                    alt="Sample gallery image"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightened Radial Vignette Overlay (Slight depth, full image clarity) */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(7, 11, 8, 0.05) 0%, rgba(7, 11, 8, 0.35) 60%, rgba(7, 11, 8, 0.85) 95%)',
        }}
      />
    </div>
  )
}
