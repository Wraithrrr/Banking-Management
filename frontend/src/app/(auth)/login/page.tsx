'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Eye, EyeOff, ArrowRight, Loader2,
  LayoutDashboard, FileCheck, GitBranch, Settings,
  ClipboardCheck, TrendingUp, BookOpen, HeadphonesIcon,
  UserCheck, Wallet, AlertCircle, AlertTriangle,
} from 'lucide-react';
import { loginWithCredentials, ROLE_PATHS } from '@/lib/auth-client';

const DEMO_ROLES = [
  { id: 'owner', label: 'MD / CEO', level: 'Executive', icon: LayoutDashboard, path: '/banking/smart-bank/owner', color: 'bg-[#0A1F44]' },
  { id: 'compliance', label: 'Compliance Officer', level: 'Management', icon: FileCheck, path: '/banking/smart-bank/compliance', color: 'bg-amber-700' },
  { id: 'internal-control', label: 'Internal Control', level: 'Management', icon: ClipboardCheck, path: '/banking/smart-bank/internal-control', color: 'bg-purple-700' },
  { id: 'head-operations', label: 'Head of Operations', level: 'Management', icon: TrendingUp, path: '/banking/smart-bank/head-operations', color: 'bg-teal-700' },
  { id: 'head-credit', label: 'Head of Credit', level: 'Management', icon: AlertCircle, path: '/banking/smart-bank/head-credit', color: 'bg-yellow-700' },
  { id: 'branch-manager', label: 'Branch Manager', level: 'Branch', icon: GitBranch, path: '/banking/smart-bank/branch-manager', color: 'bg-green-700' },
  { id: 'credit-officer', label: 'Credit Officer', level: 'Operations', icon: BookOpen, path: '/banking/smart-bank/credit-officer', color: 'bg-blue-600' },
  { id: 'customer-service', label: 'Customer Service', level: 'Operations', icon: HeadphonesIcon, path: '/banking/smart-bank/customer-service', color: 'bg-emerald-600' },
  { id: 'account-officer', label: 'Account Officer', level: 'Operations', icon: UserCheck, path: '/banking/smart-bank/account-officer', color: 'bg-indigo-600' },
  { id: 'teller', label: 'Teller', level: 'Operations', icon: Wallet, path: '/banking/smart-bank/teller', color: 'bg-cyan-600' },
  { id: 'admin', label: 'IT Administrator', level: 'System', icon: Settings, path: '/banking/smart-bank/admin', color: 'bg-slate-600' },
];

const LEVEL_ORDER = ['Executive', 'Management', 'Branch', 'Operations', 'System'];

export default function LoginPage() {
  const router = useRouter();

  // Real login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Demo state
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const grouped = LEVEL_ORDER.map(level => ({
    level,
    roles: DEMO_ROLES.filter(r => r.level === level),
  })).filter(g => g.roles.length > 0);

  // ── Real login ────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError('');
    setIsSubmitting(true);

    try {
      const user = await loginWithCredentials(email.trim(), password);

      // Set a lightweight cookie so Next.js middleware can detect auth
      document.cookie = `smartes_auth=1; path=/; max-age=${60 * 60 * 24}`;

      const path = ROLE_PATHS[user.role] ?? '/banking/smart-bank/owner';
      router.push(path);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Demo login (bypasses auth) ────────────────────────────────────────────
  const handleDemoLogin = (role: typeof DEMO_ROLES[0]) => {
    setLoadingRole(role.id);
    setIsDemoLoading(true);
    // Set cookie so middleware doesn't block the route
    document.cookie = `smartes_auth=demo; path=/; max-age=${60 * 60 * 4}`;
    setTimeout(() => router.push(role.path), 700);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

        {/* Left panel — branding */}
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
              {[
                'Real-time financial dashboards',
                'AI-powered intelligence hub',
                'CBN-aligned compliance tools',
                '11-role access control system',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-blue-200">
                  <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-blue-400 text-xs mt-10">© {new Date().getFullYear()} SmartES Solutions · support@smartes.com.ng</p>
        </div>

        {/* Right panel — form + demo */}
        <div className="flex-1 overflow-y-auto max-h-screen p-8 lg:p-10">
          <div className="max-w-sm mx-auto">
            <h1 className="text-2xl font-bold text-[#0A1F44] mb-1">Sign In</h1>
            <p className="text-[#64748B] text-sm mb-8">
              New employee?{' '}
              <Link href="/first-login" className="text-[#F97316] font-semibold hover:underline">
                First-time login here
              </Link>
            </p>

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@yourbank.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <a href="#" className="text-xs text-[#64748B] hover:text-[#F97316] transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all mt-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Demo divider */}
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
                          disabled={isDemoLoading || isSubmitting}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            loading
                              ? 'border-[#F97316] bg-orange-50'
                              : 'border-gray-200 hover:border-[#F97316]/40 hover:bg-orange-50/40'
                          } ${(isDemoLoading && !loading) || isSubmitting ? 'opacity-40 cursor-not-allowed' : ''}`}
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
              <Link href="/register" className="text-[#F97316] font-semibold hover:underline">
                Register your bank
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
