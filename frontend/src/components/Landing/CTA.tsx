import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-24 bg-[#1E3A5F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          Ready to modernise<br />your bank's operations?
        </h2>

        <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Join Nigerian banks already using SmartES Banking to automate workflows, manage compliance, and empower every department with the right data.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
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
            View Live Demo
          </Link>
        </div>

        <p className="text-sm text-blue-300">
          Questions?{' '}
          <a href="mailto:support@smartes.com.ng" className="text-white underline underline-offset-2 hover:text-blue-100">
            support@smartes.com.ng
          </a>
        </p>
      </div>
    </section>
  )
}
