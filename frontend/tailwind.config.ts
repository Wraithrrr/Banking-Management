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
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          500: '#6B7280',
        },
        accent: {
          500: '#10B981',
        },
        error: {
          500: '#EF4444',
        },
        background: '#F9FAFB',
      },
    },
  },
  plugins: [],
}
export default config
