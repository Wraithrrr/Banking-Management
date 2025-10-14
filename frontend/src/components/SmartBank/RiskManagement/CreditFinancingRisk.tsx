'use client';

import { DollarSign, TrendingDown, AlertTriangle, Target, PieChart, BarChart3 } from 'lucide-react';

export default function CreditFinancingRisk() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Credit & Financing Risk</h2>
          <p className="text-gray-600">Portfolio Health & Shariah Contracts Monitoring</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portfolio Health */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-500" />
            <h3 className="font-bold text-gray-900">Portfolio Health</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">94.2%</p>
          <p className="text-sm text-gray-600 mt-2">Overall health score</p>
        </div>

        {/* Default Rate */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-gray-900">Default Rate</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">4.6%</p>
          <p className="text-sm text-green-600 mt-2">↓ 0.3% from last month</p>
        </div>

        {/* Murabaha Exposure */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-gray-900">Murabaha</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦2.1B</p>
          <p className="text-sm text-gray-600 mt-2">42% of total portfolio</p>
        </div>

        {/* AI PD Score */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-gray-900">AI PD Score</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">15.2%</p>
          <p className="text-sm text-gray-600 mt-2">Probability of Default</p>
        </div>
      </div>

      {/* Shariah Contracts Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Islamic Contract Exposure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Murabaha */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900">Murabaha (Cost-Plus)</h4>
                <p className="text-sm text-gray-600">Trade financing</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">42%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₦2.1B</p>
            <div className="mt-3 flex items-center text-sm text-green-600">
              <span>↑ 8.2% growth</span>
            </div>
          </div>

          {/* Ijara */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900">Ijara (Leasing)</h4>
                <p className="text-sm text-gray-600">Asset leasing</p>
              </div>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">18%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₦890M</p>
            <div className="mt-3 flex items-center text-sm text-green-600">
              <span>↑ 5.4% growth</span>
            </div>
          </div>

          {/* Musharakah */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900">Musharakah (Partnership)</h4>
                <p className="text-sm text-gray-600">Joint venture financing</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">26%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₦1.3B</p>
            <div className="mt-3 flex items-center text-sm text-green-600">
              <span>↑ 12.1% growth</span>
            </div>
          </div>

          {/* Mudarabah */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900">Mudarabah (Profit-Sharing)</h4>
                <p className="text-sm text-gray-600">Investment accounts</p>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">14%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₦680M</p>
            <div className="mt-3 flex items-center text-sm text-yellow-600">
              <span>→ Stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <DollarSign className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-green-900 mb-2">Credit & Financing Risk Dashboard</h4>
            <p className="text-green-700 text-sm mb-3">
              Monitor loan and investment exposures under Shariah contracts. Credit risk = the heartbeat of Islamic bank stability.
            </p>
            <ul className="space-y-2 text-green-700 text-sm">
              <li>• <strong>Portfolio Health</strong> - Default rate, exposure by sector</li>
              <li>• <strong>Concentration Heatmap</strong> - Risk distribution across contracts</li>
              <li>• <strong>Recovery Progress Tracker</strong> - NPF recovery monitoring</li>
              <li>• <strong>AI Probability of Default (PD)</strong> - Predictive default analytics</li>
              <li>• <strong>Sukuk & Asset-Backed Exposure</strong> - Investment-grade tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
