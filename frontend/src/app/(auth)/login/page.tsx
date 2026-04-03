'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Eye, EyeOff, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { loginWithCredentials, ROLE_PATHS } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError('');
    setIsSubmitting(true);

    try {
      const user = await loginWithCredentials(email.trim(), password);
      document.cookie = `smartes_auth=1; path=/; max-age=${60 * 60 * 24}`;
      const path = ROLE_PATHS[user.role] ?? '/banking/smart-bank/owner';
      router.push(path);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">

        {/* Left panel — branding */}
        <div className="bg-[#0A1F44] lg:w-[45%] p-10 flex flex-col justify-between">
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

        {/* Right panel — login form */}
        <div className="flex-1 p-8 lg:p-10 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            <h1 className="text-2xl font-bold text-[#0A1F44] mb-1">Sign In</h1>
            <p className="text-[#64748B] text-sm mb-8">
              New employee?{' '}
              <Link href="/first-login" className="text-[#F97316] font-semibold hover:underline">
                First-time login here
              </Link>
            </p>

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

            <p className="text-center text-xs text-[#64748B] mt-8">
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
