'use client';

import { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Department {
  name: string;
  manager: string;
  employees: number;
  budget: number;
  performance: number;
  status: 'excellent' | 'good' | 'needs-attention';
  key_metrics: string[];
}

export default function OrganizationalView() {
  const [departments] = useState<Department[]>([
    {
      name: 'Treasury',
      manager: 'Aminu Bello',
      employees: 85,
      budget: 8500000000,
      performance: 92,
      status: 'excellent',
      key_metrics: ['₦45.6B AUM', '8.5% ROI', '4 Sukuk'],
    },
    {
      name: 'Business Development',
      manager: 'Chioma Okafor',
      employees: 220,
      budget: 12000000000,
      performance: 85,
      status: 'excellent',
      key_metrics: ['12.4K Leads', '68.5% Conv', '856 Agents'],
    },
    {
      name: 'Domestic Operations',
      manager: 'Ibrahim Yusuf',
      employees: 450,
      budget: 15000000000,
      performance: 88,
      status: 'excellent',
      key_metrics: ['456K Daily Txn', '99.97% Uptime', '100% Compliance'],
    },
    {
      name: 'Technology & IT',
      manager: 'Grace Nwosu',
      employees: 125,
      budget: 6500000000,
      performance: 90,
      status: 'excellent',
      key_metrics: ['ICS Platform', 'Mobile App', 'API Gateway'],
    },
    {
      name: 'Risk & Compliance',
      manager: 'Mohammed Suleiman',
      employees: 65,
      budget: 4200000000,
      performance: 95,
      status: 'excellent',
      key_metrics: ['100% Shariah', 'CBN Compliant', 'Zero Violations'],
    },
    {
      name: 'Human Resources',
      manager: 'Blessing Adeyemi',
      employees: 45,
      budget: 3800000000,
      performance: 82,
      status: 'good',
      key_metrics: ['1,250 Staff', '88% Retention', '45 Branches'],
    },
    {
      name: 'Marketing',
      manager: 'Fatima Abubakar',
      employees: 75,
      budget: 5600000000,
      performance: 78,
      status: 'good',
      key_metrics: ['487K Customers', '+34.7% Growth', '15 Campaigns'],
    },
    {
      name: 'Internal Audit',
      manager: 'Oluwaseun Oladipo',
      employees: 35,
      budget: 2100000000,
      performance: 93,
      status: 'excellent',
      key_metrics: ['Quarterly Audits', 'Zero Findings', 'SOX Compliant'],
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'needs-attention':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const avgPerformance = (departments.reduce((sum, dept) => sum + dept.performance, 0) / departments.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organizational Overview</h2>
          <p className="text-gray-600 mt-1">Department Performance & Organizational Structure</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors">
          View Org Chart
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-700">
          <Building2 className="w-8 h-8 text-blue-500 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{departments.length}</p>
          <p className="text-sm text-gray-600 mt-1">Departments</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <Users className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
          <p className="text-sm text-gray-600 mt-1">Total Employees</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-800">
          <DollarSign className="w-8 h-8 text-blue-800 mb-3" />
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
          <p className="text-sm text-gray-600 mt-1">Total Budget (Annual)</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-black">
          <TrendingUp className="w-8 h-8 text-black mb-3" />
          <p className="text-3xl font-bold text-gray-900">{avgPerformance}%</p>
          <p className="text-sm text-gray-600 mt-1">Avg Performance</p>
        </div>
      </div>

      {/* Organization Chart Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Executive Leadership</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Chief Executive Officer', name: 'Dr. Ahmed Ibrahim', bg: 'from-blue-700 to-black' },
            { title: 'Chief Operating Officer', name: 'Mrs. Ngozi Okonkwo', bg: 'from-blue-600 to-blue-800' },
            { title: 'Chief Financial Officer', name: 'Mr. Yusuf Mohammed', bg: 'from-blue-600 to-blue-800' },
          ].map((exec, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${exec.bg} rounded-xl p-6 text-white`}>
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                {exec.name.charAt(0)}
              </div>
              <h4 className="text-center font-bold text-lg">{exec.name}</h4>
              <p className="text-center text-sm opacity-90 mt-1">{exec.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((dept, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-black rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{dept.name}</h3>
                    <p className="text-sm text-gray-600">{dept.manager}</p>
                  </div>
                </div>
                {getStatusIcon(dept.status)}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Employees</p>
                  <p className="text-lg font-bold text-gray-900">{dept.employees}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(dept.budget).replace('.00', '')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Performance</p>
                  <p className="text-lg font-bold text-gray-900">{dept.performance}%</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Performance Score</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(dept.status)}`}>
                    {dept.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${dept.performance >= 90 ? 'bg-blue-700' :
                      dept.performance >= 80 ? 'bg-blue-600' :
                        'bg-black'
                      }`}
                    style={{ width: `${dept.performance}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-2">Key Metrics</p>
                <div className="flex flex-wrap gap-2">
                  {dept.key_metrics.map((metric, mIdx) => (
                    <span key={mIdx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Branch Network */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-6 h-6 text-blue-700" />
          <h3 className="text-xl font-bold text-gray-900">Branch Network</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { region: 'Lagos', branches: 15, customers: 185000 },
            { region: 'Abuja', branches: 10, customers: 125000 },
            { region: 'Kano', branches: 8, customers: 98000 },
            { region: 'Port Harcourt', branches: 6, customers: 52000 },
            { region: 'Ibadan', branches: 3, customers: 15000 },
            { region: 'Kaduna', branches: 2, customers: 8500 },
            { region: 'Enugu', branches: 1, customers: 4000 },
          ].map((location, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-700" />
                <h4 className="font-bold text-gray-900">{location.region}</h4>
              </div>
              <p className="text-sm text-gray-600">
                {location.branches} {location.branches === 1 ? 'Branch' : 'Branches'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(location.customers / 1000).toFixed(1)}K Customers
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
