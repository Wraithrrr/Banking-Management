'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, Droplets, DollarSign, PieChart, Activity, ArrowUp, ArrowDown, Calendar, Filter } from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';

export default function TreasuryInvestments() {
  const [activeView, setActiveView] = useState<'treasury' | 'investment'>('treasury');
  const [dateRange, setDateRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [liquidityFilter, setLiquidityFilter] = useState<'all' | 'cash' | 'investments'>('all');
  const [portfolioFilter, setPortfolioFilter] = useState<'all' | 'sukuk' | 'murabaha' | 'ijara'>('all');

  const treasuryMetrics = {
    totalLiquidity: 45600000000,
    liquidityGrowth: 12.4,
    lcr: 142.5,
    lcrTarget: 100,
    cashReserves: 18700000000,
    reserveGrowth: 8.3,
    fundingRatio: 94.2,
    fundingTrend: 3.1,
  };

  const investmentMetrics = {
    totalInvestments: 78200000000,
    investmentGrowth: 15.8,
    portfolioYield: 8.4,
    yieldChange: 0.6,
    sukukHoldings: 32400000000,
    sukukYield: 7.2,
    roi: 12.8,
    roiGrowth: 2.3,
  };

  const liquidityTrendData = useMemo(() => {
    const dataByRange = {
      '1M': [
        { name: 'Week 1', all: 44.2, cash: 18.5, investments: 25.7 },
        { name: 'Week 2', all: 44.8, cash: 18.6, investments: 26.2 },
        { name: 'Week 3', all: 45.1, cash: 18.7, investments: 26.4 },
        { name: 'Week 4', all: 45.6, cash: 18.7, investments: 26.9 },
      ],
      '3M': [
        { name: 'Apr', all: 43.2, cash: 18.3, investments: 24.9 },
        { name: 'May', all: 44.5, cash: 18.5, investments: 26.0 },
        { name: 'Jun', all: 45.6, cash: 18.7, investments: 26.9 },
      ],
      '6M': [
        { name: 'Jan', all: 38.2, cash: 17.8, investments: 20.4 },
        { name: 'Feb', all: 40.1, cash: 18.0, investments: 22.1 },
        { name: 'Mar', all: 41.8, cash: 18.2, investments: 23.6 },
        { name: 'Apr', all: 43.2, cash: 18.3, investments: 24.9 },
        { name: 'May', all: 44.5, cash: 18.5, investments: 26.0 },
        { name: 'Jun', all: 45.6, cash: 18.7, investments: 26.9 },
      ],
      '1Y': [
        { name: 'Jul', all: 32.5, cash: 16.2, investments: 16.3 },
        { name: 'Aug', all: 34.1, cash: 16.5, investments: 17.6 },
        { name: 'Sep', all: 35.8, cash: 16.8, investments: 19.0 },
        { name: 'Oct', all: 36.9, cash: 17.2, investments: 19.7 },
        { name: 'Nov', all: 37.8, cash: 17.5, investments: 20.3 },
        { name: 'Dec', all: 38.2, cash: 17.8, investments: 20.4 },
        { name: 'Jan', all: 38.2, cash: 17.8, investments: 20.4 },
        { name: 'Feb', all: 40.1, cash: 18.0, investments: 22.1 },
        { name: 'Mar', all: 41.8, cash: 18.2, investments: 23.6 },
        { name: 'Apr', all: 43.2, cash: 18.3, investments: 24.9 },
        { name: 'May', all: 44.5, cash: 18.5, investments: 26.0 },
        { name: 'Jun', all: 45.6, cash: 18.7, investments: 26.9 },
      ],
    };
    const data = dataByRange[dateRange];
    const filterKey = liquidityFilter === 'all' ? 'all' : liquidityFilter;
    return data.map(item => ({ name: item.name, value: item[filterKey as keyof typeof item] as number }));
  }, [dateRange, liquidityFilter]);

  const fundingSources = [
    { name: 'Customer Deposits', value: 65.3, percentage: 65, color: '#3B82F6' },
    { name: 'Interbank Funding', value: 18.2, percentage: 18, color: '#1E40AF' },
    { name: 'Sukuk Issuance', value: 12.5, percentage: 12, color: '#1E3A8A' },
    { name: 'Other Sources', value: 4.0, percentage: 5, color: '#172554' },
  ];

  const portfolioPerformanceData = useMemo(() => {
    const dataByRange = {
      '1M': [
        { name: 'Sukuk', value: 7.3, sukuk: true },
        { name: 'Murabaha', value: 9.9, murabaha: true },
        { name: 'Ijara', value: 8.6, ijara: true },
        { name: 'Commodity', value: 6.5 },
      ],
      '3M': [
        { name: 'Sukuk', value: 7.2, sukuk: true },
        { name: 'Murabaha', value: 9.8, murabaha: true },
        { name: 'Ijara', value: 8.5, ijara: true },
        { name: 'Commodity', value: 6.4 },
      ],
      '6M': [
        { name: 'Sukuk', value: 7.2, sukuk: true },
        { name: 'Murabaha', value: 9.8, murabaha: true },
        { name: 'Ijara', value: 8.5, ijara: true },
        { name: 'Commodity', value: 6.4 },
      ],
      '1Y': [
        { name: 'Sukuk', value: 7.0, sukuk: true },
        { name: 'Murabaha', value: 9.5, murabaha: true },
        { name: 'Ijara', value: 8.2, ijara: true },
        { name: 'Commodity', value: 6.1 },
      ],
    };
    const data = dataByRange[dateRange];
    if (portfolioFilter === 'all') return data;
    return data.filter(item => item[portfolioFilter as keyof typeof item]);
  }, [dateRange, portfolioFilter]);

  const investmentAllocation = [
    { name: 'Sukuk Portfolio', value: 32.4, percentage: 41, color: '#10B981' },
    { name: 'Murabaha Financing', value: 24.8, percentage: 32, color: '#059669' },
    { name: 'Ijara Assets', value: 12.6, percentage: 16, color: '#047857' },
    { name: 'Commodity Murabaha', value: 8.4, percentage: 11, color: '#065F46' },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `₦${(amount / 1000000000).toFixed(1)}B`;
    return `₦${(amount / 1000000).toFixed(1)}M`;
  };

  function GrowthBadge({ value }: { value: number }) {
    return (
      <div className={`flex items-center gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {value >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        <span className="text-sm font-bold">{Math.abs(value)}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex gap-4">
          <button onClick={() => setActiveView('treasury')} className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${activeView === 'treasury' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <div className="flex items-center justify-center gap-2"><Droplets className="w-5 h-5" />Treasury Management</div>
          </button>
          <button onClick={() => setActiveView('investment')} className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${activeView === 'investment' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <div className="flex items-center justify-center gap-2"><TrendingUp className="w-5 h-5" />Investment Portfolio</div>
          </button>
        </div>
      </div>

      {activeView === 'treasury' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><Droplets className="w-8 h-8 opacity-80" /><GrowthBadge value={treasuryMetrics.liquidityGrowth} /></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Total Liquidity</p><p className="text-3xl font-bold">{formatCurrency(treasuryMetrics.totalLiquidity)}</p></div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><Activity className="w-8 h-8 opacity-80" /><span className="text-xs bg-white/20 px-2 py-1 rounded-full">Target: {treasuryMetrics.lcrTarget}%</span></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Liquidity Coverage Ratio</p><p className="text-3xl font-bold">{treasuryMetrics.lcr}%</p></div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><DollarSign className="w-8 h-8 opacity-80" /><GrowthBadge value={treasuryMetrics.reserveGrowth} /></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Cash Reserves</p><p className="text-3xl font-bold">{formatCurrency(treasuryMetrics.cashReserves)}</p></div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><PieChart className="w-8 h-8 opacity-80" /><GrowthBadge value={treasuryMetrics.fundingTrend} /></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Funding Ratio</p><p className="text-3xl font-bold">{treasuryMetrics.fundingRatio}%</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-bold text-gray-800">Liquidity Trend Analysis</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <Calendar className="w-4 h-4 text-gray-500 ml-2" />
                  {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
                    <button key={range} onClick={() => setDateRange(range)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${dateRange === range ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>{range}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <Filter className="w-4 h-4 text-gray-500 ml-2" />
                  <select value={liquidityFilter} onChange={(e) => setLiquidityFilter(e.target.value as any)} className="px-3 py-1.5 bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                    <option value="all">All Liquidity</option>
                    <option value="cash">Cash Only</option>
                    <option value="investments">Investments Only</option>
                  </select>
                </div>
              </div>
            </div>
            <ProfessionalChart data={liquidityTrendData} barColor="#3B82F6" />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Funding Sources Distribution</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              <div><ProfessionalPieChart data={fundingSources} /></div>
              <div className="space-y-4">
                {fundingSources.map((source, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div><span className="font-semibold text-gray-800">{source.name}</span></div>
                      <span className="text-sm font-bold text-blue-600">{source.percentage}%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₦{source.value}B</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'investment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><TrendingUp className="w-8 h-8 opacity-80" /><GrowthBadge value={investmentMetrics.investmentGrowth} /></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Total Investments</p><p className="text-3xl font-bold">{formatCurrency(investmentMetrics.totalInvestments)}</p></div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><Activity className="w-8 h-8 opacity-80" /><GrowthBadge value={investmentMetrics.yieldChange} /></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Portfolio Yield</p><p className="text-3xl font-bold">{investmentMetrics.portfolioYield}%</p></div>
            </div>
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><DollarSign className="w-8 h-8 opacity-80" /><span className="text-xs bg-white/20 px-2 py-1 rounded-full">{investmentMetrics.sukukYield}% Yield</span></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Sukuk Holdings</p><p className="text-3xl font-bold">{formatCurrency(investmentMetrics.sukukHoldings)}</p></div>
            </div>
            <div className="bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4"><PieChart className="w-8 h-8 opacity-80" /><GrowthBadge value={investmentMetrics.roiGrowth} /></div>
              <div className="space-y-1"><p className="text-sm opacity-90">Return on Investment</p><p className="text-3xl font-bold">{investmentMetrics.roi}%</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-bold text-gray-800">Portfolio Yield Performance</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <Calendar className="w-4 h-4 text-gray-500 ml-2" />
                  {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
                    <button key={range} onClick={() => setDateRange(range)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${dateRange === range ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>{range}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <Filter className="w-4 h-4 text-gray-500 ml-2" />
                  <select value={portfolioFilter} onChange={(e) => setPortfolioFilter(e.target.value as any)} className="px-3 py-1.5 bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                    <option value="all">All Contracts</option>
                    <option value="sukuk">Sukuk Only</option>
                    <option value="murabaha">Murabaha Only</option>
                    <option value="ijara">Ijara Only</option>
                  </select>
                </div>
              </div>
            </div>
            <ProfessionalChart data={portfolioPerformanceData.map(item => ({ name: item.name, value: item.value }))} barColor="#10B981" />
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Investment Portfolio Allocation</h3>
            <div className="grid lg:grid-cols-2 gap-8">
              <div><ProfessionalPieChart data={investmentAllocation} /></div>
              <div className="space-y-4">
                {investmentAllocation.map((allocation, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: allocation.color }}></div><span className="font-semibold text-gray-800">{allocation.name}</span></div>
                      <span className="text-sm font-bold text-green-600">{allocation.percentage}%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₦{allocation.value}B</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
