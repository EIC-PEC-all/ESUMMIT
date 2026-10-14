import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#060D0B',
        deep: '#081310',
        panel: '#0D1C18',
        'panel-alt': '#12241F',
        mint: '#00F5D4',
        'mint-glow': 'rgba(0, 245, 212, 0.25)',
        green: '#00DC9F',
        volt: '#00DC9F',
        blue: '#3DD9FF',
        coral: '#FF4D3D',
        primary: '#FFFFFF',
        secondary: '#94A3B8',
        muted: '#64748B',
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
