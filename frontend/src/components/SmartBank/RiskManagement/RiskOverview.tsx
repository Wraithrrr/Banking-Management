'use client';

import { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  CheckCircle,
  Target,
  Lightbulb,
  BarChart2,
  PieChart,
  Gauge
} from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';

// Risk Management Interfaces
interface RiskKPI {
  label: string;
  value: string;
  change: number;
  status: 'good' | 'warning' | 'critical';
  icon: any;
  description: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

interface PieDataPoint {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export default function RiskOverview() {
  // Risk KPIs following owner dashboard style
  const riskKPIs: RiskKPI[] = [
    {
      label: 'NPL Ratio',
      value: '4.6%',
      change: -0.3,
      status: 'good',
      icon: TrendingDown,
      description: 'MoM improvement'
    },
    {
      label: 'Capital Adequacy Ratio',
      value: '17.2%',
      change: 0.8,
      status: 'good',
      icon: Shield,
      description: 'Above Required'
    },
    {
      label: 'RAROC',
      value: '14.8%',
      change: 1.2,
      status: 'good',
      icon: Target,
      description: 'Efficient Risk Use'
    },
    {
      label: 'Operational Loss',
      value: '₦23M',
      change: 5,
      status: 'warning',
      icon: AlertTriangle,
      description: '+5 Incidents'
    }
  ];

  // NPL Ratio Trend Data (Monthly)
  const nplTrendData: ChartDataPoint[] = [
    { name: 'Jan', value: 5.2 },
    { name: 'Feb', value: 5.0 },
    { name: 'Mar', value: 4.9 },
    { name: 'Apr', value: 5.1 },
    { name: 'May', value: 4.8 },
    { name: 'Jun', value: 4.7 },
    { name: 'Jul', value: 4.9 },
    { name: 'Aug', value: 4.6 },
    { name: 'Sep', value: 4.6 },
    { name: 'Oct', value: 4.6 }
  ];

  // Risk Exposure Distribution
  const riskExposureData: PieDataPoint[] = [
    { name: 'Credit Risk', value: 45, percentage: 45, color: '#1e40af' },
    { name: 'Market Risk', value: 25, percentage: 25, color: '#374151' },
    { name: 'Liquidity Risk', value: 20, percentage: 20, color: '#6b7280' },
    { name: 'Operational Risk', value: 10, percentage: 10, color: '#9ca3af' }
  ];

  // Capital Adequacy vs Minimum (for gauge representation)
  const capitalAdequacyData: ChartDataPoint[] = [
    { name: 'Current', value: 17.2 },
    { name: 'Minimum', value: 10.5 },
    { name: 'Target', value: 15.0 }
  ];

  // Operational Risk Incidents by Category
  const operationalRiskData: ChartDataPoint[] = [
    { name: 'Fraud', value: 12 },
    { name: 'System', value: 8 },
    { name: 'Process', value: 15 },
    { name: 'External', value: 6 },
    { name: 'Personnel', value: 9 }
  ];

  return (
    <div className="space-y-6">
      {/* Risk KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {riskKPIs.map((kpi, index) => {
          const isGood = kpi.status === 'good';
          const isWarning = kpi.status === 'warning';
          const statusColor = isGood ? '#10b981' : isWarning ? '#f59e0b' : '#ef4444';

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: statusColor + '20' }}>
                    <kpi.icon className="w-6 h-6" style={{ color: statusColor }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">{kpi.label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${kpi.change < 0 && (kpi.label.includes('NPL') || kpi.label.includes('Loss'))
                      ? 'bg-green-100 text-green-800'
                      : kpi.change > 0 && (kpi.label.includes('NPL') || kpi.label.includes('Loss'))
                        ? 'bg-red-100 text-red-800'
                        : kpi.change > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                >
                  {kpi.change > 0 ? '↗' : '↘'} {Math.abs(kpi.change)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPL Ratio Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">NPL Ratio Trend</h3>
            <span className="text-sm text-gray-500">Monthly %</span>
          </div>
          <ProfessionalChart
            data={nplTrendData}
            barColor="#1e40af"
          />
        </div>

        {/* Risk Exposure Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Risk Exposure Distribution</h3>
            <span className="text-sm text-gray-500">Current Portfolio</span>
          </div>
          <ProfessionalPieChart
            data={riskExposureData}
          />
          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {riskExposureData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">
                  {item.name} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Capital Adequacy vs Requirements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Capital Adequacy</h3>
            <span className="text-sm text-gray-500">vs Regulatory Min</span>
          </div>
          <ProfessionalChart
            data={capitalAdequacyData}
            barColor="#374151"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Current: 17.2%</span>
            <span>Above minimum by 6.7%</span>
          </div>
        </div>

        {/* Operational Risk Incidents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Operational Risk Incidents</h3>
            <span className="text-sm text-gray-500">Last 30 Days</span>
          </div>
          <ProfessionalChart
            data={operationalRiskData}
            barColor="#1e40af"
          />
          <p className="text-xs text-gray-500 mt-2">Total incidents: 50 (↓12% vs previous month)</p>
        </div>
      </div>

      {/* Risk Alerts and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Priority Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">High Priority Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Credit Concentration Risk</p>
                <p className="text-xs text-red-700">Large exposure to manufacturing sector</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Liquidity Stress Test</p>
                <p className="text-xs text-yellow-700">LCR approaching threshold</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Market Risk VaR</p>
                <p className="text-xs text-orange-700">95% VaR exceeded limit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Mitigation Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Mitigations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Portfolio Rebalancing</p>
                <p className="text-xs text-gray-600">Reducing manufacturing exposure by 15%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Liquidity Buffer</p>
                <p className="text-xs text-gray-600">Increasing HQLA holdings</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Hedging Strategy</p>
                <p className="text-xs text-gray-600">Implementing FX hedge program</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-yellow-600 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Committee Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Actions</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <p className="text-sm font-medium text-gray-900">Risk Appetite Review</p>
              <p className="text-xs text-gray-600 mt-1">Next meeting: Dec 15, 2024</p>
              <p className="text-xs text-blue-600 mt-1">Board approval pending</p>
            </div>
            <div className="border-l-4 border-green-600 pl-4">
              <p className="text-sm font-medium text-gray-900">Stress Test Results</p>
              <p className="text-xs text-gray-600 mt-1">Completed: Dec 8, 2024</p>
              <p className="text-xs text-green-600 mt-1">Passed all scenarios</p>
            </div>
            <div className="border-l-4 border-yellow-600 pl-4">
              <p className="text-sm font-medium text-gray-900">Model Validation</p>
              <p className="text-xs text-gray-600 mt-1">In progress: Credit models</p>
              <p className="text-xs text-yellow-600 mt-1">Expected completion: Q1 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
