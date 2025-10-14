'use client';

import Link from 'next/link';
import { Building2, TrendingUp, Users, Activity, ArrowRight, Shield, Globe, Smartphone, ShieldAlert } from 'lucide-react';

export default function SmartBankHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Smart Bank Ltd</h1>
              <p className="text-sm text-gray-600">Nigeria's Premier Non-Interest Banking Institution</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            Shariah-Compliant Banking
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Enterprise Management Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automated department operations for ethical, transparent, and modern banking.
            Explore our key departments below.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Shield, title: 'Ethical Banking', desc: 'Shariah-compliant operations' },
            { icon: Globe, title: 'Digital-First', desc: 'Modern technology platform' },
            { icon: Smartphone, title: 'Financial Inclusion', desc: 'Banking for everyone' },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Treasury Department */}
          <Link href="/banking/smart-bank/treasury">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Treasury</h3>
                <p className="text-blue-100 text-sm">Asset Management & Investments</p>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Sukuk portfolio management</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Profit-sharing calculator</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Real-time asset tracking</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Business Development Department */}
          <Link href="/banking/smart-bank/business-development">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Business Development</h3>
                <p className="text-green-100 text-sm">Growth & Financial Inclusion</p>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Lead management system</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Agent network tracking</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Target segment analysis</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-green-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Risk Management */}
          <Link href="/banking/smart-bank/risk-management">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="bg-gradient-to-br from-rose-600 to-red-700 p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Risk Management</h3>
                <p className="text-rose-100 text-sm">Fraud & Credit Risk</p>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-rose-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Fraud pattern detection</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-rose-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Credit scoring AI</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-rose-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Live risk alerts feed</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-rose-700 font-semibold group-hover:gap-2 transition-all">
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Compliance */}
          <Link href="/banking/smart-bank/compliance">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer group">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Compliance</h3>
                <p className="text-amber-100 text-sm">Regulatory & Shariah</p>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">KYC & regulatory reporting</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Shariah compliance reviews</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-amber-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-700">Workflow automations</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-amber-700 font-semibold group-hover:gap-2 transition-all">
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg p-6 max-w-2xl">
            <h3 className="font-bold text-gray-900 mb-2">About Smart Bank Ltd</h3>
            <p className="text-sm text-gray-600">
              Licensed by the Central Bank of Nigeria in 2024, Smart Bank is revolutionizing banking
              with Shariah-compliant, digital-first solutions focused on transparency, financial inclusion,
              and profit-sharing rather than conventional interest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
