'use client';

import { Droplets, TrendingUp, Activity, Gauge, AlertCircle, BarChart3 } from 'lucide-react';
import ProfessionalLineChart from '@/components/ui/ProfessionalLineChart';

export default function MarketLiquidityRisk() {
  // Mock LCR Trend Data (12 months)
  const lcrTrendData = [
    { name: 'Jan', value: 132 },
    { name: 'Feb', value: 135 },
    { name: 'Mar', value: 138 },
    { name: 'Apr', value: 136 },
    { name: 'May', value: 140 },
    { name: 'Jun', value: 142 },
    { name: 'Jul', value: 141 },
    { name: 'Aug', value: 143 },
    { name: 'Sep', value: 144 },
    { name: 'Oct', value: 145 },
    { name: 'Nov', value: 147 },
    { name: 'Dec', value: 145 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
          <Droplets className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market & Liquidity Risk</h2>
          <p className="text-gray-600">Sukuk Positions, FX Exposure & Cashflow Resilience</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LCR */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-gray-900">LCR</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">145%</p>
          <p className="text-sm text-green-600 mt-2">↑ 3.2% from last quarter</p>
        </div>

        {/* Liquidity Buffer */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <Gauge className="w-6 h-6 text-green-500" />
            <h3 className="font-bold text-gray-900">Liquidity Buffer</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">78%</p>
          <p className="text-sm text-gray-600 mt-2">Healthy range</p>
        </div>

        {/* Sukuk Portfolio */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <h3 className="font-bold text-gray-900">Sukuk Value</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦4.2B</p>
          <p className="text-sm text-gray-600 mt-2">Total exposure</p>
        </div>

        {/* FX Risk */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-orange-500" />
            <h3 className="font-bold text-gray-900">FX Exposure</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">Medium</p>
          <p className="text-sm text-gray-600 mt-2">USD, EUR, GBP</p>
        </div>
      </div>

      {/* LCR Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Liquidity Coverage Ratio (LCR) Trend</h3>
            <p className="text-sm text-gray-600 mt-1">12-month historical performance</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">LCR %</span>
            </div>
            <div className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Regulatory Min: 100%
            </div>
          </div>
        </div>

        <div className="h-80">
          <ProfessionalLineChart
            data={lcrTrendData}
            lineColor="#3B82F6"
            areaFill={true}
            showDots={true}
            strokeWidth={3}
            showGrid={true}
            yAxisLabel="LCR (%)"
            minValue={120}
            maxValue={155}
          />
        </div>

        {/* Key Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Current LCR</p>
            <p className="text-2xl font-bold text-blue-600">145%</p>
            <p className="text-xs text-green-600 mt-1">↑ 45% above minimum</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs text-gray-600 mb-1">12-Month Average</p>
            <p className="text-2xl font-bold text-green-600">141%</p>
            <p className="text-xs text-gray-600 mt-1">Consistently healthy</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
            <p className="text-xs text-gray-600 mb-1">Trend Direction</p>
            <p className="text-2xl font-bold text-cyan-600">↑ Upward</p>
            <p className="text-xs text-gray-600 mt-1">+10% YoY growth</p>
          </div>
        </div>
      </div>

      {/* Cashflow Forecast */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">90-Day Cashflow Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Next 30 Days</p>
            <p className="text-2xl font-bold text-blue-600">₦8.5B</p>
            <p className="text-xs text-green-600 mt-2">↑ Net positive inflow</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-5 border border-cyan-200">
            <p className="text-sm text-gray-600 mb-2">31-60 Days</p>
            <p className="text-2xl font-bold text-cyan-600">₦6.2B</p>
            <p className="text-xs text-green-600 mt-2">↑ Stable inflow</p>
          </div>
          <div className="bg-teal-50 rounded-lg p-5 border border-teal-200">
            <p className="text-sm text-gray-600 mb-2">61-90 Days</p>
            <p className="text-2xl font-bold text-teal-600">₦4.8B</p>
            <p className="text-xs text-yellow-600 mt-2">→ Moderate inflow</p>
          </div>
        </div>
      </div>

      {/* Market Sensitivity */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Market Sensitivity Analysis</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <h4 className="font-bold text-gray-900">Sukuk Yield Impact</h4>
              <p className="text-sm text-gray-600">1% yield change sensitivity</p>
            </div>
            <span className="text-2xl font-bold text-purple-600">-₦120M</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div>
              <h4 className="font-bold text-gray-900">FX Volatility</h4>
              <p className="text-sm text-gray-600">Currency fluctuation exposure</p>
            </div>
            <span className="text-2xl font-bold text-orange-600">Medium</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200">
            <div>
              <h4 className="font-bold text-gray-900">Commodity Risk</h4>
              <p className="text-sm text-gray-600">Gold & oil exposure</p>
            </div>
            <span className="text-2xl font-bold text-teal-600">Low</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Droplets className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Market & Liquidity Risk Dashboard</h4>
            <p className="text-blue-700 text-sm mb-3">
              Monitor Sukuk positions, FX exposure, and cashflow resilience. Liquidity pressure is where many Islamic banks stumble — this prevents that.
            </p>
            <ul className="space-y-2 text-blue-700 text-sm">
              <li>• <strong>LCR Trends</strong> - Real-time liquidity coverage monitoring</li>
              <li>• <strong>Cashflow Forecast</strong> - 90-day projection based on non-interest assets</li>
              <li>• <strong>Market Sensitivity</strong> - Sukuk yields, FX, commodities exposure</li>
              <li>• <strong>AI Liquidity Stress Simulation</strong> - Predictive stress testing</li>
              <li>• <strong>Liquidity Buffer Gauge</strong> - Real-time buffer percentage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
