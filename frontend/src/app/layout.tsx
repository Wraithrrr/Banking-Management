import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartES Banking — Automate Your Bank\'s Entire Operation',
  description: 'SmartES Banking is the complete banking management platform built for Nigerian banks. Register your bank and automate every workflow — from compliance to branch management.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://analytics.smartes.com.ng/script.js" data-website-id="026fe571-64c4-4008-ba5d-a6a9acf42eaf" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
