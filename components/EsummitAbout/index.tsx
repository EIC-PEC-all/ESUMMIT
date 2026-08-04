'use client'
// components/EsummitAbout/index.tsx
// About section — dark green #111A12 background, volt-green word-reveal animation,
// 4 decorative 3D corner images, green gradient heading, RegisterButton CTA.

import FadeIn from '@/components/ui/FadeIn'
import AnimatedText from '@/components/ui/AnimatedText'
import RegisterButton from '@/components/ui/RegisterButton'

const ABOUT_TEXT =
  'PEC E-Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, bringing together 3,000+ student founders, seasoned venture capitalists, and industry leaders. From high-stakes pitching to overnight hackathons and exclusive VIP investor networking — it is North India\'s premier launchpad where ideas raise capital and compound into impact. Join us March 15–16, 2026.'

const CORNER_IMAGES = [
  {
    key: 'moon',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    alt: 'Moon icon',
    className: 'absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    fadeProps: { delay: 0.1, x: -80, y: 0, duration: 0.9 },
  },
  {
    key: 'p59',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    alt: '3D object',
    className: 'absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]',
    fadeProps: { delay: 0.25, x: -80, y: 0, duration: 0.9 },
  },
  {
    key: 'lego',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    alt: 'Lego icon',
    className: 'absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]',
    fadeProps: { delay: 0.15, x: 80, y: 0, duration: 0.9 },
  },
  {
    key: 'group',
    src: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    alt: '3D group',
    className: 'absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]',
    fadeProps: { delay: 0.3, x: 80, y: 0, duration: 0.9 },
  },
]

export default function EsummitAbout() {
  return (
    <section
      id="esummit-about"
      className="esummit-section relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
      style={{ background: '#0D140E', fontFamily: "'Kanit', sans-serif" }}
      aria-labelledby="esummit-about-heading"
    >
      {/* Decorative radial green glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(126,211,33,0.06) 0%, transparent 65%)' }}
      />

      {/* Green top divider line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.5) 50%, transparent)' }}
      />

      {/* ── Decorative 3D corner images ── */}
      {CORNER_IMAGES.map((img) => (
        <FadeIn
          key={img.key}
          className={img.className}
          x={img.fadeProps.x}
          y={img.fadeProps.y}
          delay={img.fadeProps.delay}
          duration={img.fadeProps.duration}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-auto object-contain pointer-events-none select-none"
            draggable={false}
          />
        </FadeIn>
      ))}

      {/* ── Central content ── */}
      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">

        {/* Eyebrow */}
        <FadeIn delay={0} y={-20}>
          <div className="flex items-center gap-2">
            <div className="h-px w-10 bg-[#7ED321]/60" />
            <span className="font-mono-data text-xs uppercase tracking-[0.25em] text-[#7ED321] font-bold">
              Official E-Cell PEC Platform
            </span>
            <div className="h-px w-10 bg-[#7ED321]/60" />
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.1} y={40}>
          <h2
            id="esummit-about-heading"
            className="hero-heading-green font-black uppercase leading-none tracking-tight text-center"
            style={{
              fontFamily: "'Kanit', sans-serif",
              fontSize: 'clamp(3rem, 12vw, 160px)',
            }}
          >
            About Us
          </h2>
        </FadeIn>

        {/* Text + CTA */}
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText
            text={ABOUT_TEXT}
            className="font-medium text-center leading-relaxed max-w-[560px]"
            style={{
              color: '#8A9488',
              fontFamily: "'Kanit', sans-serif",
              fontSize: 'clamp(1rem, 2vw, 1.35rem)',
            }}
          />

          <FadeIn delay={0.2}>
            <RegisterButton />
          </FadeIn>
        </div>
      </div>

      {/* Green bottom divider line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.5) 50%, transparent)' }}
      />
    </section>
  )
}
