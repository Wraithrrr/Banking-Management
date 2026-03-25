'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Building2,
  Target,
  Award,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  PieChart,
  BarChart2,
  ChevronDown,
  Shield,
  AlertTriangle,
  Globe,
  Heart,
  Brain,
  Zap,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Eye,
  Lightbulb,
  AlertCircle,
  TrendingUp as TrendingRight
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';
import AIInsightPage from '@/components/SmartBank/Owner/AIInsightPage';
import TreasuryInvestments from '@/components/SmartBank/Owner/TreasuryInvestments';
import DepartmentOverview from '@/components/SmartBank/Owner/DepartmentOverview';
import { useSearchParams } from 'next/navigation';

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
  // Financial Health Metrics
  totalLiabilities: number;
  liquidityRatio: number;
  nplRatio: number;
  roa: number;
  roe: number;
  capitalAdequacyRatio: number;
  shariahComplianceScore: number;
}

interface CustomerInsight {
  segment: string;
  count: number;
  percentage: number;
  avgDeposit: number;
  growth: number;
  churnRate: number;
}

interface BranchPerformance {
  name: string;
  location: string;
  customers: number;
  revenue: number;
  efficiency: number;
  growth: number;
}

interface RiskMetric {
  name: string;
  current: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  trend: number;
}

interface AIInsight {
  id: string;
  type: 'recommendation' | 'forecast' | 'alert' | 'opportunity';
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

interface DepartmentPerformance {
  name: string;
  efficiency: number;
  revenue: number;
  growth: number;
  status: 'excellent' | 'good' | 'needs-attention';
}

interface IslamicContract {
  name: string;
  profit: number;
  percentage: number;
  color: string;
}

export default function OwnerDashboard() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const [selectedGraphType, setSelectedGraphType] = useState<'performance' | 'revenue' | 'growth'>('performance');
  const [selectedDistributionType, setSelectedDistributionType] = useState<'money' | 'profit'>('money');
  const [trendPeriod, setTrendPeriod] = useState<'month' | 'quarter' | 'year'>('quarter');

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
    // Financial Health Metrics
    totalLiabilities: 142300000000,
    liquidityRatio: 85.2,
    nplRatio: 2.8,
    roa: 1.9,
    roe: 18.4,
    capitalAdequacyRatio: 16.8,
    shariahComplianceScore: 98.5,
  });

  // Customer Insights Data
  const [customerInsights] = useState<CustomerInsight[]>([
    { segment: 'Retail', count: 425000, percentage: 87.2, avgDeposit: 850000, growth: 28.5, churnRate: 3.2 },
    { segment: 'SME', count: 48000, percentage: 9.8, avgDeposit: 12500000, growth: 45.8, churnRate: 1.8 },
    { segment: 'Corporate', count: 14500, percentage: 3.0, avgDeposit: 285000000, growth: 12.4, churnRate: 0.9 },
  ]);

  // Branch Performance Data
  const [branchPerformance] = useState<BranchPerformance[]>([
    { name: 'Lagos Victoria Island', location: 'Lagos', customers: 45200, revenue: 2800000000, efficiency: 94, growth: 32.1 },
    { name: 'Abuja Central', location: 'Abuja', customers: 38500, revenue: 2200000000, efficiency: 91, growth: 28.4 },
    { name: 'Kano Main', location: 'Kano', customers: 32800, revenue: 1850000000, efficiency: 88, growth: 25.7 },
    { name: 'Port Harcourt GRA', location: 'Rivers', customers: 28400, revenue: 1650000000, efficiency: 85, growth: 22.8 },
    { name: 'Ibadan Dugbe', location: 'Oyo', customers: 24600, revenue: 1420000000, efficiency: 82, growth: 18.9 },
  ]);

  // Risk Metrics
  const [riskMetrics] = useState<RiskMetric[]>([
    { name: 'Credit Risk', current: 2.8, threshold: 5.0, status: 'good', trend: -0.3 },
    { name: 'Market Risk', current: 1.2, threshold: 2.5, status: 'good', trend: 0.1 },
    { name: 'Operational Risk', current: 3.4, threshold: 4.0, status: 'warning', trend: 0.5 },
    { name: 'Liquidity Risk', current: 0.8, threshold: 2.0, status: 'good', trend: -0.2 },
  ]);

  // AI Insights
  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'recommendation',
      title: 'SME Growth Opportunity',
      content: 'Customer growth slowed in Q3 due to reduced onboarding from SME segment. Consider reactivating referral campaigns and digital onboarding improvements.',
      impact: 'high',
      category: 'Growth'
    },
    {
      id: '2',
      type: 'forecast',
      title: 'Profit Margin Improvement',
      content: 'Profit margin up 2.3% due to higher Murabaha yield. Forecast suggests maintaining current trajectory could yield 16.8% by Q1 2026.',
      impact: 'medium',
      category: 'Profitability'
    },
    {
      id: '3',
      type: 'alert',
      title: 'Operational Risk Trend',
      content: 'Operational risk increasing due to system downtime in Kano and Ibadan branches. Immediate infrastructure review recommended.',
      impact: 'high',
      category: 'Risk'
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Corporate Banking Expansion',
      content: 'Corporate segment shows lowest churn rate (0.9%) with highest average deposits. Consider launching premium corporate products.',
      impact: 'medium',
      category: 'Product Development'
    }
  ]);

  // Trend Data
  const [trendData] = useState({
    revenue: [
      { period: 'Jan', value: 980, growth: 18.2 },
      { period: 'Feb', value: 1020, growth: 22.1 },
      { period: 'Mar', value: 1180, growth: 28.5 },
      { period: 'Apr', value: 1250, growth: 31.2 },
      { period: 'May', value: 1320, growth: 29.8 },
      { period: 'Jun', value: 1380, growth: 25.4 },
    ],
    customers: [
      { period: 'Jan', value: 425, growth: 28.5 },
      { period: 'Feb', value: 440, growth: 32.1 },
      { period: 'Mar', value: 458, growth: 35.2 },
      { period: 'Apr', value: 468, growth: 31.8 },
      { period: 'May', value: 478, growth: 28.9 },
      { period: 'Jun', value: 487, growth: 24.7 },
    ],
    transactions: [
      { period: 'Jan', value: 385, growth: 22.4 },
      { period: 'Feb', value: 402, growth: 28.1 },
      { period: 'Mar', value: 428, growth: 32.5 },
      { period: 'Apr', value: 445, growth: 29.8 },
      { period: 'May', value: 456, growth: 25.2 },
      { period: 'Jun', value: 468, growth: 21.8 },
    ],
    profit: [
      { period: 'Jan', value: 155, growth: 15.2 },
      { period: 'Feb', value: 165, growth: 18.4 },
      { period: 'Mar', value: 186, growth: 22.1 },
      { period: 'Apr', value: 198, growth: 25.8 },
      { period: 'May', value: 208, growth: 23.2 },
      { period: 'Jun', value: 218, growth: 19.8 },
    ],
  });

  // CSR & Sustainability Data
  const [sustainabilityMetrics] = useState({
    csrSpending: 485000000,
    zakatDistribution: 325000000,
    greenInvestments: 12800000000,
    communityProjects: 28,
    beneficiaries: 15420,
  });

  const [departments] = useState<DepartmentPerformance[]>([
    {
      name: 'Retail Banking',
      efficiency: 92,
      revenue: 4560000000,
      growth: 18.5,
      status: 'excellent'
    },
    {
      name: 'Corporate Banking',
      efficiency: 88,
      revenue: 3200000000,
      growth: 15.2,
      status: 'excellent'
    },
    {
      name: 'Digital Banking',
      efficiency: 94,
      revenue: 2800000000,
      growth: 22.1,
      status: 'excellent'
    },
    {
      name: 'Treasury',
      efficiency: 85,
      revenue: 1800000000,
      growth: 12.3,
      status: 'good'
    },
    {
      name: 'IT Security',
      efficiency: 94,
      revenue: 1200000000,
      growth: 15.7,
      status: 'excellent'
    },
    {
      name: 'Risk Management',
      efficiency: 78,
      revenue: 750000000,
      growth: 10.5,
      status: 'good'
    }
  ]);

  const [islamicContracts] = useState<IslamicContract[]>([
    { name: 'Murabaha', profit: 3400000000, percentage: 42, color: '#3B82F6' },
    { name: 'Mudarabah', profit: 2200000000, percentage: 27, color: '#1E40AF' },
    { name: 'Ijara', profit: 1600000000, percentage: 20, color: '#1E3A8A' },
    { name: 'Musharakah', profit: 700000000, percentage: 8, color: '#172554' },
    { name: 'Istisna', profit: 250000000, percentage: 3, color: '#0F172A' }
  ]);

  const [moneyDistribution] = useState([
    { name: 'Customer Deposits', value: 78500000000, percentage: 42.3, color: '#3B82F6' },
    { name: 'Investment Portfolio', value: 45600000000, percentage: 24.6, color: '#1E40AF' },
    { name: 'Sukuk Holdings', value: 32400000000, percentage: 17.5, color: '#1E3A8A' },
    { name: 'Cash Reserves', value: 18700000000, percentage: 10.1, color: '#172554' },
    { name: 'Other Assets', value: 10400000000, percentage: 5.6, color: '#0F172A' }
  ]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
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

  const departmentChartData = useMemo(() => {
    switch (selectedGraphType) {
      case 'revenue':
        // Show Retail Banking, Corporate Banking, Digital Banking for revenue
        return departments.filter(dept => ['Retail Banking', 'Corporate Banking', 'Digital Banking'].includes(dept.name))
          .map(dept => ({
            name: dept.name,
            value: dept.revenue / 1000000000 // Convert to billions for readability
          }));
      case 'growth':
        // Show any departments for growth
        return departments.map(dept => ({
          name: dept.name,
          value: dept.growth
        }));
      default:
        // Show Treasury, IT Security, Risk Management for efficiency
        return departments.filter(dept => ['Treasury', 'IT Security', 'Risk Management'].includes(dept.name))
          .map(dept => ({
            name: dept.name,
            value: dept.efficiency
          }));
    }
  }, [selectedGraphType, departments]);

  const distributionChartData = useMemo(() => {
    return selectedDistributionType === 'money' ?
      moneyDistribution.map(item => ({
        name: item.name,
        value: item.value / 1000000000,
        percentage: item.percentage,
        color: item.color
      })) :
      islamicContracts.map(contract => ({
        name: contract.name,
        value: contract.profit / 1000000000,
        percentage: contract.percentage,
        color: contract.color
      }));
  }, [selectedDistributionType, moneyDistribution, islamicContracts]);

  const getChartUnit = () => {
    switch (selectedGraphType) {
      case 'revenue':
        return 'Revenue (₦B)';
      case 'growth':
        return 'Growth (%)';
      default:
        return 'Efficiency (%)';
    }
  };

  // Treasury & Investments Tab
  if (activeTab === 'treasury') {
    return (
      <div className="lg:flex min-h-screen bg-slate-50">
        <Sidebar role="owner" />
        <div className="flex-1 overflow-auto">
          <TreasuryInvestments />
        </div>
      </div>
    );
  }

  // Department Overview Tab
  if (activeTab === 'department') {
    return (
      <div className="lg:flex min-h-screen bg-slate-50">
        <Sidebar role="owner" />
        <div className="flex-1 overflow-auto">
          <DepartmentOverview />
        </div>
      </div>
    );
  }

  // AI Intelligence Hub Tab (support both old and new routes)
  if (activeTab === 'ai-intelligence' || activeTab === 'ai-insights') {
    return (
      <div className="lg:flex min-h-screen bg-slate-50">
        <Sidebar role="owner" />
        <div className="flex-1 p-4 lg:p-8">
          <AIInsightPage />
        </div>
      </div>
    );
  }

  // Executive Overview (Default Dashboard)
  return (
    <div className="lg:flex min-h-screen bg-slate-50">
      <Sidebar role="owner" />
      <div className="flex-1 p-4 lg:p-8">
        <div>
          {(activeTab === 'dashboard' || !activeTab) && (
            <div className="space-y-8">
              {/* Executive Header */}
              <div className="bg-gradient-to-br from-blue-700 to-black rounded-2xl p-8 text-white shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Executive Command Center</h1>
                    <p className="text-blue-100 text-lg">Strategic Overview & Real-time Intelligence</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-300 text-sm">Live Data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-200" />
                        <span className="text-blue-200 text-sm">Updated 2 mins ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-right mb-4">
                      <div className="text-2xl font-bold">{formatNumber(metrics.branchCount)}</div>
                      <div className="text-blue-200 text-sm">Active Branches</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{formatNumber(metrics.employeeCount)}</div>
                      <div className="text-blue-200 text-sm">Employees</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core KPI Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-2xl">
                      <DollarSign className="w-8 h-8 text-blue-600" />
                    </div>
                    <GrowthBadge value={metrics.revenueGrowth} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(metrics.totalRevenue)}</div>
                    <div className="text-gray-600">Total Revenue</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-2xl">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <GrowthBadge value={metrics.customerGrowth} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(metrics.totalCustomers)}</div>
                    <div className="text-gray-600">Total Customers</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-2xl">
                      <Activity className="w-8 h-8 text-purple-600" />
                    </div>
                    <GrowthBadge value={metrics.volumeGrowth} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{formatNumber(metrics.transactionVolume)}</div>
                    <div className="text-gray-600">Daily Transactions</div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-2xl">
                      <TrendingUp className="w-8 h-8 text-yellow-600" />
                    </div>
                    <GrowthBadge value={metrics.profitGrowth} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{metrics.profitMargin}%</div>
                    <div className="text-gray-600">Profit Margin</div>
                  </div>
                </div>
              </div>

              {/* Financial Health Indicators */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Financial Health Indicators</h3>
                      <p className="text-gray-600">Regulatory & Prudential Compliance Metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span>All Compliant</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                    <div className="text-2xl font-bold text-blue-700 mb-1">{metrics.capitalAdequacyRatio}%</div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">Capital Adequacy</div>
                    <div className="text-xs text-gray-500 mt-1">Min: 10% (Basel III)</div>
                    <div className="mt-2 text-xs font-medium text-blue-600">Compliant</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
                    <div className="text-2xl font-bold text-green-700 mb-1">{metrics.roa}%</div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">Return on Assets</div>
                    <div className="text-xs text-gray-500 mt-1">Target: &gt;1.5%</div>
                    <div className="mt-2 text-xs font-medium text-green-600">On Target</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center">
                    <div className="text-2xl font-bold text-purple-700 mb-1">{metrics.roe}%</div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">Return on Equity</div>
                    <div className="text-xs text-gray-500 mt-1">Target: &gt;15%</div>
                    <div className="mt-2 text-xs font-medium text-purple-600">Exceeds Target</div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
                    <div className="text-2xl font-bold text-amber-700 mb-1">{metrics.nplRatio}%</div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">NPL Ratio</div>
                    <div className="text-xs text-gray-500 mt-1">Threshold: &lt;5%</div>
                    <div className="mt-2 text-xs font-medium text-amber-600">Controlled</div>
                  </div>
                  <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100 text-center">
                    <div className="text-2xl font-bold text-cyan-700 mb-1">{metrics.liquidityRatio}%</div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">Liquidity Ratio</div>
                    <div className="text-xs text-gray-500 mt-1">Min: 30%</div>
                    <div className="mt-2 text-xs font-medium text-cyan-600">Strong</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 text-center">
                    <div className="text-2xl font-bold text-emerald-700 mb-1">{metrics.shariahComplianceScore}%</div>
                    <div className="text-xs font-semibold text-gray-700 leading-tight">Shariah Score</div>
                    <div className="text-xs text-gray-500 mt-1">Min: 95%</div>
                    <div className="mt-2 text-xs font-medium text-emerald-600">Certified</div>
                  </div>
                </div>
              </div>

              {/* Customer Segments + Risk Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Segment Analysis */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Customer Segment Analysis</h3>
                      <p className="text-gray-600">Retail, SME & Corporate</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {customerInsights.map((segment, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-gray-900">{segment.segment} Banking</div>
                          <GrowthBadge value={segment.growth} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <div className="text-lg font-bold text-gray-900">{formatNumber(segment.count)}</div>
                            <div className="text-xs text-gray-500">Customers ({segment.percentage}%)</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900">{formatCurrency(segment.avgDeposit)}</div>
                            <div className="text-xs text-gray-500">Avg. Deposit</div>
                          </div>
                          <div>
                            <div className={`text-lg font-bold ${segment.churnRate > 3 ? 'text-red-600' : 'text-green-600'}`}>{segment.churnRate}%</div>
                            <div className="text-xs text-gray-500">Churn Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Dashboard */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Risk Dashboard</h3>
                      <p className="text-gray-600">Current Exposure vs Regulatory Thresholds</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {riskMetrics.map((risk, index) => (
                      <div key={index} className={`p-4 rounded-xl border ${risk.status === 'good' ? 'bg-green-50 border-green-100' : risk.status === 'warning' ? 'bg-yellow-50 border-yellow-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-gray-900">{risk.name}</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${risk.status === 'good' ? 'bg-green-200 text-green-800' : risk.status === 'warning' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                              {risk.status === 'good' ? 'NORMAL' : risk.status === 'warning' ? 'WARNING' : 'CRITICAL'}
                            </span>
                            <div className={`flex items-center gap-1 text-xs font-medium ${risk.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {risk.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                              {Math.abs(risk.trend)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Current: <span className="font-bold text-gray-900">{risk.current}%</span></span>
                          <span className="text-gray-500">Threshold: {risk.threshold}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${risk.status === 'good' ? 'bg-green-500' : risk.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min((risk.current / risk.threshold) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Branch Network Performance */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Branch Network Performance</h3>
                      <p className="text-gray-600">Top 5 Branches by Revenue — {metrics.branchCount} Total Active Branches</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Branch</th>
                        <th className="text-left py-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">State</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Customers</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Revenue</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Efficiency</th>
                        <th className="text-right py-3 px-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchPerformance.map((branch, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{index + 1}</div>
                              <span className="font-medium text-gray-900">{branch.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-gray-600">{branch.location}</td>
                          <td className="py-4 px-3 text-right font-medium text-gray-900">{formatNumber(branch.customers)}</td>
                          <td className="py-4 px-3 text-right font-bold text-gray-900">{formatCurrency(branch.revenue)}</td>
                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${branch.efficiency}%` }} />
                              </div>
                              <span className="text-sm font-bold text-blue-600">{branch.efficiency}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-right">
                            <GrowthBadge value={branch.growth} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Department Performance Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Department Performance</h3>
                      <p className="text-gray-600">Efficiency, Revenue & Growth Metrics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedGraphType}
                      onChange={(e) => setSelectedGraphType(e.target.value as 'performance' | 'revenue' | 'growth')}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium bg-white"
                    >
                      <option value="performance">Efficiency (%)</option>
                      <option value="revenue">Revenue (₦B)</option>
                      <option value="growth">Growth (%)</option>
                    </select>
                  </div>
                </div>

                {/* Department List */}
                <div className="space-y-4 mb-8">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900">{dept.name}</div>
                        <div className="text-base text-gray-600 mt-1">Department</div>
                      </div>
                      <div className="text-right mr-6">
                        <div className="font-bold text-2xl text-gray-900">{dept.efficiency}%</div>
                        <div className="text-base text-gray-600 mt-1">Efficiency</div>
                        <div className="text-sm text-blue-600 font-medium mt-1">{formatCurrency(dept.revenue)}</div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${dept.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        {dept.status === 'excellent' ? 'Excellent' : 'Good'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart at Bottom */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-xl text-gray-900 mb-6">Department {getChartUnit()}</h4>
                  <ProfessionalChart
                    data={departmentChartData}
                    barColor="#3B82F6"
                  />
                </div>
              </div>

              {/* Money Distribution Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PieChart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Bank Money Distribution</h3>
                      <p className="text-gray-600">Asset Allocation & Investment Portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDistributionType}
                      onChange={(e) => setSelectedDistributionType(e.target.value as 'money' | 'profit')}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                    >
                      <option value="money">Asset Distribution</option>
                      <option value="profit">Islamic Contracts Profit</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">
                      {selectedDistributionType === 'money' ? 'Asset Distribution (₦B)' : 'Profit by Contract (₦B)'}
                    </h4>
                    <ProfessionalPieChart
                      data={distributionChartData}
                      showLegend={false}
                      showLabels={true}
                    />
                  </div>
                  <div className="space-y-4">
                    {(selectedDistributionType === 'money' ? moneyDistribution : islamicContracts).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: selectedDistributionType === 'money' ? item.color : (item as IslamicContract).color }}
                          ></div>
                          <div>
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600">
                              {selectedDistributionType === 'money' ?
                                `${(item as typeof moneyDistribution[0]).percentage}% of total assets` :
                                `${(item as IslamicContract).percentage}% of profit`
                              }
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-gray-900">
                            {selectedDistributionType === 'money' ?
                              formatCurrency((item as typeof moneyDistribution[0]).value) :
                              formatCurrency((item as IslamicContract).profit)
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI-Powered Insights Panel */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Brain className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI Strategic Insights</h3>
                    <p className="text-gray-600">Smart Recommendations & Predictions</p>
                  </div>
                  <div className="ml-auto">
                    <div className="px-3 py-1 bg-yellow-200 rounded-full text-xs font-medium text-yellow-800">
                      Live Analysis
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiInsights.slice(0, 4).map((insight, index) => (
                    <div key={insight.id} className="bg-white rounded-xl p-6 border border-yellow-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${insight.type === 'recommendation' ? 'bg-blue-100' :
                          insight.type === 'forecast' ? 'bg-green-100' :
                            insight.type === 'alert' ? 'bg-red-100' : 'bg-purple-100'
                          }`}>
                          {insight.type === 'recommendation' ? <Lightbulb className="w-5 h-5 text-blue-600" /> :
                            insight.type === 'forecast' ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                              insight.type === 'alert' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                                <Eye className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-gray-900">{insight.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                              insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                              {insight.impact.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{insight.content}</p>
                          <div className="mt-2 text-xs text-gray-500">{insight.category}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          )}
        </div>
      </div>
    </div>
  );
}
