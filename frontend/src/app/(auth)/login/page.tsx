'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Eye, EyeOff, ArrowRight, Loader2,
  LayoutDashboard, FileCheck, GitBranch, Settings,
  ClipboardCheck, TrendingUp, BookOpen, HeadphonesIcon,
  UserCheck, Wallet, AlertCircle,
} from 'lucide-react';

const DEMO_ROLES = [
  // Executive
  { id: 'owner', label: 'MD / CEO', level: 'Executive', icon: LayoutDashboard, path: '/banking/smart-bank/owner', color: 'bg-[#0A1F44]' },
  // Management
  { id: 'compliance', label: 'Compliance Officer', level: 'Management', icon: FileCheck, path: '/banking/smart-bank/compliance', color: 'bg-amber-700' },
  { id: 'internal-control', label: 'Internal Control', level: 'Management', icon: ClipboardCheck, path: '/banking/smart-bank/internal-control', color: 'bg-purple-700' },
  { id: 'head-operations', label: 'Head of Operations', level: 'Management', icon: TrendingUp, path: '/banking/smart-bank/head-operations', color: 'bg-teal-700' },
  { id: 'head-credit', label: 'Head of Credit', level: 'Management', icon: AlertCircle, path: '/banking/smart-bank/head-credit', color: 'bg-yellow-700' },
  // Branch
  { id: 'branch-manager', label: 'Branch Manager', level: 'Branch', icon: GitBranch, path: '/banking/smart-bank/branch-manager', color: 'bg-green-700' },
  // Operations
  { id: 'credit-officer', label: 'Credit Officer', level: 'Operations', icon: BookOpen, path: '/banking/smart-bank/credit-officer', color: 'bg-blue-600' },
  { id: 'customer-service', label: 'Customer Service', level: 'Operations', icon: HeadphonesIcon, path: '/banking/smart-bank/customer-service', color: 'bg-emerald-600' },
  { id: 'account-officer', label: 'Account Officer', level: 'Operations', icon: UserCheck, path: '/banking/smart-bank/account-officer', color: 'bg-indigo-600' },
  { id: 'teller', label: 'Teller', level: 'Operations', icon: Wallet, path: '/banking/smart-bank/teller', color: 'bg-cyan-600' },
  // Admin
  { id: 'admin', label: 'IT Administrator', level: 'System', icon: Settings, path: '/banking/smart-bank/admin', color: 'bg-slate-600' },
];

const LEVEL_ORDER = ['Executive', 'Management', 'Branch', 'Operations', 'System'];

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleDemoLogin = (role: typeof DEMO_ROLES[0]) => {
    setLoadingRole(role.id);
    setIsLoading(true);
    setTimeout(() => router.push(role.path), 800);
  };

  const grouped = LEVEL_ORDER.map(level => ({
    level,
    roles: DEMO_ROLES.filter(r => r.level === level),
  })).filter(g => g.roles.length > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

        {/* Left panel */}
        <div className="bg-[#0A1F44] lg:w-[40%] p-10 flex flex-col justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-12">
              <div className="w-9 h-9 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                SmartES <span className="text-[#F97316]">Banking</span>
              </span>
            </Link>

            <h2 className="text-3xl font-bold text-white mb-4 leading-snug">Welcome back</h2>
            <p className="text-blue-300 text-sm leading-relaxed mb-10">
              Sign in to your bank's management platform. All dashboards, analytics, and compliance tools are one click away.
            </p>

            <div className="space-y-3">
              {['Real-time financial dashboards', 'AI-powered intelligence hub', 'CBN-aligned compliance tools', '11-role access control system'].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-blue-200">
                  <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-blue-400 text-xs mt-10">© {new Date().getFullYear()} SmartES Solutions · support@smartes.com.ng</p>
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto max-h-screen p-8 lg:p-10">
          <div className="max-w-sm mx-auto">
            <h1 className="text-2xl font-bold text-[#0A1F44] mb-1">Sign In</h1>
            <p className="text-[#64748B] text-sm mb-8">
              New employee?{' '}
              <Link href="/first-login" className="text-[#F97316] font-semibold hover:underline">First-time login here</Link>
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="you@yourbank.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your password"
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <a href="#" className="text-xs text-[#64748B] hover:text-[#F97316] transition-colors">Forgot password?</a>
                </div>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-sm transition-all mt-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">DEMO ACCESS</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Grouped demo roles */}
            <div className="space-y-4">
              {grouped.map(({ level, roles }) => (
                <div key={level}>
                  <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">{level}</p>
                  <div className="space-y-1.5">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      const loading = loadingRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => handleDemoLogin(role)}
                          disabled={isLoading}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            loading
                              ? 'border-[#F97316] bg-orange-50'
                              : 'border-gray-200 hover:border-[#F97316]/40 hover:bg-orange-50/40'
                          } ${isLoading && !loading ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 ${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-[#0A1F44] text-xs">{role.label}</span>
                          </div>
                          {loading
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
                            : <ArrowRight className="w-3 h-3 text-gray-300" />
                          }
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-[#64748B] mt-6">
              Don't have a bank account?{' '}
              <Link href="/register" className="text-[#F97316] font-semibold hover:underline">Register your bank</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
