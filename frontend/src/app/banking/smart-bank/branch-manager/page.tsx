'use client';

import { useState, useMemo } from 'react';
import {
  Users, TrendingUp, Activity, ArrowUp, ArrowDown, Clock,
  MapPin, CheckCircle, AlertTriangle, DollarSign, BarChart2,
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import { useSearchParams } from 'next/navigation';

// --- Branch-specific mock data ---
const BRANCH = {
  name: 'Lagos Victoria Island',
  location: 'Lagos State',
  code: 'LVI-001',
  openedDate: '2018-03-14',
  manager: 'Emeka Nwosu',
};

const branchStats = {
  customers: 45200,
  customersGrowth: 12.4,
  revenue: 2800000000,
  revenueGrowth: 32.1,
  transactions: 68420,
  transactionsGrowth: 28.7,
  efficiency: 94,
  efficiencyGrowth: 2.1,
};

const monthlyRevenue = [
  { name: 'Jan', value: 210 },
  { name: 'Feb', value: 225 },
  { name: 'Mar', value: 248 },
  { name: 'Apr', value: 262 },
  { name: 'May', value: 271 },
  { name: 'Jun', value: 280 },
];

const monthlyCustomers = [
  { name: 'Jan', value: 40200 },
  { name: 'Feb', value: 41800 },
  { name: 'Mar', value: 42900 },
  { name: 'Apr', value: 43600 },
  { name: 'May', value: 44500 },
  { name: 'Jun', value: 45200 },
];

const staff = [
  { name: 'Fatima Bello', role: 'Customer Service Lead', status: 'active', joined: '2020-06-01' },
  { name: 'Yemi Adewale', role: 'Loans Officer', status: 'active', joined: '2021-03-15' },
  { name: 'Chidinma Obi', role: 'Teller Supervisor', status: 'active', joined: '2019-09-10' },
  { name: 'Bashir Musa', role: 'Operations Officer', status: 'active', joined: '2022-01-20' },
  { name: 'Grace Eze', role: 'Customer Service Rep', status: 'on-leave', joined: '2023-05-05' },
];

const alerts = [
  { type: 'warning', message: 'Daily transaction limit approaching 95% capacity', time: '2 hrs ago' },
  { type: 'info', message: 'Q2 branch performance report submitted to HQ', time: '1 day ago' },
  { type: 'success', message: 'Monthly customer acquisition target exceeded by 8.3%', time: '3 days ago' },
];

export default function BranchManagerDashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
    return `₦${n.toLocaleString()}`;
  };

  const formatNumber = (n: number) => new Intl.NumberFormat('en-NG').format(n);

  const GrowthBadge = ({ value }: { value: number }) => (
    <div className={`flex items-center gap-1 text-sm font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      {Math.abs(value)}%
    </div>
  );

  const chartData = useMemo(() =>
    activeTab === 'customers'
      ? monthlyCustomers.map(d => ({ name: d.name, value: d.value / 1000 }))
      : monthlyRevenue,
    [activeTab]
  );

  return (
    <div className="lg:flex min-h-screen bg-slate-50">
      <Sidebar role="branch-manager" userName="Emeka Nwosu" userEmail="emeka@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-green-300" />
                <span className="text-green-300 text-sm font-medium">{BRANCH.location} · {BRANCH.code}</span>
              </div>
              <h1 className="text-3xl font-bold mb-1">{BRANCH.name} Branch</h1>
              <p className="text-green-100">Branch Manager: {BRANCH.manager}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm">Live Data</span>
                <span className="text-green-400 text-sm mx-2">·</span>
                <Clock className="w-4 h-4 text-green-300" />
                <span className="text-green-300 text-sm">Updated 5 mins ago</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-white/10 rounded-xl px-5 py-4">
                <div className="text-2xl font-bold">{formatNumber(branchStats.customers)}</div>
                <div className="text-green-200 text-xs mt-0.5">Customers</div>
              </div>
              <div className="text-center bg-white/10 rounded-xl px-5 py-4">
                <div className="text-2xl font-bold">{branchStats.efficiency}%</div>
                <div className="text-green-200 text-xs mt-0.5">Efficiency</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Branch Revenue', value: formatCurrency(branchStats.revenue), growth: branchStats.revenueGrowth, icon: DollarSign, color: 'bg-blue-100 text-blue-600' },
            { label: 'Total Customers', value: formatNumber(branchStats.customers), growth: branchStats.customersGrowth, icon: Users, color: 'bg-green-100 text-green-600' },
            { label: 'Daily Transactions', value: formatNumber(branchStats.transactions), growth: branchStats.transactionsGrowth, icon: Activity, color: 'bg-purple-100 text-purple-600' },
            { label: 'Branch Efficiency', value: `${branchStats.efficiency}%`, growth: branchStats.efficiencyGrowth, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${kpi.color} rounded-xl`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
                <GrowthBadge value={kpi.growth} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-gray-500 text-sm">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart2 className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Monthly Revenue Trend</h3>
              <p className="text-gray-500 text-sm">Branch revenue in ₦ (millions) — last 6 months</p>
            </div>
          </div>
          <ProfessionalChart data={monthlyRevenue} barColor="#15803d" />
        </div>

        {/* Staff + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Branch Staff */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Branch Staff</h3>
                <p className="text-gray-500 text-sm">{staff.filter(s => s.status === 'active').length} active · {staff.filter(s => s.status === 'on-leave').length} on leave</p>
              </div>
            </div>
            <div className="space-y-3">
              {staff.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs flex-shrink-0">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                      <div className="text-gray-500 text-xs">{member.role}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {member.status === 'active' ? 'Active' : 'On Leave'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Alerts */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Branch Alerts</h3>
                <p className="text-gray-500 text-sm">Recent notifications for your branch</p>
              </div>
            </div>
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
                  alert.type === 'success' ? 'bg-green-50 border-green-100' :
                  'bg-blue-50 border-blue-100'
                }`}>
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  ) : alert.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance vs Bank Average */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Branch vs Bank Average</h3>
              <p className="text-gray-500 text-sm">How this branch compares to the bank-wide average</p>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Revenue Growth', branch: 32.1, bank: 23.5 },
              { label: 'Customer Growth', branch: 12.4, bank: 8.7 },
              { label: 'Branch Efficiency', branch: 94, bank: 87 },
              { label: 'Transaction Volume Growth', branch: 28.7, bank: 20.1 },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">{metric.label}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-700 font-bold">This branch: {metric.branch}%</span>
                    <span className="text-gray-400">Bank avg: {metric.bank}%</span>
                  </div>
                </div>
                <div className="relative bg-gray-100 rounded-full h-3">
                  <div className="absolute bg-gray-300 rounded-full h-3" style={{ width: `${(metric.bank / 100) * 100}%` }} />
                  <div className="absolute bg-green-600 rounded-full h-3" style={{ width: `${(metric.branch / 100) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
