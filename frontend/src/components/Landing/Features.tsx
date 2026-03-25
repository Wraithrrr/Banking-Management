import { Brain, ShieldCheck, GitBranch, BarChart3, Users, DollarSign } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Executive Dashboard',
    description: 'Real-time view of CAR, ROA, ROE, NPL ratios, and Shariah compliance score. Everything a CEO needs at a single glance.',
  },
  {
    icon: Brain,
    title: 'AI Intelligence Hub',
    description: 'Predictive analytics that forecast revenue, detect churn risk, and surface strategic recommendations — powered by machine learning.',
  },
  {
    icon: DollarSign,
    title: 'Treasury Management',
    description: 'Live monitoring of liquidity, Sukuk holdings, FX positions, and investment yields — all in one treasury command centre.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Automation',
    description: 'Automated Shariah audit trails, KYC/AML workflows, Zakat tracking, and CBN report generation. Reduce manual compliance work by 80%.',
  },
  {
    icon: GitBranch,
    title: 'Branch Network',
    description: 'Monitor every branch\'s revenue, customer count, and efficiency score. Each branch manager sees only their own data — nothing more.',
  },
  {
    icon: Users,
    title: 'Role-Based Access Control',
    description: 'Five distinct roles ensure every staff member sees exactly what they need — and nothing they don\'t. Secure by design.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-[#F97316] font-semibold text-sm uppercase tracking-widest mb-3">Platform Features</p>
          <h2 className="text-4xl font-bold text-[#0A1F44] mb-4">
            Everything your bank needs
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl mx-auto">
            One platform. Every department. All the data that matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 hover:border-[#F97316]/30 hover:shadow-md transition-all duration-200">
              <div className="w-11 h-11 bg-[#0A1F44] rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1F44] mb-2">{feature.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
