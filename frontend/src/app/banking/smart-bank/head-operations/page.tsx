'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, GitBranch, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import ProfessionalChart from '@/components/ui/ProfessionalChart';

const branchPerformance = [
  { branch: 'Lagos Victoria Island', manager: 'Emeka Nwosu', txnToday: 312, efficiency: 94, revenue: '₦2.8B', status: 'excellent' },
  { branch: 'Abuja Central', manager: 'Amina Garba', txnToday: 274, efficiency: 91, revenue: '₦2.4B', status: 'excellent' },
  { branch: 'Kano Main', manager: 'Musa Usman', txnToday: 198, efficiency: 87, revenue: '₦1.9B', status: 'good' },
  { branch: 'Port Harcourt', manager: 'Chisom Eze', txnToday: 163, efficiency: 82, revenue: '₦1.6B', status: 'good' },
  { branch: 'Ibadan North', manager: 'Seun Adeyemi', txnToday: 121, efficiency: 74, revenue: '₦1.1B', status: 'warning' },
];

const pendingApprovals = [
  { ref: 'TXN-9921', branch: 'Lagos VI', type: 'High-Value Transfer', amount: '₦12,500,000', requestedBy: 'Emeka Nwosu', time: '10:32 AM', priority: 'high' },
  { ref: 'TXN-9918', branch: 'Abuja Central', type: 'Cash Withdrawal', amount: '₦8,000,000', requestedBy: 'Amina Garba', time: '10:15 AM', priority: 'high' },
  { ref: 'TXN-9905', branch: 'Kano Main', type: 'Inter-Bank Transfer', amount: '₦3,200,000', requestedBy: 'Musa Usman', time: '09:44 AM', priority: 'medium' },
  { ref: 'TXN-9899', branch: 'Port Harcourt', type: 'Bulk Salary Payment', amount: '₦5,750,000', requestedBy: 'Chisom Eze', time: '09:20 AM', priority: 'medium' },
];

const escalations = [
  { ref: 'ESC-0071', branch: 'Ibadan North', issue: 'Teller cash discrepancy — ₦45,000 shortfall', raisedBy: 'Seun Adeyemi', time: '11:05 AM', severity: 'high' },
  { ref: 'ESC-0070', branch: 'Lagos VI', issue: 'Customer complaint: 3-day delay on account funding', raisedBy: 'Emeka Nwosu', time: '09:58 AM', severity: 'medium' },
  { ref: 'ESC-0069', branch: 'Kano Main', issue: 'System downtime during end-of-day reconciliation', raisedBy: 'Musa Usman', time: 'Yesterday', severity: 'medium' },
];

const txnTrend = [
  { name: 'Mon', value: 1240 },
  { name: 'Tue', value: 1380 },
  { name: 'Wed', value: 1195 },
  { name: 'Thu', value: 1490 },
  { name: 'Fri', value: 1620 },
  { name: 'Sat', value: 870 },
  { name: 'Today', value: 1068 },
];

export default function HeadOperationsDashboard() {
  const [approving, setApproving] = useState<string | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());

  const handleApprove = (ref: string) => {
    setApproving(ref);
    setTimeout(() => {
      setApproved(prev => new Set(prev).add(ref));
      setApproving(null);
    }, 800);
  };

  const totalTxnToday = branchPerformance.reduce((s, b) => s + b.txnToday, 0);
  const pendingCount = pendingApprovals.filter(p => !approved.has(p.ref)).length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="head-operations" userName="Taiwo Adekunle" userEmail="taiwo@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Head of Operations</h1>
              <p className="text-teal-200 text-sm">Bank-wide operational oversight — all branches</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Active Branches', value: branchPerformance.length, sub: '↑ all online', color: 'text-white' },
                { label: "Today's Transactions", value: totalTxnToday.toLocaleString(), sub: '+8.2% vs yesterday', color: 'text-white' },
                { label: 'Pending Approvals', value: pendingCount, sub: 'requires action', color: pendingCount > 0 ? 'text-yellow-300' : 'text-teal-200' },
                { label: 'Open Escalations', value: escalations.length, sub: '1 high priority', color: 'text-red-300' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-4 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-teal-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <BarChart2 className="w-4 h-4 text-teal-700" />
              <h3 className="font-bold text-[#0A1F44]">Transaction Volume — Last 7 Days</h3>
            </div>
            <ProfessionalChart data={txnTrend} barColor="#0D9488" />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-[#0A1F44] mb-5">Branch Status</h3>
            <div className="space-y-3">
              {branchPerformance.map((b, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0A1F44] truncate max-w-[130px]">{b.branch}</p>
                    <p className="text-xs text-[#64748B]">{b.txnToday} txns today</p>
                  </div>
                  <div className="text-right">
                    <div className="w-20 bg-gray-100 rounded-full h-2 mb-1">
                      <div className={`h-2 rounded-full ${b.efficiency >= 90 ? 'bg-[#0D9488]' : b.efficiency >= 80 ? 'bg-[#F97316]' : 'bg-red-500'}`} style={{ width: `${b.efficiency}%` }} />
                    </div>
                    <p className="text-xs text-[#64748B]">{b.efficiency}% eff.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <Activity className="w-4 h-4 text-teal-700" />
            <h3 className="font-bold text-[#0A1F44]">Pending Transaction Approvals</h3>
            {pendingCount > 0 && (
              <span className="ml-auto bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-1 rounded-full">{pendingCount} pending</span>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {pendingApprovals.map((p) => {
              const isApproved = approved.has(p.ref);
              return (
                <div key={p.ref} className={`p-5 flex items-center gap-4 ${isApproved ? 'opacity-50' : ''}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[#0A1F44] text-sm">{p.ref}</span>
                      <span className="text-xs text-[#64748B]">· {p.branch} · {p.type}</span>
                    </div>
                    <p className="text-sm text-[#0A1F44] font-semibold">{p.amount}</p>
                    <p className="text-xs text-[#64748B]">Requested by {p.requestedBy} at {p.time}</p>
                  </div>
                  {isApproved ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#0D9488]"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(p.ref)}
                        disabled={approving === p.ref}
                        className="px-4 py-2 bg-[#0D9488] hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        {approving === p.ref ? 'Processing...' : 'Approve'}
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

        {/* Escalations */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <h3 className="font-bold text-[#0A1F44]">Active Escalations</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {escalations.map((e) => (
              <div key={e.ref} className="p-5 flex items-start gap-4">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${e.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#0A1F44] text-sm">{e.ref}</span>
                    <span className="text-xs text-[#64748B]">· {e.branch}</span>
                  </div>
                  <p className="text-sm text-[#0A1F44]">{e.issue}</p>
                  <p className="text-xs text-[#64748B] mt-1">Raised by {e.raisedBy} · {e.time}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#0A1F44] text-white rounded-lg text-xs font-semibold hover:bg-[#1E3A5F] transition-colors">
                  Handle
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
