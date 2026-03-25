'use client';

import { useState } from 'react';
import { Landmark, TrendingUp, CheckCircle, AlertTriangle, Clock, DollarSign, BarChart2, FileText } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import ProfessionalChart from '@/components/ui/ProfessionalChart';

const loanApprovals = [
  { ref: 'LN-2025-0041', applicant: 'Adewale Traders Ltd', branch: 'Lagos VI', amount: '₦8,500,000', type: 'SME Loan', recommendedBy: 'Emeka Nwosu (BM)', par: 'Low Risk', priority: 'high' },
  { ref: 'LN-2025-0039', applicant: 'Mrs. Hauwa Bello', branch: 'Kano Main', amount: '₦1,200,000', type: 'Personal Loan', recommendedBy: 'Musa Usman (BM)', par: 'Medium Risk', priority: 'medium' },
  { ref: 'LN-2025-0037', applicant: 'Sunrise Farms Ltd', branch: 'Abuja Central', amount: '₦22,000,000', type: 'Agricultural Loan', recommendedBy: 'Amina Garba (BM)', par: 'Low Risk', priority: 'high' },
  { ref: 'LN-2025-0035', applicant: 'Mr. Chukwudi Obi', branch: 'Port Harcourt', amount: '₦500,000', type: 'Consumer Loan', recommendedBy: 'Chisom Eze (BM)', par: 'Low Risk', priority: 'low' },
];

const portfolio = [
  { product: 'SME Loans', totalValue: '₦3.8B', activeLoans: 142, parRatio: '3.2%', parStatus: 'good' },
  { product: 'Personal Loans', totalValue: '₦1.2B', activeLoans: 891, parRatio: '5.1%', parStatus: 'watch' },
  { product: 'Agricultural Loans', totalValue: '₦2.1B', activeLoans: 74, parRatio: '2.8%', parStatus: 'good' },
  { product: 'Mortgage / Housing', totalValue: '₦5.4B', activeLoans: 38, parRatio: '1.9%', parStatus: 'good' },
  { product: 'Consumer Loans', totalValue: '₦0.6B', activeLoans: 1240, parRatio: '7.4%', parStatus: 'warning' },
];

const disbursementTrend = [
  { name: 'Aug', value: 480 },
  { name: 'Sep', value: 520 },
  { name: 'Oct', value: 610 },
  { name: 'Nov', value: 575 },
  { name: 'Dec', value: 390 },
  { name: 'Jan', value: 640 },
];

export default function HeadCreditDashboard() {
  const [approving, setApproving] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());

  const handleApprove = (ref: string) => {
    setApproving(ref);
    setTimeout(() => {
      setApproved(prev => new Set(prev).add(ref));
      setApproving(null);
    }, 900);
  };

  const pendingCount = loanApprovals.filter(l => !approved.has(l.ref)).length;
  const totalPortfolio = '₦13.1B';

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="head-credit" userName="Ibrahim Yusuf" userEmail="ibrahim@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-yellow-800 to-yellow-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Head of Credit</h1>
              <p className="text-yellow-200 text-sm">Lending oversight — loan approvals, portfolio management, credit policy</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Portfolio', value: totalPortfolio, color: 'text-white' },
                { label: 'Active Loans', value: '2,385', color: 'text-white' },
                { label: 'Awaiting Approval', value: pendingCount, color: pendingCount > 0 ? 'text-yellow-300' : 'text-yellow-200' },
                { label: 'Avg PAR Ratio', value: '4.1%', color: 'text-green-300' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-4 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-yellow-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart + Quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <BarChart2 className="w-4 h-4 text-yellow-700" />
              <h3 className="font-bold text-[#0A1F44]">Monthly Loan Disbursements (₦ Millions)</h3>
            </div>
            <ProfessionalChart data={disbursementTrend} barColor="#B45309" />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#0A1F44] mb-5">Separation of Duties</h3>
            <div className="space-y-3 text-sm">
              {[
                { role: 'Credit Officer', action: 'Creates application', icon: '1' },
                { role: 'Branch Manager', action: 'Recommends approval', icon: '2' },
                { role: 'Head of Credit', action: 'Final approval', icon: '3' },
                { role: 'Operations', action: 'Disburses funds', icon: '4' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-[#F8FAFC] rounded-lg">
                  <div className="w-6 h-6 bg-yellow-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{s.icon}</div>
                  <div>
                    <p className="font-semibold text-[#0A1F44] text-xs">{s.role}</p>
                    <p className="text-[#64748B] text-xs">{s.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loan Approvals Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <Landmark className="w-4 h-4 text-yellow-700" />
            <h3 className="font-bold text-[#0A1F44]">Loan Approval Queue</h3>
            {pendingCount > 0 && (
              <span className="ml-auto bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-1 rounded-full">{pendingCount} awaiting</span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {loanApprovals.map((loan) => {
              const isApproved = approved.has(loan.ref);
              return (
                <div key={loan.ref} className={`p-5 flex items-center gap-4 ${isApproved ? 'opacity-50' : ''}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${loan.priority === 'high' ? 'bg-[#F97316]' : loan.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-[#0A1F44] text-sm">{loan.ref}</span>
                      <span className="text-xs text-[#64748B]">· {loan.type} · {loan.branch}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        loan.par === 'Low Risk' ? 'bg-green-50 text-green-700' :
                        loan.par === 'Medium Risk' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                      }`}>{loan.par}</span>
                    </div>
                    <p className="text-sm font-bold text-[#0A1F44]">{loan.amount} — {loan.applicant}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Recommended by {loan.recommendedBy}</p>
                  </div>
                  {isApproved ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#0D9488]"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(loan.ref)}
                        disabled={approving === loan.ref}
                        className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        {approving === loan.ref ? 'Processing...' : 'Approve'}
                      </button>
                      <button className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-yellow-700" />
            <h3 className="font-bold text-[#0A1F44]">Loan Portfolio by Product</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100">
                  {['Product', 'Total Value', 'Active Loans', 'PAR Ratio', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#0A1F44] text-sm">{p.product}</td>
                    <td className="py-3.5 px-5 text-sm text-[#0A1F44] font-bold">{p.totalValue}</td>
                    <td className="py-3.5 px-5 text-sm text-[#64748B]">{p.activeLoans.toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-sm font-bold text-[#0A1F44]">{p.parRatio}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.parStatus === 'good' ? 'bg-green-50 text-green-700' :
                        p.parStatus === 'watch' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {p.parStatus === 'good' ? 'Healthy' : p.parStatus === 'watch' ? 'Watch List' : 'At Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
