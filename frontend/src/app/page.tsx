import Link from 'next/link'
import Navbar from '@/components/Landing/Navbar'
import Hero from '@/components/Landing/Hero'
import Features from '@/components/Landing/Features'
import HowItWorks from '@/components/Landing/HowItWorks'
import Testimonials from '@/components/Landing/Testimonials'
import FAQ from '@/components/Landing/FAQ'
import CTA from '@/components/Landing/CTA'
import Footer from '@/components/Landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-blue-100">
              <span className="font-bold text-white">Live Demo:</span> Explore SmartES Banking — see the full CEO, Treasury & Compliance dashboards
            </p>
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href="/login"
                className="bg-white text-blue-900 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                Try Demo →
              </Link>
              <Link
                href="/banking/smart-bank"
                className="bg-white/15 border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/25 transition-colors whitespace-nowrap hidden sm:block"
              >
                View Overview
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
