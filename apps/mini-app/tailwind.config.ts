import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#0099cc',
        accent: '#00ff88',
        background: '#0a0a0a',
        surface: 'rgba(10, 10, 20, 0.95)',
        border: 'rgba(0, 212, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
