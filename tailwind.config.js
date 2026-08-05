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
        void: '#070B08',          // deep dark background from EIC
        panel: '#0D140E',         // dark green surface panel from EIC
        'panel-alt': '#111A12',   // slightly lighter panel surface from EIC
        green: '#50E3C2',         // electric emerald brand accent from EIC
        mint: '#50E3C2',          // mint emerald alias
        amber: '#E8A33D',         // secondary accent amber from EIC
        orange: '#E8A33D',        // orange alias
        volt: '#50E3C2',          // brand accent alias
        silver: '#E5E7EB',        // high-shine silver metallic
        'silver-dim': '#9CA3AF',  // muted silver slate
        'green-dim': 'rgba(80, 227, 194, 0.15)',
        primary: '#F5F5F0',       // cream off-white text from EIC
        muted: '#8A9488',         // sage slate muted text from EIC
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 12s linear infinite',
        'marquee2': 'marquee2 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
