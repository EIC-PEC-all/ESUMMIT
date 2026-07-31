/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0A',        // warm near-black void
        panel: '#151515',       // card/panel surface
        volt: '#F5D400',        // electric yellow primary accent (<15% surface area)
        'volt-dim': '#8A7600',   // muted yellow-brown border/secondary
        primary: '#F2F2ED',     // warm off-white text
        muted: '#8C8C86',       // slate muted text
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee2': 'marquee2 30s linear infinite',
        'flip-in': 'flipIn 0.4s ease forwards',
        'pulse-volt': 'pulseVolt 2.5s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        flipIn: {
          '0%': { transform: 'rotateX(90deg)', opacity: '0' },
          '100%': { transform: 'rotateX(0deg)', opacity: '1' },
        },
        pulseVolt: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(245,212,0,0.25)' },
          '50%': { boxShadow: '0 0 32px rgba(245,212,0,0.65)' },
        },
      },
    },
  },
  plugins: [],
}
