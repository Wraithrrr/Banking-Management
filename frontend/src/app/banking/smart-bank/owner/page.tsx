'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authFetch } from '@/lib/auth-client';
import {
  TrendingUp, TrendingDown, Users, Building2, AlertTriangle,
  CheckCircle, ArrowUp, ArrowDown, DollarSign, Activity,
  Target, Shield, BarChart2, PieChart, Heart, MapPin,
  Briefcase, RefreshCw, AlertCircle, ChevronRight, Award,
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';
import type {
  MicrofinanceKPIs, LoanPortfolioSummary, RepaymentHealth,
  BranchPerformance, SavingsMobilization, SocialImpactMetrics,
  OperationalEfficiency, AlertItem, MicrofinanceDashboardData,
} from '@/types/owner-dashboard.types';

// ─── Mock data (shaped to match backend schema) ───────────────────────────────

const MOCK_KPIS: MicrofinanceKPIs = {
  totalLoanPortfolio: 850_000_000,
  portfolioGrowth: 22.4,
  activeBorrowers: 28_450,
  borrowerGrowth: 18.7,
  par30: 4.2,
  par30Trend: -0.8,
  par90: 1.9,
  ossRatio: 118,
  ossTarget: 100,
  totalCustomers: 35_200,
  customerGrowth: 15.3,
  activeStaff: 142,
  activeBranches: 8,
};

const MOCK_PORTFOLIO: LoanPortfolioSummary = {
  totalDisbursed: 2_340_000_000,
  outstandingBalance: 850_000_000,
  totalCollected: 1_420_000_000,
  writeOffs: 12_500_000,
  byProduct: [
    { product: 'Individual', activeLoans: 15_200, outstandingAmount: 380_000_000, par: 3.8, avgTermMonths: 6, avgLoanSize: 25_000 },
    { product: 'Group', activeLoans: 8_400, outstandingAmount: 210_000_000, par: 2.1, avgTermMonths: 4, avgLoanSize: 25_000 },
    { product: 'MSME', activeLoans: 3_800, outstandingAmount: 198_000_000, par: 6.4, avgTermMonths: 12, avgLoanSize: 52_105 },
    { product: 'Agricultural', activeLoans: 1_050, outstandingAmount: 62_000_000, par: 8.2, avgTermMonths: 9, avgLoanSize: 59_048 },
  ],
  monthlyTrend: [
    { month: 'Oct', disbursed: 105, repaid: 88, newBorrowers: 820 },
    { month: 'Nov', disbursed: 118, repaid: 96, newBorrowers: 910 },
    { month: 'Dec', disbursed: 95, repaid: 102, newBorrowers: 640 },
    { month: 'Jan', disbursed: 128, repaid: 112, newBorrowers: 980 },
    { month: 'Feb', disbursed: 142, repaid: 118, newBorrowers: 1_050 },
    { month: 'Mar', disbursed: 158, repaid: 131, newBorrowers: 1_120 },
  ],
};

const MOCK_REPAYMENT: RepaymentHealth = {
  onTimeRate: 91.4,
  par1to30: 3.9, par1to30Amount: 33_150_000,
  par31to90: 2.3, par31to90Amount: 19_550_000,
  par90plus: 1.9, par90plusAmount: 16_150_000,
  writeOffRate: 1.5,
};

const MOCK_BRANCHES: BranchPerformance[] = [
  { id: 1, name: 'Lagos Mainland', location: 'Lagos', loanOfficerCount: 22, activeBorrowers: 6_200, portfolioSize: 188_000_000, par30: 2.8, collectionRate: 94.5, efficiencyScore: 92, status: 'excellent' },
  { id: 2, name: 'Abuja Garki', location: 'FCT', loanOfficerCount: 18, activeBorrowers: 4_800, portfolioSize: 154_000_000, par30: 3.4, collectionRate: 93.1, efficiencyScore: 88, status: 'excellent' },
  { id: 3, name: 'Kano Central', location: 'Kano', loanOfficerCount: 16, activeBorrowers: 4_200, portfolioSize: 126_000_000, par30: 5.1, collectionRate: 91.2, efficiencyScore: 81, status: 'good' },
  { id: 4, name: 'Port Harcourt', location: 'Rivers', loanOfficerCount: 15, activeBorrowers: 3_850, portfolioSize: 118_000_000, par30: 4.6, collectionRate: 91.8, efficiencyScore: 83, status: 'good' },
  { id: 5, name: 'Ibadan North', location: 'Oyo', loanOfficerCount: 14, activeBorrowers: 3_400, portfolioSize: 98_000_000, par30: 6.2, collectionRate: 89.4, efficiencyScore: 74, status: 'needs-attention' },
  { id: 6, name: 'Enugu GRA', location: 'Enugu', loanOfficerCount: 12, activeBorrowers: 2_900, portfolioSize: 82_000_000, par30: 7.8, collectionRate: 87.2, efficiencyScore: 66, status: 'needs-attention' },
  { id: 7, name: 'Kaduna South', location: 'Kaduna', loanOfficerCount: 11, activeBorrowers: 2_100, portfolioSize: 58_000_000, par30: 5.8, collectionRate: 90.1, efficiencyScore: 78, status: 'good' },
  { id: 8, name: 'Abeokuta', location: 'Ogun', loanOfficerCount: 10, activeBorrowers: 1_000, portfolioSize: 26_000_000, par30: 11.4, collectionRate: 83.5, efficiencyScore: 48, status: 'critical' },
];

const MOCK_SAVINGS: SavingsMobilization = {
  totalDeposits: 312_000_000,
  depositGrowth: 28.6,
  avgBalancePerCustomer: 8_863,
  activeSavingsAccounts: 35_200,
  monthlyDepositTrend: [
    { month: 'Oct', amount: 224 }, { month: 'Nov', amount: 238 },
    { month: 'Dec', amount: 251 }, { month: 'Jan', amount: 270 },
    { month: 'Feb', amount: 289 }, { month: 'Mar', amount: 312 },
  ],
  segments: [
    { type: 'Individual', count: 24_800, percentage: 70.5, avgLoanSize: 22_000, newThisMonth: 1_120 },
    { type: 'Group', count: 8_400, percentage: 23.9, avgLoanSize: 18_500, newThisMonth: 320 },
    { type: 'MSME', count: 2_000, percentage: 5.7, avgLoanSize: 85_000, newThisMonth: 85 },
  ],
  kycStatus: { approved: 31_840, pending: 3_360 },
};

const MOCK_IMPACT: SocialImpactMetrics = {
  totalBeneficiaries: 35_200,
  femalePercentage: 68.4,
  ruralPercentage: 42.1,
  estimatedJobsCreated: 18_450,
  csrSpending: 8_500_000,
  sustainabilityScore: 74,
  sustainabilityBreakdown: {
    repaymentHealth: 82,
    outreachGrowth: 78,
    genderInclusion: 86,
    ruralPenetration: 64,
  },
};

const MOCK_OPEX: OperationalEfficiency = {
  totalOpex: 185_000_000,
  costPerBorrower: 6_503,
  costPerOfficer: 1_302_817,
  opexRatio: 21.8,
  opexTarget: 20.0,
  staffByRole: [
    { role: 'Loan Officers', count: 88 },
    { role: 'Branch Managers', count: 8 },
    { role: 'Customer Service', count: 18 },
    { role: 'Credit Officers', count: 12 },
    { role: 'Operations', count: 10 },
    { role: 'Tellers', count: 6 },
  ],
};

const MOCK_ALERTS: AlertItem[] = [
  { id: '1', type: 'critical', title: 'PAR >10% — Abeokuta Branch', detail: 'PAR30 at 11.4%, exceeding the 10% threshold. Immediate field review required.', branchName: 'Abeokuta', value: 11.4 },
  { id: '2', type: 'warning', title: 'OpEx Ratio Above Target', detail: 'Operating expense ratio at 21.8% vs 20% target. Review discretionary spend.', value: 21.8 },
  { id: '3', type: 'warning', title: 'KYC Backlog — 3,360 Pending', detail: '3,360 customers awaiting KYC approval. Compliance team capacity may be constrained.' },
  { id: '4', type: 'info', title: 'OSS Ratio Healthy at 118%', detail: 'Operational self-sufficiency is above target, indicating financial sustainability.' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) => {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n.toLocaleString()}`;
};

const fmtNum = (n: number) => n.toLocaleString('en-NG');

const GrowthBadge = ({ value, inverted = false }: { value: number; inverted?: boolean }) => {
  const isGood = inverted ? value <= 0 : value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${isGood ? 'text-emerald-600' : 'text-red-500'}`}>
      {value >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(value)}%
    </span>
  );
};

const statusColors: Record<BranchPerformance['status'], string> = {
  excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  good: 'bg-blue-50 text-blue-700 border-blue-200',
  'needs-attention': 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

const parColor = (par: number) =>
  par <= 5 ? 'text-emerald-600' : par <= 8 ? 'text-amber-600' : 'text-red-600';

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'executive', label: 'Executive Overview', icon: BarChart2 },
  { id: 'portfolio', label: 'Loan Portfolio', icon: DollarSign },
  { id: 'branches', label: 'Branch & Field', icon: Building2 },
  { id: 'savings', label: 'Savings & Customers', icon: Users },
  { id: 'impact', label: 'Social Impact & Ops', icon: Heart },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

function OwnerDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get('tab') as typeof TABS[number]['id']) || 'executive';

  const setTab = (id: string) => router.push(`?tab=${id}`);

  const [liveData, setLiveData] = useState<MicrofinanceDashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/owner/metrics');
      if (res.ok) setLiveData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMetrics(); }, [fetchMetrics]);

  const kpis      = liveData?.kpis             ?? MOCK_KPIS;
  const portfolio = liveData?.loanPortfolio   ?? MOCK_PORTFOLIO;
  const repayment = liveData?.repaymentHealth ?? MOCK_REPAYMENT;
  const branches  = liveData?.branches        ?? MOCK_BRANCHES;
  const savings   = liveData?.savings         ?? MOCK_SAVINGS;
  const impact    = liveData?.socialImpact    ?? MOCK_IMPACT;
  const opex      = liveData?.operationalEfficiency ?? MOCK_OPEX;
  const alerts    = liveData?.alerts          ?? MOCK_ALERTS;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="owner" />

      <div className="flex-1 min-w-0 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-[#0A1F44] rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">MD / CEO Dashboard</h1>
              <p className="text-blue-300 text-sm">Microfinance Bank — Executive Command Centre</p>
              {liveData && <p className="text-blue-400 text-xs mt-1">Live data · {new Date(liveData.generatedAt).toLocaleTimeString()}</p>}
            </div>
            <button onClick={fetchMetrics} disabled={loading} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Portfolio', value: fmt(kpis.totalLoanPortfolio), color: 'text-white' },
                { label: 'Borrowers', value: fmtNum(kpis.activeBorrowers), color: 'text-emerald-400' },
                { label: 'PAR30', value: `${kpis.par30}%`, color: kpis.par30 > 5 ? 'text-amber-400' : 'text-emerald-400' },
                { label: 'OSS', value: `${kpis.ossRatio}%`, color: 'text-blue-300' },
              ].map(s => (
                <div key={s.label} className="text-center bg-white/10 rounded-xl px-5 py-3 min-w-[80px]">
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Strip */}
        {alerts.filter(a => a.type !== 'info').length > 0 && (
          <div className="space-y-2">
            {alerts.filter(a => a.type !== 'info').map(alert => (
              <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-xl border ${
                alert.type === 'critical' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${alert.type === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${alert.type === 'critical' ? 'text-red-700' : 'text-amber-700'}`}>{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{alert.detail}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[#0A1F44] text-white shadow'
                    : 'text-[#64748B] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab: Executive Overview ── */}
        {activeTab === 'executive' && (
          <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Loan Portfolio', value: fmt(kpis.totalLoanPortfolio), growth: kpis.portfolioGrowth, icon: DollarSign, color: 'bg-blue-600' },
                { label: 'Active Borrowers', value: fmtNum(kpis.activeBorrowers), growth: kpis.borrowerGrowth, icon: Users, color: 'bg-emerald-600' },
                { label: 'PAR30 (Portfolio at Risk)', value: `${kpis.par30}%`, growth: kpis.par30Trend, icon: AlertTriangle, color: 'bg-amber-500', invertGrowth: true },
                { label: 'OSS Ratio', value: `${kpis.ossRatio}%`, growth: kpis.ossRatio - kpis.ossTarget, icon: Target, color: 'bg-violet-600' },
              ].map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <GrowthBadge value={k.growth} inverted={k.invertGrowth} />
                    </div>
                    <div className="text-2xl font-bold text-[#0A1F44]">{k.value}</div>
                    <div className="text-xs text-[#64748B] mt-1">{k.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Disbursement vs Repayment trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-[#0A1F44]">Disbursement vs Repayment</h3>
                    <p className="text-xs text-[#64748B]">₦ Millions — last 6 months</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {portfolio.monthlyTrend.map(m => (
                    <div key={m.month} className="grid grid-cols-[48px_1fr_1fr_60px_60px] items-center gap-3 text-sm">
                      <span className="text-xs font-semibold text-[#64748B]">{m.month}</span>
                      <div>
                        <div className="text-xs text-blue-600 mb-0.5">Disbursed</div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(m.disbursed / 160) * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-emerald-600 mb-0.5">Repaid</div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(m.repaid / 160) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600 text-right">₦{m.disbursed}M</span>
                      <span className="text-xs font-bold text-emerald-600 text-right">₦{m.repaid}M</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan type pie */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-1">Loan Portfolio Mix</h3>
                <p className="text-xs text-[#64748B] mb-4">By product type</p>
                <ProfessionalPieChart
                  data={portfolio.byProduct.map(p => ({
                    name: p.product,
                    value: p.outstandingAmount / 1_000_000,
                    percentage: Math.round((p.outstandingAmount / kpis.totalLoanPortfolio) * 100),
                    color: p.product === 'Individual' ? '#3B82F6' : p.product === 'Group' ? '#10B981' : p.product === 'MSME' ? '#8B5CF6' : '#F59E0B',
                  }))}
                  showLegend
                />
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Customers', value: fmtNum(kpis.totalCustomers), sub: `+${kpis.customerGrowth}% growth`, icon: Users },
                { label: 'Active Branches', value: kpis.activeBranches, sub: '8 locations nationwide', icon: MapPin },
                { label: 'Active Staff', value: kpis.activeStaff, sub: '88 loan officers', icon: Briefcase },
                { label: 'PAR90', value: `${kpis.par90}%`, sub: 'Below 2% threshold', icon: Shield },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#0A1F44]" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-[#0A1F44]">{value_s(s.value)}</div>
                      <div className="text-xs text-[#64748B]">{s.label}</div>
                      <div className="text-xs text-[#94A3B8] mt-0.5">{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tab: Loan Portfolio ── */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Disbursed', value: fmt(portfolio.totalDisbursed), color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Outstanding Balance', value: fmt(portfolio.outstandingBalance), color: 'text-[#0A1F44]', bg: 'bg-slate-50' },
                { label: 'Total Collected', value: fmt(portfolio.totalCollected), color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Write-offs', value: fmt(portfolio.writeOffs), color: 'text-red-600', bg: 'bg-red-50' },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-2xl p-5 border border-gray-100`}>
                  <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* PAR gauges */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0A1F44] mb-1">Portfolio at Risk (PAR)</h3>
              <p className="text-xs text-[#64748B] mb-5">Lower is better — CBN guideline: PAR30 ≤ 5%</p>
              <div className="space-y-5">
                {[
                  { label: 'PAR1-30 (Early delinquency)', value: repayment.par1to30, amount: repayment.par1to30Amount, threshold: 5 },
                  { label: 'PAR31-90 (At risk)', value: repayment.par31to90, amount: repayment.par31to90Amount, threshold: 3 },
                  { label: 'PAR90+ (High risk / write-off zone)', value: repayment.par90plus, amount: repayment.par90plusAmount, threshold: 2 },
                ].map(p => {
                  const exceeded = p.value > p.threshold;
                  return (
                    <div key={p.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-[#0A1F44]">{p.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#64748B]">{fmt(p.amount)}</span>
                          <span className={`text-sm font-bold ${parColor(p.value)}`}>{p.value}%</span>
                        </div>
                      </div>
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${exceeded ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((p.value / 15) * 100, 100)}%` }}
                        />
                        {/* Threshold marker */}
                        <div
                          className="absolute top-0 h-full w-0.5 bg-gray-400 opacity-60"
                          style={{ left: `${(p.threshold / 15) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                        <span>0%</span>
                        <span>Threshold: {p.threshold}%</span>
                        <span>15%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Loan product breakdown table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-[#0A1F44]">Loan Product Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-gray-100">
                      {['Product', 'Active Loans', 'Outstanding', 'PAR30', 'Avg Term', 'Avg Loan Size'].map(h => (
                        <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.byProduct.map(p => (
                      <tr key={p.product} className="border-b border-gray-50 hover:bg-[#F8FAFC]">
                        <td className="py-4 px-5 font-semibold text-[#0A1F44] text-sm">{p.product}</td>
                        <td className="py-4 px-5 text-sm text-[#64748B]">{fmtNum(p.activeLoans)}</td>
                        <td className="py-4 px-5 text-sm font-medium text-[#0A1F44]">{fmt(p.outstandingAmount)}</td>
                        <td className="py-4 px-5">
                          <span className={`text-sm font-bold ${parColor(p.par)}`}>{p.par}%</span>
                        </td>
                        <td className="py-4 px-5 text-sm text-[#64748B]">{p.avgTermMonths} months</td>
                        <td className="py-4 px-5 text-sm text-[#64748B]">{fmt(p.avgLoanSize)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Repayment health */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'On-Time Rate', value: `${repayment.onTimeRate}%`, good: true },
                { label: 'PAR30', value: `${kpis.par30}%`, good: kpis.par30 <= 5 },
                { label: 'PAR90', value: `${kpis.par90}%`, good: kpis.par90 <= 2 },
                { label: 'Write-off Rate', value: `${repayment.writeOffRate}%`, good: repayment.writeOffRate <= 2 },
              ].map(r => (
                <div key={r.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                  <div className={`text-2xl font-bold ${r.good ? 'text-emerald-600' : 'text-red-500'}`}>{r.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{r.label}</div>
                  <div className={`text-xs font-medium mt-1 ${r.good ? 'text-emerald-500' : 'text-red-400'}`}>
                    {r.good ? '✓ Within target' : '⚠ Exceeds target'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Branch & Field ── */}
        {activeTab === 'branches' && (
          <div className="space-y-6">

            {/* Field officer productivity summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { label: 'Avg Loans per Officer', value: Math.round(kpis.activeBorrowers / 88).toString(), sub: '88 active loan officers', icon: Users },
                { label: 'Network Collection Rate', value: '91.4%', sub: 'Across all branches', icon: TrendingUp },
                { label: 'Branches Above PAR Target', value: `${branches.filter(b => b.par30 <= 5).length} / ${branches.length}`, sub: 'PAR30 ≤ 5% threshold', icon: CheckCircle },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#0A1F44]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#0A1F44]">{s.value}</div>
                      <div className="text-xs text-[#64748B]">{s.label}</div>
                      <div className="text-xs text-[#94A3B8] mt-0.5">{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Branch table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#0A1F44]">Branch Performance</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Ranked by efficiency score</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">Top 2 highlighted</span>
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded-full font-medium">Bottom 1 flagged</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-gray-100">
                      {['Branch', 'Location', 'Officers', 'Borrowers', 'Portfolio', 'PAR30', 'Collection', 'Score', 'Status'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...branches].sort((a, b) => b.efficiencyScore - a.efficiencyScore).map((b, idx) => {
                      const isTop = idx < 2;
                      const isBottom = b.status === 'critical';
                      return (
                        <tr key={b.id} className={`border-b border-gray-50 ${isTop ? 'bg-emerald-50/30' : isBottom ? 'bg-red-50/30' : 'hover:bg-[#F8FAFC]'}`}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              {isTop && <Award className="w-3.5 h-3.5 text-emerald-500" />}
                              {isBottom && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                              <span className="font-semibold text-[#0A1F44] text-sm">{b.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-sm text-[#64748B]">{b.location}</td>
                          <td className="py-3.5 px-4 text-sm text-[#64748B]">{b.loanOfficerCount}</td>
                          <td className="py-3.5 px-4 text-sm font-medium text-[#0A1F44]">{fmtNum(b.activeBorrowers)}</td>
                          <td className="py-3.5 px-4 text-sm text-[#64748B]">{fmt(b.portfolioSize)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-sm font-bold ${parColor(b.par30)}`}>{b.par30}%</span>
                          </td>
                          <td className="py-3.5 px-4 text-sm text-[#64748B]">{b.collectionRate}%</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${b.efficiencyScore >= 85 ? 'bg-emerald-500' : b.efficiencyScore >= 70 ? 'bg-amber-400' : 'bg-red-500'}`}
                                  style={{ width: `${b.efficiencyScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-[#0A1F44]">{b.efficiencyScore}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusColors[b.status]}`}>
                              {b.status.replace('-', ' ')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Field officer productivity bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0A1F44] mb-1">Loan Officer Load by Branch</h3>
              <p className="text-xs text-[#64748B] mb-5">Active borrowers per loan officer</p>
              <div className="space-y-3">
                {branches.map(b => {
                  const ratio = b.loanOfficerCount > 0 ? Math.round(b.activeBorrowers / b.loanOfficerCount) : 0;
                  const max = 350;
                  return (
                    <div key={b.id} className="grid grid-cols-[160px_1fr_48px] items-center gap-3">
                      <span className="text-sm text-[#0A1F44] font-medium truncate">{b.name}</span>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ratio > 300 ? 'bg-red-400' : ratio > 250 ? 'bg-amber-400' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min((ratio / max) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#64748B] text-right">{ratio}/off</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Savings & Customers ── */}
        {activeTab === 'savings' && (
          <div className="space-y-6">

            {/* Savings KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Deposits', value: fmt(savings.totalDeposits), growth: savings.depositGrowth, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Accounts', value: fmtNum(savings.activeSavingsAccounts), growth: kpis.customerGrowth, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Avg Balance / Customer', value: fmt(savings.avgBalancePerCustomer), growth: 0, color: 'text-violet-600', bg: 'bg-violet-50' },
                { label: 'KYC Approved', value: `${fmtNum(savings.kycStatus.approved)}`, growth: 0, color: 'text-[#0A1F44]', bg: 'bg-slate-50' },
              ].map(k => (
                <div key={k.label} className={`${k.bg} rounded-2xl p-5 border border-gray-100`}>
                  <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-[#64748B] mt-1">{k.label}</div>
                  {k.growth !== 0 && <GrowthBadge value={k.growth} />}
                </div>
              ))}
            </div>

            {/* KYC status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0A1F44] mb-1">KYC Status</h3>
              <p className="text-xs text-[#64748B] mb-4">Compliance approval pipeline</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-[#64748B] mb-1">
                    <span>Approved: {fmtNum(savings.kycStatus.approved)}</span>
                    <span>Pending: {fmtNum(savings.kycStatus.pending)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(savings.kycStatus.approved / (savings.kycStatus.approved + savings.kycStatus.pending)) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-lg font-bold text-emerald-600">
                  {((savings.kycStatus.approved / (savings.kycStatus.approved + savings.kycStatus.pending)) * 100).toFixed(1)}%
                </span>
              </div>
              {savings.kycStatus.pending > 0 && (
                <div className="mt-3 flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-xs text-amber-700">{fmtNum(savings.kycStatus.pending)} customers awaiting KYC — compliance team may need capacity support.</p>
                </div>
              )}
            </div>

            {/* Customer segmentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-1">Customer Segments</h3>
                <p className="text-xs text-[#64748B] mb-5">By borrower type</p>
                <div className="space-y-4">
                  {savings.segments.map((seg, i) => {
                    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500'];
                    return (
                      <div key={seg.type}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colors[i]}`} />
                            <span className="text-sm font-medium text-[#0A1F44]">{seg.type}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-[#0A1F44]">{fmtNum(seg.count)}</span>
                            <span className="text-xs text-[#64748B] ml-1">({seg.percentage}%)</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${seg.percentage}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-[#94A3B8] mt-0.5">
                          <span>Avg loan: {fmt(seg.avgLoanSize)}</span>
                          <span>+{seg.newThisMonth} new this month</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Deposit growth trend */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-1">Savings Deposit Trend</h3>
                <p className="text-xs text-[#64748B] mb-4">₦ Millions — last 6 months</p>
                <ProfessionalChart
                  data={savings.monthlyDepositTrend.map(m => ({ name: m.month, value: m.amount }))}
                  barColor="#10B981"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Social Impact & Ops ── */}
        {activeTab === 'impact' && (
          <div className="space-y-6">

            {/* Social impact cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Beneficiaries', value: fmtNum(impact.totalBeneficiaries), icon: Heart, color: 'bg-rose-500' },
                { label: 'Female Borrowers', value: `${impact.femalePercentage}%`, icon: Users, color: 'bg-pink-500' },
                { label: 'Rural Penetration', value: `${impact.ruralPercentage}%`, icon: MapPin, color: 'bg-amber-500' },
                { label: 'Jobs Supported', value: fmtNum(impact.estimatedJobsCreated), icon: Briefcase, color: 'bg-emerald-600' },
              ].map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-[#0A1F44]">{k.value}</div>
                    <div className="text-xs text-[#64748B] mt-1">{k.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Sustainability score */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-bold text-[#0A1F44]">Sustainability Score</h3>
                  <p className="text-xs text-[#64748B]">Composite of repayment health, outreach, inclusion, and rural penetration</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-[#0A1F44]">{impact.sustainabilityScore}</div>
                  <div className="text-xs text-[#64748B]">out of 100</div>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(impact.sustainabilityBreakdown).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    repaymentHealth: 'Repayment Health',
                    outreachGrowth: 'Outreach & Growth',
                    genderInclusion: 'Gender Inclusion',
                    ruralPenetration: 'Rural Penetration',
                  };
                  return (
                    <div key={key} className="grid grid-cols-[160px_1fr_36px] items-center gap-3">
                      <span className="text-sm text-[#64748B]">{labels[key]}</span>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${val >= 80 ? 'bg-emerald-500' : val >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${val}%` }} />
                      </div>
                      <span className="text-sm font-bold text-[#0A1F44] text-right">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operational efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-5">Operational Efficiency</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Cost per Borrower', value: fmt(opex.costPerBorrower), status: 'good' as const },
                    { label: 'Cost per Loan Officer', value: fmt(opex.costPerOfficer), status: 'good' as const },
                    { label: 'OpEx Ratio', value: `${opex.opexRatio}%`, status: opex.opexRatio > opex.opexTarget ? 'warn' : 'good' as const },
                    { label: 'Total Operating Expenses', value: fmt(opex.totalOpex), status: 'neutral' as const },
                    { label: 'CSR / Community Spend', value: fmt(impact.csrSpending), status: 'neutral' as const },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-[#64748B]">{row.label}</span>
                      <span className={`text-sm font-bold ${row.status === 'warn' ? 'text-amber-600' : row.status === 'good' ? 'text-[#0A1F44]' : 'text-[#0A1F44]'}`}>
                        {row.value}
                        {row.status === 'warn' && <span className="ml-1.5 text-xs text-amber-500">⚠ Above target</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-1">Staff Headcount by Role</h3>
                <p className="text-xs text-[#64748B] mb-4">Total: {kpis.activeStaff} employees</p>
                <ProfessionalChart
                  data={opex.staffByRole.map(s => ({ name: s.role, value: s.count }))}
                  barColor="#0A1F44"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" /></div>}>
      <OwnerDashboardInner />
    </Suspense>
  );
}

// tiny helper to allow number | string display
function value_s(v: number | string): string {
  return typeof v === 'number' ? v.toString() : v;
}
