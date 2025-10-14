'use client';

import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Globe, Coins, BarChart3, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ProfessionalLineChart from '@/components/ui/ProfessionalLineChart';
import ProfessionalChart from '@/components/ui/ProfessionalChart';

export default function ForexMarketPosition() {
  // FX Exposure by Currency
  const fxExposureData = [
    { name: 'USD', value: 42 },
    { name: 'EUR', value: 18 },
    { name: 'GBP', value: 15 },
    { name: 'SAR', value: 12 },
    { name: 'AED', value: 8 },
    { name: 'Others', value: 5 },
  ];

  // Sukuk Yield vs Inflation Trend (12 months)
  const yieldTrendData = [
    { name: 'Jan', value: 9.2 },
    { name: 'Feb', value: 9.3 },
    { name: 'Mar', value: 9.5 },
    { name: 'Apr', value: 9.7 },
    { name: 'May', value: 9.8 },
    { name: 'Jun', value: 10.0 },
    { name: 'Jul', value: 10.2 },
    { name: 'Aug', value: 10.4 },
    { name: 'Sep', value: 10.5 },
    { name: 'Oct', value: 10.7 },
    { name: 'Nov', value: 10.8 },
    { name: 'Dec', value: 11.0 },
  ];

  // Commodity Holdings
  const commodities = [
    { name: 'Gold', value: 34500, unit: 'oz', nairaValue: 58.2, change: '+2.3%', trend: 'up' },
    { name: 'Oil (Brent)', value: 12000, unit: 'barrels', nairaValue: 14.7, change: '+1.8%', trend: 'up' },
    { name: 'Silver', value: 85000, unit: 'oz', nairaValue: 3.5, change: '-0.5%', trend: 'down' },
    { name: 'Agricultural Commodities', value: 0, unit: 'tons', nairaValue: 2.1, change: '+0.9%', trend: 'up' },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Foreign Exchange & Market Position
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage FX exposure, commodity holdings, and market sensitivity</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xs sm:text-sm text-gray-500">Total FX Exposure</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">$842.5M</div>
        </div>
      </div>

      {/* FX Alert */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="flex items-start gap-2 sm:gap-3">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-amber-900 mb-1">⚠️ USD Exposure Above Limit</h3>
            <p className="text-amber-800 text-xs sm:text-sm">
              USD exposure has risen <strong>4% above the internal limit</strong> (42% vs 38% target). This is due to recent Sukuk subscriptions in USD. 
              Recommend hedging ₦3.2B USD exposure via FX forward contracts or rebalancing into EUR/GBP.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700">
                View Hedge Strategy
              </button>
              <button className="px-3 py-1 bg-white text-amber-700 text-xs rounded-md border border-amber-300 hover:bg-amber-50">
                Set Alert Threshold
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total FX Exposure */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">Monitored</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">$842.5M</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Total FX Exposure</div>
          <div className="text-xs text-gray-600 mt-2">≈ ₦656.3B @ 779.00 NGN/USD</div>
        </div>

        {/* Net FX Position */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-200 px-2 py-1 rounded-full">Positive</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">+₦18.7B</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Net FX Gain (YTD)</div>
          <div className="mt-2 flex items-center text-xs text-indigo-600">
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>+2.9% FX mark-to-market gains</span>
          </div>
        </div>

        {/* Commodity Holdings */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-sm border border-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
            <span className="text-xs font-semibold text-cyan-700 bg-cyan-200 px-2 py-1 rounded-full">Hedged</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">₦78.5B</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Commodity Holdings</div>
          <div className="text-xs text-gray-600 mt-2">Gold: 74% | Oil: 19% | Others: 7%</div>
        </div>

        {/* FX Volatility */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-200 px-2 py-1 rounded-full">Normal</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">12.4%</div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">FX Volatility (30-Day)</div>
          <div className="mt-2 flex items-center text-xs text-gray-600">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>Historical avg: 10.8%</span>
          </div>
        </div>
      </div>

      {/* FX Exposure Distribution & Yield Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* FX Exposure by Currency */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">FX Exposure by Currency</h2>
          <div className="h-56 sm:h-64">
            <ProfessionalChart
              data={fxExposureData}
              barColor="#3B82F6"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {fxExposureData.map((currency, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-700">{currency.name}</span>
                <span className="text-sm font-semibold text-gray-900">{currency.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sukuk Yield vs Inflation Trend */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Sukuk Yield vs Inflation Trend</h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">Real returns outpacing inflation by 0.7%</p>
          <div className="h-56 sm:h-64">
            <ProfessionalLineChart
              data={yieldTrendData}
              lineColor="#3B82F6"
              areaFill={true}
              showDots={true}
              strokeWidth={3}
              showGrid={true}
              yAxisLabel="Yield (%)"
              minValue={8}
              maxValue={12}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Avg Sukuk Yield</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">10.7%</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Avg Inflation</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">10.0%</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Real Return</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">+0.7%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Holdings Table */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Commodity Holdings Detail</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Commodity</th>
                <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Quantity</th>
                <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Value (₦B)</th>
                <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">24h Change</th>
                <th className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {commodities.map((commodity, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-xs sm:text-sm text-gray-900 font-medium">{commodity.name}</td>
                  <td className="text-right py-3 px-4 text-xs sm:text-sm text-gray-600">
                    {commodity.value > 0 ? `${commodity.value.toLocaleString()} ${commodity.unit}` : 'Various'}
                  </td>
                  <td className="text-right py-3 px-4 text-xs sm:text-sm font-semibold text-gray-900">₦{commodity.nairaValue}B</td>
                  <td className={`text-right py-3 px-4 text-xs sm:text-sm font-semibold ${
                    commodity.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {commodity.change}
                  </td>
                  <td className="text-right py-3 px-4">
                    {commodity.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 inline" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Total Commodity Portfolio</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">₦78.5B</div>
            </div>
            <div className="text-xs sm:text-sm text-blue-600">
              Gold dominates at 74% of portfolio value
            </div>
          </div>
        </div>
      </div>

      {/* Market Sensitivity Scenarios */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Market Sensitivity Scenarios</h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-4">Impact on portfolio value from market movements</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* USD Depreciation */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">USD -5%</h3>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">-₦32.8B</div>
            <p className="text-xs text-gray-600 mt-1">Portfolio impact if USD weakens by 5%</p>
          </div>

          {/* Gold Price Surge */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Gold +10%</h3>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600">+₦5.8B</div>
            <p className="text-xs text-gray-600 mt-1">Gain if gold price rises 10%</p>
          </div>

          {/* Oil Price Drop */}
          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-sm sm:text-base text-gray-900">Oil -15%</h3>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-red-600">-₦2.2B</div>
            <p className="text-xs text-gray-600 mt-1">Impact if oil prices decline 15%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
