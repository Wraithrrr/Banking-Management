import Link from 'next/link'
import Navbar from '@/components/Landing/Navbar'
import Hero from '@/components/Landing/Hero'
import Features from '@/components/Landing/Features'
import HowItWorks from '@/components/Landing/HowItWorks'
import Pricing from '@/components/Landing/Pricing'
import Testimonials from '@/components/Landing/Testimonials'
import FAQ from '@/components/Landing/FAQ'
import CTA from '@/components/Landing/CTA'
import Footer from '@/components/Landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Smart Bank Demo Banner */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              🏦 <strong>NEW:</strong> Explore Smart Bank Ltd - Shariah-Compliant Banking Demo
            </p>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Login / Demo →
              </Link>
              <Link
                href="/banking/smart-bank"
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
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
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
