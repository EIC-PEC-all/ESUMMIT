/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
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
        deep: 'var(--bg-deep)',
        panel: 'var(--bg-panel)',
        'panel-alt': 'var(--bg-panel-alt)',
        'section-1': 'var(--bg-section-1)',
        'section-2': 'var(--bg-section-2)',
        
        // Accents
        mint: 'var(--accent-mint)',
        green: 'var(--accent-green)',
        volt: 'var(--accent-green)',
        blue: 'var(--accent-blue)',
        purple: 'var(--accent-purple)',
        navy: 'var(--accent-navy)',
        coral: 'var(--accent-coral)',
        amber: 'var(--accent-amber)',
        cyan: 'var(--accent-cyan)',

        // Pass Tiers (Controlled via CSS variables)
        'tier-delegate': 'var(--tier-delegate)',
        'tier-allaccess': 'var(--tier-allaccess)',
        'tier-hackathon': 'var(--tier-hackathon)',
        'tier-combo': 'var(--tier-combo)',
        
        // Neutrals & Effects
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        'green-dim': 'var(--accent-green-dim)',
        'green-glow': 'var(--accent-green-glow)',
        'border-subtle': 'var(--border-subtle)',
        'border-panel': 'var(--border-panel)',
        'border-glow': 'var(--border-glow)',
        backdrop: 'var(--bg-backdrop)',
      },
      borderColor: {
        DEFAULT: 'var(--border-subtle)',
        subtle: 'var(--border-subtle)',
        panel: 'var(--border-panel)',
        glow: 'var(--border-glow)',
      },
      fontFamily: {
        display: ['var(--font-asimovian)', 'var(--font-kanit)', 'Asimovian', 'sans-serif'],
        asimovian: ['var(--font-asimovian)', 'Asimovian', 'sans-serif'],
        kanit: ['var(--font-asimovian)', 'Asimovian', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-marcellus)', 'var(--font-jetbrains)', 'Marcellus', 'serif'],
        'mono-data': ['var(--font-marcellus)', 'var(--font-jetbrains)', 'Marcellus', 'serif'],
        marcellus: ['var(--font-marcellus)', 'Marcellus', 'serif'],
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
