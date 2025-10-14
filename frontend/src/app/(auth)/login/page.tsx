'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, TrendingUp, Activity, Shield, ArrowRight, Eye, EyeOff, ShieldAlert, Monitor, Zap, Database, Users } from 'lucide-react';

interface DemoRole {
  id: string;
  title: string;
  department: string;
  description: string;
  icon: any;
  color: string;
  gradient: string;
  path: string;
  features: string[];
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoRoles: DemoRole[] = [
    {
      id: 'owner',
      title: 'Chief Executive Officer',
      department: 'Executive Leadership',
      description: 'Strategic oversight and bank-wide performance analytics',
      icon: Building2,
      color: 'text-yellow-600',
      gradient: 'from-yellow-600 to-orange-600',
      path: '/banking/smart-bank/owner',
      features: ['Assets', 'Bank-wide View', 'Strategic Planning'],
    },
    {
      id: 'treasury',
      title: 'Treasury Manager',
      department: 'Treasury Department',
      description: 'Manage Shariah-compliant investments and asset portfolios',
      icon: TrendingUp,
      color: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      path: '/banking/smart-bank/treasury',
      features: ['Assets', 'Sukuk Portfolio', 'Profit Calculator'],
    },
    {
      id: 'risk',
      title: 'Chief Risk Officer',
      department: 'Risk Management',
      description: 'Fraud detection, credit scoring, and risk alerts',
      icon: ShieldAlert,
      color: 'text-rose-700',
      gradient: 'from-rose-600 to-red-700',
      path: '/banking/smart-bank/risk-management',
      features: ['Fraud Alerts', 'Credit Scoring AI', 'Workflows'],
    },
    {
      id: 'it-security',
      title: 'IT Security Director',
      department: 'IT Security',
      description: 'Cybersecurity monitoring, infrastructure, and system protection',
      icon: Monitor,
      color: 'text-purple-700',
      gradient: 'from-purple-500 to-purple-600',
      path: '/banking/smart-bank/it-security',
      features: ['Threat Detection', 'System Monitoring', 'Security Audits'],
    },
  ];

  const handleDemoLogin = (role: DemoRole) => {
    setSelectedRole(role.id);
    setIsLoading(true);
    setTimeout(() => {
      router.push(role.path);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 overflow-hidden flex items-center justify-center p-4 md:p-8">
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-300 rounded-full opacity-15 blur-3xl"></div>
      <div className="absolute top-20 left-20 w-24 h-24 bg-cyan-400 rounded-full opacity-40"></div>

      <div className="relative w-full max-w-7xl">
        <div className="relative bg-white rounded-2xl shadow-2xl border-[12px] border-slate-300 overflow-hidden">
          <div className="relative bg-white">
            <div className="flex flex-col lg:flex-row min-h-[600px]">
              <div className="w-full lg:w-[45%] bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 relative overflow-hidden min-h-[400px] lg:min-h-0">
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                  <div className="absolute bottom-0 right-0 w-full h-1/2" style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 100%)', clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute top-0 left-0 w-1 bg-slate-800/60 origin-top-left" style={{ height: '141%', transform: 'rotate(45deg) translateX(25%)' }}></div>
                      <div className="absolute top-0 right-0 w-1 bg-slate-800/60 origin-top-right" style={{ height: '141%', transform: 'rotate(-45deg) translateX(-25%)' }}></div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="relative w-full h-full opacity-25">
                    <div className="absolute top-1/4 left-1/4 w-12 h-12 border-2 border-white/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Users className="w-6 h-6 text-white/70" />
                    </div>
                    <div className="absolute top-1/3 right-1/4 w-10 h-10 border-2 border-white/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="absolute bottom-1/3 left-1/3 w-14 h-14 border-2 border-white/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Database className="w-7 h-7 text-white/70" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-white">
                <div className="w-full max-w-md">
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-left">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">Smates</h1>
                        <h1 className="text-3xl font-bold text-slate-800">solutions</h1>
                      </div>
                    </div>
                  </div>

                  <form className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-base font-semibold text-slate-700">Enter Your Email</label>
                      <div className="relative">
                        <input type="email" placeholder="" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-10 text-slate-900 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all" />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-base font-semibold text-slate-700">Enter Password</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3.5 pr-10 text-slate-900 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <a href="#" className="text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
                    </div>

                    <button type="submit" className="w-full rounded-lg bg-gradient-to-r from-slate-700 to-slate-800 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] uppercase tracking-wide">SIGN IN</button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="text-sm font-bold text-slate-600 mb-4">QUICK ACCESS - DEMO ROLES</p>
                    <div className="grid grid-cols-2 gap-3">
                      {demoRoles.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;
                        return (
                          <button key={role.id} onClick={() => handleDemoLogin(role)} disabled={isLoading} className={'flex flex-col items-center gap-2 p-4 rounded-lg border transition-all text-center ' + (isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm') + (isLoading ? ' opacity-60 cursor-not-allowed' : '')}>
                            <div className={'h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shadow-sm ' + role.gradient}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 leading-tight">{role.department}</span>
                            {isSelected && isLoading && (<div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor Stand */}
        <div className="flex items-center justify-center mt-4">
          <div className="w-32 h-6 bg-slate-300 rounded-b-lg shadow-md"></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-48 h-3 bg-slate-400 rounded-full shadow-sm"></div>
        </div>

        {/* Keyboard and Mouse */}
        <div className="flex items-end justify-between gap-8 mt-12 px-2">
          {/* Keyboard - Full width matching monitor */}
          <div className="relative flex-1">
            <div className="w-full h-40 bg-gradient-to-b from-slate-300 to-slate-400 rounded-lg shadow-xl border-2 border-slate-400">
              {/* Keyboard keys */}
              <div className="p-5 space-y-2.5">
                {/* Row 1 - Function keys */}
                <div className="flex gap-1.5">
                  {[...Array(15)].map((_, i) => (
                    <div key={`r1-${i}`} className="flex-1 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  ))}
                </div>
                {/* Row 2 - Number row */}
                <div className="flex gap-1.5">
                  {[...Array(14)].map((_, i) => (
                    <div key={`r2-${i}`} className="flex-1 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  ))}
                </div>
                {/* Row 3 - Letter row */}
                <div className="flex gap-1.5">
                  {[...Array(13)].map((_, i) => (
                    <div key={`r3-${i}`} className="flex-1 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  ))}
                </div>
                {/* Row 4 - Spacebar row */}
                <div className="flex gap-1.5">
                  <div className="w-16 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  <div className="w-16 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  <div className="flex-1 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  <div className="w-16 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                  <div className="w-16 h-7 bg-slate-100 rounded shadow-sm border border-slate-300"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mouse */}
          <div className="relative mb-2">
            <div className="w-20 h-24 bg-gradient-to-b from-slate-300 to-slate-400 rounded-2xl rounded-t-3xl shadow-xl border-2 border-slate-400 relative">
              {/* Mouse buttons */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-14 flex gap-0.5">
                <div className="flex-1 bg-slate-200 rounded-t-2xl border border-slate-300"></div>
                <div className="w-px h-10 bg-slate-400"></div>
                <div className="flex-1 bg-slate-200 rounded-t-2xl border border-slate-300"></div>
              </div>
              {/* Mouse scroll wheel */}
              <div className="absolute top-7 left-1/2 -translate-x-1/2 w-1.5 h-5 bg-slate-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
