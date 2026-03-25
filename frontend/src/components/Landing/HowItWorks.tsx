import { ClipboardList, UserPlus, KeyRound, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Register Your Bank',
    description: 'Complete the form with your bank name, type, CBN license, RC number, and IT Admin details. Your account is activated instantly — no waiting.',
  },
  {
    number: '02',
    icon: UserPlus,
    title: 'Add Your Team',
    description: 'Your IT Admin logs in and creates accounts for each employee, assigning them a role. The system generates a secure OTP per employee.',
  },
  {
    number: '03',
    icon: KeyRound,
    title: 'Employees Set Their Password',
    description: 'The admin shares the OTP with each employee. They log in once with the OTP, set their own password, and they\'re in — no IT help needed again.',
  },
  {
    number: '04',
    icon: LayoutDashboard,
    title: 'Everyone Gets Their Dashboard',
    description: 'Each role sees a tailored dashboard — the CEO sees the full picture, the branch manager sees only their branch. Right data, right person.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4">
            Your bank, live in minutes
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            From registration to full operations — simple, fast, and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Step number + connector */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-[#0A1F44] rounded-xl flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[#F97316] font-bold text-sm">{step.number}</span>
              </div>
              <h3 className="font-bold text-[#0A1F44] mb-2">{step.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-lg"
          >
            Register Your Bank Now
          </Link>
        </div>
      </div>
    </section>
  )
}
