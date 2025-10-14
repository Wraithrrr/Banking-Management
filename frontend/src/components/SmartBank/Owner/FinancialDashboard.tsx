'use client';

import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Eye,
  FileText,
  PieChart,
  BarChart3
} from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';

interface FinancialData {
  revenue: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  expenses: {
    personnel: number;
    operations: number;
    technology: number;
    marketing: number;
    compliance: number;
    other: number;
  };
  profitDistribution: {
    retained: number;
    shareholders: number;
    reserve: number;
    zakah: number;
  };
}

export default function FinancialDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'YTD'>('YTD');

  const [financials] = useState<FinancialData>({
    revenue: {
      q1: 2800000000,
      q2: 3100000000,
      q3: 3300000000,
      q4: 3300000000,
    },
    expenses: {
      personnel: 4200000000,
      operations: 2800000000,
      technology: 1600000000,
      marketing: 1200000000,
      compliance: 800000000,
      other: 600000000,
    },
    profitDistribution: {
      retained: 45,
      shareholders: 30,
      reserve: 15,
      zakah: 10,
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = Object.values(financials.revenue).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(financials.expenses).reduce((a, b) => a + b, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(2);

  const quarters = [
    { name: 'Q1', value: financials.revenue.q1 },
    { name: 'Q2', value: financials.revenue.q2 },
    { name: 'Q3', value: financials.revenue.q3 },
    { name: 'Q4', value: financials.revenue.q4 },
  ];

  const maxRevenue = Math.max(...quarters.map(q => q.value));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive Financial Performance Analysis</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Q1">Q1 2025</option>
            <option value="Q2">Q2 2025</option>
            <option value="Q3">Q3 2025</option>
            <option value="Q4">Q4 2025</option>
            <option value="YTD">Year to Date</option>
          </select>
          <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
          <div className="mt-3 flex items-center text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            +23.5% YoY
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-900">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
          <p className="text-sm text-gray-600 mt-1">Total Expenses</p>
          <div className="mt-3 text-gray-600 text-sm">
            Operational Costs
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(netProfit)}</p>
          <p className="text-sm text-gray-600 mt-1">Net Profit</p>
          <div className="mt-3 flex items-center text-green-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.3% YoY
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-black">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{profitMargin}%</p>
          <p className="text-sm text-gray-600 mt-1">Profit Margin</p>
          <div className="mt-3 text-gray-600 text-sm">
            Industry Leading
          </div>
        </div>
      </div>

      {/* Quarterly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-700" />
            <h3 className="text-xl font-bold text-gray-900">Quarterly Revenue Performance</h3>
          </div>
          <div className="text-sm text-gray-600">FY 2025</div>
        </div>
        <ProfessionalChart data={quarters} barColor="#0b6bcb" />
      </div>

      {/* Expense Breakdown and Profit Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Expense Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(financials.expenses).map(([category, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category === 'personnel' ? 'Personnel & Salaries' :
                        category === 'operations' ? 'Operations' :
                          category === 'technology' ? 'Technology & IT' :
                            category === 'marketing' ? 'Marketing & Growth' :
                              category === 'compliance' ? 'Compliance & Legal' :
                                'Other Expenses'}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(amount)}</p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-700 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profit Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Profit Distribution</h3>
          <div className="space-y-6">
            <div className="relative h-48">
              {Object.entries(financials.profitDistribution).map(([category, percentage], idx) => {
                const swatchClass = idx === 3 ? 'bg-black' : 'bg-blue-600';
                return (
                  <div key={category} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${swatchClass} rounded`}></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {category === 'retained' ? 'Retained Earnings' :
                            category === 'shareholders' ? 'Shareholder Distribution' :
                              category === 'reserve' ? 'Statutory Reserve' :
                                'Zakah & Social'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Shariah-Compliant Distribution</p>
                  <p className="text-sm text-gray-700">
                    Profit distribution follows Islamic banking principles including mandatory Zakah
                    contributions for social welfare and ethical business practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Key Financial Ratios</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Return on Assets (ROA)', value: '8.5%', status: 'excellent' },
            { label: 'Return on Equity (ROE)', value: '15.2%', status: 'excellent' },
            { label: 'Cost-to-Income Ratio', value: '52.3%', status: 'good' },
            { label: 'Capital Adequacy Ratio', value: '18.7%', status: 'excellent' },
          ].map((ratio, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{ratio.value}</p>
              <p className="text-sm text-gray-600 mt-1">{ratio.label}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-semibold ${ratio.status === 'excellent' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
                }`}>
                {ratio.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
