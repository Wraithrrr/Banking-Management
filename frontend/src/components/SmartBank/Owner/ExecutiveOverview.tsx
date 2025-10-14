'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Building2,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface ExecutiveMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalAssets: number;
  assetsGrowth: number;
  totalCustomers: number;
  customerGrowth: number;
  profitMargin: number;
  profitGrowth: number;
  transactionVolume: number;
  volumeGrowth: number;
  employeeCount: number;
  branchCount: number;
}

export default function ExecutiveOverview() {
  const [metrics] = useState<ExecutiveMetrics>({
    totalRevenue: 12500000000,
    revenueGrowth: 23.5,
    totalAssets: 185600000000,
    assetsGrowth: 18.2,
    totalCustomers: 487500,
    customerGrowth: 34.7,
    profitMargin: 15.8,
    profitGrowth: 12.3,
    transactionVolume: 456789,
    volumeGrowth: 28.4,
    employeeCount: 1250,
    branchCount: 45,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const GrowthBadge = ({ value }: { value: number }) => (
    <div className={`flex items-center gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      <span className="text-sm font-bold">{Math.abs(value)}%</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Executive Overview</h2>
          <p className="text-gray-600 mt-1">Bank-wide Performance & Strategic Insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">Shariah Compliant</p>
          </div>
          <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">FY 2025</p>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-10 h-10 opacity-80" />
            <GrowthBadge value={metrics.revenueGrowth} />
          </div>
          <p className="text-3xl font-bold mb-1">{formatCurrency(metrics.totalRevenue)}</p>
          <p className="text-blue-100 text-sm">Total Revenue (YTD)</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-10 h-10 opacity-80" />
            <GrowthBadge value={metrics.assetsGrowth} />
          </div>
          <p className="text-3xl font-bold mb-1">{formatCurrency(metrics.totalAssets)}</p>
          <p className="text-blue-100 text-sm">Total Assets Under Management</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-10 h-10 opacity-80" />
            <GrowthBadge value={metrics.customerGrowth} />
          </div>
          <p className="text-3xl font-bold mb-1">{formatNumber(metrics.totalCustomers)}</p>
          <p className="text-blue-100 text-sm">Total Customers</p>
        </div>

        <div className="bg-gradient-to-br from-black to-blue-800 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-10 h-10 opacity-80" />
            <GrowthBadge value={metrics.profitGrowth} />
          </div>
          <p className="text-3xl font-bold mb-1">{metrics.profitMargin}%</p>
          <p className="text-blue-100 text-sm">Profit Margin</p>
        </div>
      </div>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Treasury</h3>
                <p className="text-xs text-gray-600">Asset Management</p>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Portfolio Value</span>
                <span className="font-bold text-gray-900">{formatCurrency(45600000000)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: 92% achieved</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">ROI</span>
              <span className="font-bold text-blue-700">+8.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Business Dev</h3>
                <p className="text-xs text-gray-600">Growth & Inclusion</p>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">New Accounts</span>
                <span className="font-bold text-gray-900">{formatNumber(8528)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Target: 85% achieved</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-blue-700">68.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Operations</h3>
                <p className="text-xs text-gray-600">Transactions</p>
              </div>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">System Uptime</span>
                <span className="font-bold text-gray-900">99.97%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99.97%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">SLA: Exceeded</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Daily Volume</span>
              <span className="font-bold text-blue-700">{formatNumber(456789)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-blue-700" />
            <h3 className="text-xl font-bold text-gray-900">2025 Strategic Goals</h3>
          </div>
          <div className="space-y-4">
            {[
              { goal: 'Reach 500,000 Customers', current: 487500, target: 500000, color: 'blue' },
              { goal: 'Open 50 Branches', current: 45, target: 50, color: 'blue' },
              { goal: 'Deploy 1,000 Agents', current: 856, target: 1000, color: 'blue' },
              { goal: '₦200B Assets Under Management', current: 185.6, target: 200, color: 'blue' },
            ].map((item, idx) => {
              const percentage = (item.current / item.target) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.goal}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-blue-600 h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-blue-700" />
            <h3 className="text-xl font-bold text-gray-900">Recent Achievements</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'CBN License Secured',
                date: '2024',
                icon: CheckCircle,
                color: 'text-blue-700',
              },
              {
                title: 'ICS Banking Platform Deployed',
                date: 'Q1 2025',
                icon: CheckCircle,
                color: 'text-blue-600',
              },
              {
                title: '400K+ Customers Milestone',
                date: 'Q2 2025',
                icon: CheckCircle,
                color: 'text-blue-700',
              },
              {
                title: 'Reached ₦100B in AUM',
                date: 'Q3 2025',
                icon: CheckCircle,
                color: 'text-blue-700',
              },
            ].map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className={`w-5 h-5 ${achievement.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{achievement.title}</p>
                    <p className="text-xs text-gray-500">{achievement.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Operational Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Employees', value: metrics.employeeCount, icon: Users, color: 'blue' },
            { label: 'Branches', value: metrics.branchCount, icon: Building2, color: 'blue' },
            { label: 'Daily Transactions', value: `${(metrics.transactionVolume / 1000).toFixed(0)}K`, icon: Activity, color: 'blue' },
            { label: 'Agent Network', value: '856', icon: Users, color: 'blue' },
            { label: 'Sukuk Holdings', value: '4', icon: TrendingUp, color: 'blue' },
            { label: 'Active Leads', value: '12.4K', icon: Target, color: 'blue' },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-blue-700`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}</p>
                <p className="text-xs text-gray-600 mt-1">{metric.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
