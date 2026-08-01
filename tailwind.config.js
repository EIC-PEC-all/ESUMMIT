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
        void: '#0D1110',          // deep dark void
        panel: '#161F1B',         // dark green surface panel
        green: '#1E4637',         // official logo forest green
        orange: '#FF9900',        // official logo vibrant orange-amber
        amber: '#FF9900',         // alias for vibrant orange
        volt: '#FF9900',          // alias for vibrant orange
        silver: '#E5E7EB',        // high-shine silver metallic
        'silver-dim': '#9CA3AF',  // muted silver slate
        'orange-dim': '#B36B00',  // muted orange border
        'volt-dim': '#B36B00',    // muted orange border alias
        primary: '#F9FAF6',       // cream off-white text
        muted: '#7C8E85',         // sage slate muted text
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee2': 'marquee2 30s linear infinite',
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
      },
    },
  },
  plugins: [],
}
