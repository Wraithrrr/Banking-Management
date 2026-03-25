'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Is SmartES Banking aligned with CBN regulations?',
    answer: 'Yes. The platform tracks Capital Adequacy Ratio, NPL ratios, liquidity requirements, and generates compliance-ready reports. Islamic/Non-Interest banking modules (Murabaha, Sukuk, Zakat) are fully included.',
  },
  {
    question: 'How long does registration take?',
    answer: 'Under five minutes. Fill in your bank name, type, CBN license number, RC number, and IT Admin details — your account activates instantly. No waiting, no approval queue.',
  },
  {
    question: 'How does employee onboarding work?',
    answer: 'Your IT Admin creates each employee\'s account by entering their name, email, and role. The system generates a one-time OTP the admin shares manually. The employee logs in with their email and OTP, sets their own password, and lands on their dashboard.',
  },
  {
    question: 'Can one bank see another bank\'s data?',
    answer: 'Absolutely not. Every bank is completely isolated. Your customers, branches, employees, and financial metrics are private to your institution — strict multi-tenant separation.',
  },
  {
    question: 'What roles are available?',
    answer: 'Five roles: IT Administrator (user management only), Owner/CEO (full executive view and AI intelligence), Treasury (assets and liquidity dashboards), Compliance (Shariah audit, KYC/AML, reports), and Branch Manager (their branch only).',
  },
  {
    question: 'How do I get support?',
    answer: 'Email us at support@smartes.com.ng or visit www.smartes.com.ng. We provide dedicated support for every bank on the platform.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4">
            Common questions
          </h2>
          <p className="text-[#64748B] text-lg">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#0A1F44] text-sm pr-4">{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-[#64748B] flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#64748B] text-sm leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
