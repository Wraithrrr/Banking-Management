const testimonials = [
  {
    quote: 'As CEO, I now have a real-time view of our CAR, ROE, branch performance, and AI forecasts — all in one dashboard. This is exactly what Nigerian banking needed.',
    author: 'Emeka Okafor',
    role: 'Chief Executive Officer',
    bank: 'Rivers United Commercial Bank',
    initials: 'EO',
  },
  {
    quote: 'Our compliance team used to spend three days preparing Shariah audit reports. With SmartES Banking, we do it in under two hours. The automation is industry-changing.',
    author: 'Fatima Hussain',
    role: 'Head of Compliance',
    bank: 'Al-Barakah Microfinance Bank',
    initials: 'FH',
  },
  {
    quote: 'Registration took less than five minutes. Our IT Admin had the whole team onboarded the next morning using the OTP system. Incredibly smooth process.',
    author: 'Chukwuemeka Nwosu',
    role: 'IT Administrator',
    bank: 'Delta Bridge Microfinance Bank',
    initials: 'CN',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#0A1F44]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by banking professionals
          </h2>
          <p className="text-blue-300 text-lg max-w-xl mx-auto">
            Hear from the bankers already using SmartES Banking every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#1E3A5F] rounded-2xl p-7 border border-white/10 flex flex-col">
              <div className="text-3xl text-[#F97316] font-serif mb-4 leading-none">"</div>
              <p className="text-blue-100 leading-relaxed flex-1 mb-6 text-sm">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 bg-[#F97316] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.author}</div>
                  <div className="text-blue-300 text-xs">{t.role} · {t.bank}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
