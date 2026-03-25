'use client'
import Link from 'next/link'
import { ArrowRight, Play, CheckCircle } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-[#0A1F44] text-white pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center">

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-[#0D9488] rounded-full animate-pulse" />
          <span className="text-sm text-blue-200 font-medium">Built for Nigerian Banks · CBN Regulation Ready</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.1] tracking-tight mb-6">
          Automate Your Bank's
          <br />
          <span className="text-[#F97316]">Entire Operation</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed mb-10">
          SmartES Banking gives every Nigerian bank a complete management platform — from CEO oversight to branch performance, treasury, and compliance.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-lg"
          >
            Register Your Bank
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/banking/smart-bank"
            className="inline-flex items-center justify-center gap-2 border border-white/25 hover:bg-white/10 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Live Demo
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-blue-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#0D9488]" />
            Instant registration, no approval wait
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#0D9488]" />
            Shariah-compliant modules included
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#0D9488]" />
            Role-based access for every department
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 border-t border-white/10 pt-12">
          {[
            { value: '99.9%', label: 'Uptime' },
            { value: 'CBN', label: 'Regulation Aligned' },
            { value: '5', label: 'Role Dashboards' },
            { value: 'AI', label: 'Intelligence Built-in' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-blue-300">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
