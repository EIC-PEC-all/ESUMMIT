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
        // Neon Cyber-Finance Core Palette (CSS Variable Backed)
        void: 'var(--bg-void)',
        panel: 'var(--bg-panel)',
        'panel-alt': 'var(--bg-panel-alt)',
        
        // Accents
        mint: 'var(--accent-mint)',
        green: 'var(--accent-green)',
        volt: 'var(--accent-green)',
        blue: 'var(--accent-blue)',
        coral: 'var(--accent-coral)',
        orange: 'var(--accent-coral)',
        amber: 'var(--accent-coral)',
        
        // Neutrals & Effects
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        'green-dim': 'var(--accent-green-dim)',
        'border-subtle': 'var(--border-subtle)',
        'border-panel': 'var(--border-panel)',
        'border-glow': 'var(--border-glow)',
      },
      borderColor: {
        DEFAULT: 'var(--border-subtle)',
        subtle: 'var(--border-subtle)',
        panel: 'var(--border-panel)',
        glow: 'var(--border-glow)',
      },
      fontFamily: {
        display: ['Kanit', 'var(--font-kanit)', 'sans-serif'],
        kanit: ['Kanit', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        'mono-data': ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 32s linear infinite',
        'marquee2': 'marquee2 32s linear infinite',
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
