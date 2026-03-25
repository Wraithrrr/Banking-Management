'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  Award,
  Target,
  ArrowUp,
  ArrowDown,
  Building2,
  Activity,
  DollarSign,
  CheckCircle,
  Calendar,
  Filter,
} from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';

export default function DepartmentOverview() {
  const [selectedMetric, setSelectedMetric] = useState<'efficiency' | 'revenue' | 'productivity'>('efficiency');
  const [dateRange, setDateRange] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'top-performing' | 'needs-attention'>('all');

  // Department Performance Data
  const departments = [
    {
      name: 'Retail Banking',
      head: 'Aisha Mohammed',
      employees: 342,
      efficiency: 92,
      revenue: 4560000000,
      productivity: 88,
      growth: 18.5,
      status: 'excellent' as const,
      kpi: { target: 90, current: 92 },
    },
    {
      name: 'Corporate Banking',
      head: 'Ibrahim Yusuf',
      employees: 128,
      efficiency: 88,
      revenue: 3200000000,
      productivity: 85,
      growth: 15.2,
      status: 'excellent' as const,
      kpi: { target: 85, current: 88 },
    },
    {
      name: 'Digital Banking',
      head: 'Fatima Bello',
      employees: 95,
      efficiency: 94,
      revenue: 2800000000,
      productivity: 91,
      growth: 22.1,
      status: 'excellent' as const,
      kpi: { target: 88, current: 94 },
    },
    {
      name: 'Treasury',
      head: 'Ahmed Suleiman',
      employees: 48,
      efficiency: 85,
      revenue: 1800000000,
      productivity: 82,
      growth: 12.3,
      status: 'good' as const,
      kpi: { target: 82, current: 85 },
    },
    {
      name: 'IT & Security',
      head: 'Chioma Okafor',
      employees: 76,
      efficiency: 94,
      revenue: 1200000000,
      productivity: 90,
      growth: 15.7,
      status: 'excellent' as const,
      kpi: { target: 90, current: 94 },
    },
    {
      name: 'Risk Management',
      head: 'Yusuf Garba',
      employees: 62,
      efficiency: 78,
      revenue: 750000000,
      productivity: 75,
      growth: 10.5,
      status: 'good' as const,
      kpi: { target: 75, current: 78 },
    },
    {
      name: 'Compliance',
      head: 'Zainab Ahmad',
      employees: 54,
      efficiency: 82,
      revenue: 680000000,
      productivity: 79,
      growth: 9.8,
      status: 'good' as const,
      kpi: { target: 80, current: 82 },
    },
    {
      name: 'Customer Service',
      head: 'Emeka Nwosu',
      employees: 245,
      efficiency: 86,
      revenue: 920000000,
      productivity: 84,
      growth: 14.2,
      status: 'good' as const,
      kpi: { target: 85, current: 86 },
    },
  ];

  // Top Performers
  const topPerformers = [
    { name: 'Fatima Bello', department: 'Digital Banking', score: 94, achievement: 'Highest Efficiency' },
    { name: 'Aisha Mohammed', department: 'Retail Banking', score: 92, achievement: 'Revenue Leader' },
    { name: 'Chioma Okafor', department: 'IT & Security', score: 94, achievement: 'Innovation Award' },
    { name: 'Ibrahim Yusuf', department: 'Corporate Banking', score: 88, achievement: 'Client Satisfaction' },
  ];

  // Employee Distribution
  const employeeDistribution = [
    { name: 'Retail Banking', value: 342, percentage: 32, color: '#3B82F6' },
    { name: 'Customer Service', value: 245, percentage: 23, color: '#1E40AF' },
    { name: 'Corporate Banking', value: 128, percentage: 12, color: '#1E3A8A' },
    { name: 'Digital Banking', value: 95, percentage: 9, color: '#60A5FA' },
    { name: 'IT & Security', value: 76, percentage: 7, color: '#93C5FD' },
    { name: 'Risk Management', value: 62, percentage: 6, color: '#BFDBFE' },
    { name: 'Compliance', value: 54, percentage: 5, color: '#DBEAFE' },
    { name: 'Treasury', value: 48, percentage: 4, color: '#EFF6FF' },
  ];

  // Historical performance data for different time ranges
  const performanceHistory = {
    '1M': {
      efficiency: [88, 89, 90, 91],
      revenue: [14.2, 14.5, 14.8, 14.9],
      productivity: [84, 85, 86, 87],
    },
    '3M': {
      efficiency: [85, 87, 88, 89, 90, 91],
      revenue: [13.2, 13.6, 13.9, 14.2, 14.6, 14.9],
      productivity: [81, 82, 84, 85, 86, 87],
    },
    '6M': {
      efficiency: [82, 84, 85, 87, 88, 89, 90, 91],
      revenue: [12.5, 12.8, 13.2, 13.6, 13.9, 14.2, 14.6, 14.9],
      productivity: [78, 80, 81, 82, 84, 85, 86, 87],
    },
    '1Y': {
      efficiency: [76, 78, 80, 82, 84, 85, 87, 88, 89, 90, 91],
      revenue: [11.2, 11.6, 11.9, 12.5, 12.8, 13.2, 13.6, 13.9, 14.2, 14.6, 14.9],
      productivity: [72, 74, 76, 78, 80, 81, 82, 84, 85, 86, 87],
    },
  };

  const filteredDepartments = useMemo(() => {
    if (departmentFilter === 'top-performing') {
      return departments.filter(dept => dept.status === 'excellent');
    } else if (departmentFilter === 'needs-attention') {
      return departments.filter(dept => dept.efficiency < 85 || dept.productivity < 80);
    }
    return departments;
  }, [departmentFilter]);

  const departmentChartData = filteredDepartments.map(dept => {
    let value = 0;
    switch (selectedMetric) {
      case 'revenue':
        value = dept.revenue / 1000000000;
        break;
      case 'productivity':
        value = dept.productivity;
        break;
      default:
        value = dept.efficiency;
    }
    return { name: dept.name, value };
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(1)}B`;
    }
    return `₦${(amount / 1000000).toFixed(1)}M`;
  };

  const GrowthBadge = ({ value }: { value: number }) => (
    <div className={`flex items-center gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      <span className="text-sm font-bold">{Math.abs(value)}%</span>
    </div>
  );

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue':
        return 'Revenue (₦B)';
      case 'productivity':
        return 'Productivity Score (%)';
      default:
        return 'Efficiency Score (%)';
    }
  };

  const totalEmployees = filteredDepartments.reduce((sum, dept) => sum + dept.employees, 0);
  const avgEfficiency = (filteredDepartments.reduce((sum, dept) => sum + dept.efficiency, 0) / filteredDepartments.length).toFixed(1);
  const totalRevenue = filteredDepartments.reduce((sum, dept) => sum + dept.revenue, 0);
  const excellentDepts = filteredDepartments.filter(dept => dept.status === 'excellent').length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">Department Performance Overview</h1>
              <p className="text-blue-100 text-lg">Employee Metrics & Departmental Efficiency</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredDepartments.length}/8</div>
                <div className="text-blue-200 text-sm">Departments Shown</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{excellentDepts}/{filteredDepartments.length}</div>
                <div className="text-blue-200 text-sm">Excellent Depts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-sm font-bold text-blue-600">{departments.length}</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalEmployees}</div>
            <div className="text-gray-600">Total Employees</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-2xl">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{avgEfficiency}%</div>
            <div className="text-gray-600">Avg Efficiency</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-2xl">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <GrowthBadge value={15.3} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalRevenue)}</div>
            <div className="text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-2xl">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-sm font-bold text-green-600">{excellentDepts}/{departments.length}</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{excellentDepts}</div>
            <div className="text-gray-600">Excellent Departments</div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 lg:p-8 border border-yellow-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Top Performing Leaders</h3>
              <p className="text-gray-600">Outstanding Department Heads</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-yellow-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">{performer.score}%</div>
                </div>
                <div className="font-bold text-gray-900 mb-1">{performer.name}</div>
                <div className="text-sm text-gray-600 mb-2">{performer.department}</div>
                <div className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                  {performer.achievement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance Chart */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Department Performance Metrics</h3>
                <p className="text-gray-600">{getMetricLabel()}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <Filter className="w-4 h-4 text-gray-600 ml-2" />
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as any)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-white border-0 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="efficiency">Efficiency Score</option>
                  <option value="revenue">Revenue Generated</option>
                  <option value="productivity">Productivity Score</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <Filter className="w-4 h-4 text-gray-600 ml-2" />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value as any)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-white border-0 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  <option value="top-performing">Top Performing</option>
                  <option value="needs-attention">Needs Attention</option>
                </select>
              </div>
            </div>
          </div>
          <ProfessionalChart data={departmentChartData} barColor="#3B82F6" />
        </div>

        {/* Department Details Grid */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Department Details</h3>
                <p className="text-gray-600">Comprehensive Performance Overview</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              <Calendar className="w-4 h-4 text-gray-600 ml-2" />
              {(['1M', '3M', '6M', '1Y'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${dateRange === range
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {filteredDepartments.map((dept, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="lg:col-span-2">
                  <div className="font-bold text-lg text-gray-900 mb-1">{dept.name}</div>
                  <div className="text-sm text-gray-600 mb-2">Head: {dept.head}</div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{dept.employees} employees</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{dept.efficiency}%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                  <div className="text-xs text-gray-500 mt-1">Target: {dept.kpi.target}%</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(dept.revenue)}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                  <GrowthBadge value={dept.growth} />
                </div>
                <div className="flex items-center justify-center">
                  <div
                    className={`px-4 py-2 rounded-full font-bold text-sm ${dept.status === 'excellent'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {dept.status === 'excellent' ? '⭐ Excellent' : '✓ Good'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Distribution */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Employee Distribution</h3>
              <p className="text-gray-600">Workforce Allocation Across Departments</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ProfessionalPieChart
                data={employeeDistribution.map(item => ({
                  name: item.name,
                  value: item.value,
                  percentage: item.percentage,
                  color: item.color,
                }))}
                showLegend={false}
                showLabels={true}
              />
            </div>
            <div className="space-y-3">
              {employeeDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.percentage}% of workforce</div>
                    </div>
                  </div>
                  <div className="font-bold text-lg text-gray-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
