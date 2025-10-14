'use client';

import { useState, useMemo } from 'react';
import {
  Activity,
  DollarSign,
  PieChart,
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  Zap,
  Clock,
  Globe,
  Users,
  Coins,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Eye,
  BarChart2,
  Wallet,
  Building,
  Brain,
  Lightbulb
} from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';

// Simple Line Chart Component
interface LineChartProps {
  data: ChartDataPoint[];
  lineColor?: string;
}

const SimpleLineChart: React.FC<LineChartProps> = ({ data, lineColor = '#1f2937' }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 80; // 80% of height for padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full relative">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - ((point.value - minValue) / range) * 80;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#1f2937"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
        {data.map((point, index) => (
          <span key={index}>{point.name}</span>
        ))}
      </div>
      <div className="absolute top-2 right-2 text-xs text-gray-500">
        {maxValue.toFixed(1)}%
      </div>
      <div className="absolute bottom-8 right-2 text-xs text-gray-500">
        {minValue.toFixed(1)}%
      </div>
    </div>
  );
};

// Enhanced Islamic Treasury Interfaces
interface LiquidityMetrics {
  name: string;
  current: number;
  optimal: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface IslamicInstrument {
  name: string;
  value: number;
  allocation: number;
  profit: number;
  growth: number;
  color: string;
  shariahCompliant: boolean;
}

interface RiskCategory {
  name: string;
  level: number;
  threshold: number;
  status: 'low' | 'medium' | 'high';
  trend: 'up' | 'down' | 'stable';
}

interface TreasuryKPI {
  label: string;
  value: string;
  change: number;
  icon: any;
  trend: 'up' | 'down' | 'stable';
}

interface PieDataPoint {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface ChartDataPoint {
  name: string;
  value: number;
}

export default function TreasuryOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedMetric, setSelectedMetric] = useState<'liquidity' | 'assets' | 'risks'>('liquidity');
  const [liquidityPeriod, setLiquidityPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Islamic Treasury KPIs
  const treasuryKPIs: TreasuryKPI[] = [
    {
      label: 'Total Shariah Assets',
      value: '₦45.6B',
      change: 12.5,
      icon: Building,
      trend: 'up'
    },
    {
      label: 'Liquidity Coverage Ratio',
      value: '125.8%',
      change: 8.2,
      icon: Wallet,
      trend: 'up'
    },
    {
      label: 'Sukuk Holdings',
      value: '₦18.5B',
      change: 15.3,
      icon: Shield,
      trend: 'up'
    },
    {
      label: 'Shariah Compliance',
      value: '100%',
      change: 0,
      icon: CheckCircle,
      trend: 'stable'
    }
  ];

  // Islamic Financial Instruments
  const islamicInstruments: IslamicInstrument[] = [
    {
      name: 'Sukuk (Islamic Bonds)',
      value: 18500000000,
      allocation: 40.5,
      profit: 8.2,
      growth: 15.3,
      color: '#2563eb',
      shariahCompliant: true
    },
    {
      name: 'Murabaha Contracts',
      value: 12300000000,
      allocation: 27.0,
      profit: 9.1,
      growth: 12.8,
      color: '#16a34a',
      shariahCompliant: true
    },
    {
      name: 'Ijara Leasing',
      value: 8900000000,
      allocation: 19.5,
      profit: 7.8,
      growth: 18.7,
      color: '#dc2626',
      shariahCompliant: true
    },
    {
      name: 'Musharakah Ventures',
      value: 5900000000,
      allocation: 13.0,
      profit: 11.5,
      growth: 22.1,
      color: '#7c3aed',
      shariahCompliant: true
    }
  ];

  // Liquidity Management Metrics
  const liquidityMetrics: LiquidityMetrics[] = [
    {
      name: 'Cash Reserves',
      current: 125.8,
      optimal: 110.0,
      status: 'excellent'
    },
    {
      name: 'Short-term Sukuk',
      current: 98.5,
      optimal: 95.0,
      status: 'good'
    },
    {
      name: 'Overnight Deposits',
      current: 87.2,
      optimal: 85.0,
      status: 'good'
    },
    {
      name: 'Emergency Buffer',
      current: 142.1,
      optimal: 120.0,
      status: 'excellent'
    }
  ];

  // Risk Management Categories
  const riskCategories: RiskCategory[] = [
    {
      name: 'Shariah Risk',
      level: 2.1,
      threshold: 5.0,
      status: 'low',
      trend: 'down'
    },
    {
      name: 'Credit Risk',
      level: 8.5,
      threshold: 12.0,
      status: 'low',
      trend: 'stable'
    },
    {
      name: 'Market Risk',
      level: 6.8,
      threshold: 10.0,
      status: 'low',
      trend: 'down'
    },
    {
      name: 'Liquidity Risk',
      level: 3.2,
      threshold: 8.0,
      status: 'low',
      trend: 'down'
    }
  ];

  // Format currency to billions
  const formatCurrency = (value: number): string => {
    if (value >= 1000000000) {
      return `₦${(value / 1000000000).toFixed(1)}B`;
    }
    return `₦${(value / 1000000).toFixed(1)}M`;
  };

  // Chart data for Islamic instruments
  const instrumentChartData: ChartDataPoint[] = islamicInstruments.map(instrument => ({
    name: instrument.name.split(' ')[0], // Short name for chart
    value: instrument.value / 1000000000 // Convert to billions
  }));

  // Pie chart data for asset allocation with blue/black theme
  const allocationChartData: PieDataPoint[] = islamicInstruments.map((instrument, index) => {
    const colors = ['#1f2937', '#3b82f6', '#1e40af', '#374151']; // Black and blue shades
    return {
      name: instrument.name,
      value: instrument.value / 1000000000,
      percentage: instrument.allocation,
      color: colors[index % colors.length]
    };
  });

  // Liquidity chart data
  const liquidityChartData: ChartDataPoint[] = liquidityMetrics.map(metric => ({
    name: metric.name.split(' ')[0], // Short name
    value: metric.current
  }));

  // Treasury Profit Trend Data (Quarterly)
  const treasuryProfitTrend: ChartDataPoint[] = [
    { name: 'Q1', value: 2.8 },
    { name: 'Q2', value: 3.2 },
    { name: 'Q3', value: 3.7 },
    { name: 'Q4', value: 4.1 }
  ];

  // Liquidity Trend Data for different periods
  const liquidityDailyData: ChartDataPoint[] = [
    { name: 'Mon', value: 125.2 },
    { name: 'Tue', value: 126.8 },
    { name: 'Wed', value: 124.5 },
    { name: 'Thu', value: 127.3 },
    { name: 'Fri', value: 125.8 },
    { name: 'Sat', value: 128.1 },
    { name: 'Sun', value: 126.4 }
  ];

  const liquidityWeeklyData: ChartDataPoint[] = [
    { name: 'W1', value: 122.5 },
    { name: 'W2', value: 124.8 },
    { name: 'W3', value: 126.2 },
    { name: 'W4', value: 125.8 },
    { name: 'W5', value: 127.9 },
    { name: 'W6', value: 129.1 }
  ];

  const liquidityMonthlyData: ChartDataPoint[] = [
    { name: 'Jan', value: 118.5 },
    { name: 'Feb', value: 121.2 },
    { name: 'Mar', value: 119.8 },
    { name: 'Apr', value: 123.4 },
    { name: 'May', value: 125.8 },
    { name: 'Jun', value: 127.3 },
    { name: 'Jul', value: 124.9 },
    { name: 'Aug', value: 126.7 },
    { name: 'Sep', value: 128.1 },
    { name: 'Oct', value: 125.8 },
    { name: 'Nov', value: 129.4 },
    { name: 'Dec', value: 131.2 }
  ];

  // Get current liquidity data based on selected period
  const getCurrentLiquidityData = () => {
    switch (liquidityPeriod) {
      case 'daily':
        return liquidityDailyData;
      case 'weekly':
        return liquidityWeeklyData;
      case 'monthly':
        return liquidityMonthlyData;
      default:
        return liquidityDailyData;
    }
  };

  // AI Treasury Insights
  const aiInsights = [
    {
      title: 'Liquidity Optimization',
      insight: 'AI predicts 15% improvement in cash flow efficiency by restructuring Sukuk maturity profiles.',
      confidence: 94,
      impact: 'High'
    },
    {
      title: 'Risk Mitigation',
      insight: 'ML models suggest diversifying Ijara portfolio to reduce market exposure by 23%.',
      confidence: 89,
      impact: 'Medium'
    },
    {
      title: 'Profit Enhancement',
      insight: 'Strategic rebalancing could increase annual returns by ₦2.3B through Musharakah investments.',
      confidence: 91,
      impact: 'High'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const GrowthBadge = ({ value }: { value: number }) => (
    <div className={`flex items-center gap-1 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      <span className="text-sm font-bold">{Math.abs(value)}%</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Responsive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {treasuryKPIs.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <kpi.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </div>
              <GrowthBadge value={kpi.change} />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className="text-xs sm:text-sm text-gray-600">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Responsive Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Asset Allocation Chart */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-2 h-6 sm:h-8 bg-gradient-to-r from-gray-900 to-blue-600 rounded-full"></div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Asset Allocation</h3>
              <p className="text-xs sm:text-sm text-gray-600">Portfolio distribution</p>
            </div>
          </div>
          <div className="h-64 sm:h-72 mb-4">
            <ProfessionalPieChart data={allocationChartData} />
          </div>
          {/* Legend */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            {allocationChartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs sm:text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Treasury Profit Trend */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-2 h-6 sm:h-8 bg-gradient-to-r from-blue-600 to-gray-900 rounded-full"></div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Profit Trend</h3>
              <p className="text-xs sm:text-sm text-gray-600">Quarterly performance</p>
            </div>
          </div>
          <div className="h-64 sm:h-72">
            <ProfessionalChart
              data={treasuryProfitTrend}
              barColor="#1f2937"
            />
          </div>
        </div>

        {/* Liquidity Trend */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 sm:h-8 bg-gradient-to-r from-gray-900 to-blue-600 rounded-full"></div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Liquidity Trend</h3>
                <p className="text-xs sm:text-sm text-gray-600">Coverage ratio analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={liquidityPeriod}
                onChange={(e) => setLiquidityPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="h-64 sm:h-72">
            <SimpleLineChart
              data={getCurrentLiquidityData()}
              lineColor="#1f2937"
            />
          </div>
        </div>
      </div>

      {/* Responsive AI Insights */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-2 h-6 sm:h-8 bg-indigo-500 rounded-full"></div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI Treasury Insights</h3>
            <p className="text-xs sm:text-sm text-gray-600">Real-time analytics and recommendations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-100 rounded-md flex items-center justify-center">
                    <Lightbulb className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 text-xs sm:text-sm">{insight.title}</h4>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                  insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                  {insight.impact}
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">{insight.insight}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Active</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}