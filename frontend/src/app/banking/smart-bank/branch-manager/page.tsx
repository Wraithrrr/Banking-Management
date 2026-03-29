'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import {
  Users, TrendingUp, Activity, ArrowUp, ArrowDown, Clock,
  MapPin, CheckCircle, AlertTriangle, DollarSign, Loader2, RefreshCw, X,
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import DocumentManager from '@/components/SmartBank/DocumentManager';
import { authFetch, getStoredUser } from '@/lib/auth-client';
import { useSearchParams } from 'next/navigation';

interface Loan {
  id: number; customerName: string; accountNumber: string; type: string;
  amount: string; purpose: string; termMonths: number; status: string;
  createdAt: string; declineReason?: string;
  creditOfficer?: { fullName: string };
}

const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });

function BranchManagerInner() {
  const user = getStoredUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'loans' | 'documents'>('overview');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [declineModal, setDeclineModal] = useState<Loan | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'loans') setActiveTab('loans');
    else if (tab === 'documents') setActiveTab('documents');
  }, [searchParams]);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/loans');
      if (res.ok) setLoans(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (activeTab === 'loans') loadLoans();
  }, [activeTab, loadLoans]);

  const handleDecision = async (id: number, approve: boolean, reason?: string) => {
    setActionLoading(id); setIsSubmitting(true);
    try {
      await authFetch(`/loans/${id}/bm-decision`, {
        method: 'PATCH',
        body: JSON.stringify({ approve, declineReason: reason }),
      });
      setDeclineModal(null); setDeclineReason('');
      loadLoans();
    } finally { setActionLoading(null); setIsSubmitting(false); }
  };

  const pendingLoans = loans.filter(l => l.status === 'pending-bm');

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="branch-manager" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-7 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-green-300" />
                <span className="text-green-300 text-sm font-medium">Branch Manager</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">{user?.fullName ?? 'Branch Manager'}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm">Live · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[
                { label: 'Pending BM Review', value: pendingLoans.length, c: pendingLoans.length > 0 ? 'text-yellow-300' : 'text-green-200' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[90px]">
                  <div className={`text-2xl font-bold ${s.c}`}>{s.value}</div>
                  <div className="text-green-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Branch Overview' },
            { id: 'loans', label: `Loan Approvals${pendingLoans.length > 0 ? ` (${pendingLoans.length})` : ''}` },
            { id: 'documents', label: 'Branch Documents' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === t.id ? 'bg-green-800 text-white' : 'bg-white border border-gray-200 text-[#64748B] hover:bg-gray-50'}`}>{t.label}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Loans in Branch', value: loans.length, icon: TrendingUp, color: 'bg-blue-100 text-blue-600' },
                { label: 'Pending BM Review', value: pendingLoans.length, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
                { label: 'Approved/Disbursed', value: loans.filter(l => l.status === 'approved' || l.status === 'disbursed').length, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
                { label: 'Declined', value: loans.filter(l => l.status === 'declined').length, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${kpi.color} rounded-xl`}><kpi.icon className="w-5 h-5" /></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                  <div className="text-gray-500 text-sm">{kpi.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800"><span className="font-bold">Your Role:</span> As Branch Manager, you review and recommend loan applications from your Credit Officers before they go to the Head of Credit for final approval.</p>
            </div>
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-green-700" />
              <h3 className="font-bold text-[#0A1F44]">Loans Awaiting Your Recommendation</h3>
              {pendingLoans.length > 0 && <span className="ml-auto bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-1 rounded-full">{pendingLoans.length} pending</span>}
              <button onClick={loadLoans} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><RefreshCw className="w-3.5 h-3.5 text-gray-400" /></button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : pendingLoans.length === 0 ? (
              <div className="text-center py-12 text-[#64748B]">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-200" />
                <p className="font-medium text-sm">No loans pending your review</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingLoans.map(loan => (
                  <div key={loan.id} className="p-5 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-bold text-[#0A1F44] text-sm">{loan.customerName}</span>
                        <span className="text-xs text-[#64748B] font-mono">· {loan.accountNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">{loan.type}</span>
                      </div>
                      <p className="text-sm font-bold text-[#0A1F44]">{fmt(loan.amount)} — {loan.purpose}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {loan.termMonths}mo term
                        {loan.creditOfficer ? ` · CO: ${loan.creditOfficer.fullName}` : ''}
                        {' · '}{new Date(loan.createdAt).toLocaleDateString('en-NG')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleDecision(loan.id, true)} disabled={actionLoading === loan.id}
                        className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-60">
                        {actionLoading === loan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Recommend'}
                      </button>
                      <button onClick={() => { setDeclineModal(loan); setDeclineReason(''); }}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All loans table below */}
            {loans.filter(l => l.status !== 'pending-bm').length > 0 && (
              <div className="border-t border-gray-100">
                <div className="p-4 bg-gray-50">
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">Other Loan Applications from Your Branch</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr className="border-b border-gray-100 bg-[#F8FAFC]">
                      {['Applicant', 'Type', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {loans.filter(l => l.status !== 'pending-bm').map(loan => (
                        <tr key={loan.id} className="border-b border-gray-50 hover:bg-[#F8FAFC]">
                          <td className="py-3.5 px-5 font-semibold text-[#0A1F44] text-sm">{loan.customerName}</td>
                          <td className="py-3.5 px-5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">{loan.type}</span></td>
                          <td className="py-3.5 px-5 font-bold text-[#0A1F44] text-sm">{fmt(loan.amount)}</td>
                          <td className="py-3.5 px-5">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${{ 'pending-hoc': 'bg-blue-50 text-blue-700', approved: 'bg-teal-50 text-teal-700', declined: 'bg-red-50 text-red-700', disbursed: 'bg-green-50 text-green-700' }[loan.status] ?? 'bg-gray-50 text-gray-600'}`}>
                              {{ 'pending-hoc': 'Sent to HoC', approved: 'Approved', declined: 'Declined', disbursed: 'Disbursed' }[loan.status] ?? loan.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-xs text-[#64748B]">{new Date(loan.createdAt).toLocaleDateString('en-NG')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {declineModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0A1F44]">Decline Loan Application</h3>
              <button onClick={() => setDeclineModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-[#64748B] mb-4">{declineModal.customerName} — {fmt(declineModal.amount)}</p>
            <div>
              <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Decline Reason *</label>
              <textarea rows={3} required value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                placeholder="State the reason for declining..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDeclineModal(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm">Cancel</button>
              <button onClick={() => handleDecision(declineModal.id, false, declineReason)} disabled={isSubmitting || !declineReason.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <DocumentManager
            defaultCategory="branch"
            allowedCategories={['branch', 'operational', 'general']}
            title="Branch Documents"
            description="Branch reports, inspection forms, staff schedules, cash counts, and operational documents"
            accentColor="green"
          />
        )}
    </div>
  );
}

export default function BranchManagerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <BranchManagerInner />
    </Suspense>
  );
}
