import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: 'var(--bg-void)',
        deep: 'var(--bg-deep)',
        panel: 'var(--bg-panel)',
        'panel-alt': 'var(--bg-panel-alt)',
        mint: 'var(--accent-mint)',
        'mint-glow': 'var(--accent-green-glow)',
        green: 'var(--accent-green)',
        volt: 'var(--accent-green)',
        blue: 'var(--accent-blue)',
        coral: 'var(--accent-coral)',
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
        'border-subtle': 'var(--border-subtle)',
        'border-panel': 'var(--border-panel)',
      },
      borderColor: {
        subtle: 'var(--border-subtle)',
        panel: 'var(--border-panel)',
      },
      fontFamily: {
        display: ['var(--font-asimovian)', 'Asimovian', 'sans-serif'],
        asimovian: ['var(--font-asimovian)', 'Asimovian', 'sans-serif'],
        kanit: ['var(--font-asimovian)', 'Asimovian', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-marcellus)', 'Marcellus', 'serif'],
        'mono-data': ['var(--font-marcellus)', 'Marcellus', 'serif'],
        marcellus: ['var(--font-marcellus)', 'Marcellus', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
