'use client';

import { TrendingUp, Droplets, DollarSign, PieChart, Activity } from 'lucide-react';

export default function TreasuryInvestments() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treasury & Investments</h1>
            <p className="text-gray-600">Liquidity and Capital Deployment</p>
          </div>
        </div>

        {/* Coming Soon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LCR Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-gray-900">Liquidity Coverage Ratio</h3>
            </div>
            <p className="text-gray-600 text-sm">Real-time LCR monitoring and trends</p>
          </div>

          {/* Sukuk Portfolio */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-6 h-6 text-teal-500" />
              <h3 className="font-bold text-gray-900">Sukuk Portfolio</h3>
            </div>
            <p className="text-gray-600 text-sm">Performance tracking and yield analysis</p>
          </div>

          {/* ROI by Investment Type */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-500" />
              <h3 className="font-bold text-gray-900">ROI by Contract</h3>
            </div>
            <p className="text-gray-600 text-sm">Murabaha, Ijara, Mudarabah returns</p>
          </div>

          {/* Funding Sources */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-gray-900">Funding Sources</h3>
            </div>
            <p className="text-gray-600 text-sm">Maturity ladder and source analysis</p>
          </div>

          {/* FX Exposure */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h3 className="font-bold text-gray-900">FX & Commodity</h3>
            </div>
            <p className="text-gray-600 text-sm">Foreign exchange and commodity exposure</p>
          </div>

          {/* Safe vs Strategic */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">Safe vs Strategic</h3>
            </div>
            <p className="text-gray-600 text-sm">Toggle between risk-free and growth allocations</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Treasury & Investments Dashboard</h4>
              <p className="text-blue-700 text-sm mb-3">
                This tab will provide comprehensive insights into how liquidity and capital are being deployed across Islamic banking instruments.
              </p>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• <strong>Liquidity Coverage Ratio (LCR)</strong> - Real-time monitoring and historical trends</li>
                <li>• <strong>Sukuk Portfolio Performance</strong> - Yield analysis and maturity profiles</li>
                <li>• <strong>Funding Sources & Maturity Ladder</strong> - Source diversification and timeline</li>
                <li>• <strong>ROI by Investment Type</strong> - Murabaha, Ijara, Mudarabah, and other contracts</li>
                <li>• <strong>FX & Commodity Exposure</strong> - Currency and commodity risk heatmaps</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
