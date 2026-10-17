function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`
    }
    return `var(${variableName})`
  }
}

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
        // Neon Cyber-Finance Core Palette (CSS Variable Backed with full opacity support)
        void: withOpacity('--bg-void'),
        deep: withOpacity('--bg-deep'),
        panel: withOpacity('--bg-panel'),
        'panel-alt': withOpacity('--bg-panel-alt'),
        'section-1': withOpacity('--bg-section-1'),
        'section-2': withOpacity('--bg-section-2'),
        
        // Accents
        mint: withOpacity('--accent-mint'),
        green: withOpacity('--accent-green'),
        volt: withOpacity('--accent-green'),
        blue: withOpacity('--accent-blue'),
        purple: withOpacity('--accent-purple'),
        navy: withOpacity('--accent-navy'),
        coral: withOpacity('--accent-coral'),
        amber: withOpacity('--accent-amber'),
        cyan: withOpacity('--accent-cyan'),

        // Pass Tiers (Controlled via CSS variables)
        'tier-delegate': withOpacity('--tier-delegate'),
        'tier-allaccess': withOpacity('--tier-allaccess'),
        'tier-hackathon': withOpacity('--tier-hackathon'),
        'tier-combo': withOpacity('--tier-combo'),
        
        // Neutrals & Effects
        primary: withOpacity('--text-primary'),
        secondary: withOpacity('--text-secondary'),
        muted: withOpacity('--text-muted'),
        'green-dim': withOpacity('--accent-green-dim'),
        'green-glow': withOpacity('--accent-green-glow'),
        'border-subtle': withOpacity('--border-subtle'),
        'border-panel': withOpacity('--border-panel'),
        'border-glow': withOpacity('--border-glow'),
        backdrop: withOpacity('--bg-backdrop'),
      },
      borderColor: {
        DEFAULT: withOpacity('--border-subtle'),
        subtle: withOpacity('--border-subtle'),
        panel: withOpacity('--border-panel'),
        glow: withOpacity('--border-glow'),
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
