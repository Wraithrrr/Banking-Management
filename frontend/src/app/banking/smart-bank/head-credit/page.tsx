'use client';

import { useState, useEffect, useCallback } from 'react';
import { Landmark, TrendingUp, CheckCircle, AlertTriangle, Loader2, RefreshCw, X } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import { authFetch } from '@/lib/auth-client';

interface Loan {
  id: number; customerName: string; accountNumber: string; type: string;
  amount: string; purpose: string; termMonths: number; status: string;
  createdAt: string; declineReason?: string;
  creditOfficer?: { fullName: string };
  branchManager?: { fullName: string };
}
interface PortfolioSummary {
  totalLoans: number; totalAmount: string; disbursedAmount: string; parRatio: string;
  byStatus: Record<string, number>; byType: Record<string, number>;
}

const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });
const STATUS_STYLE: Record<string, string> = {
  'pending-bm': 'bg-amber-50 text-amber-700',
  'pending-hoc': 'bg-blue-50 text-blue-700',
  approved: 'bg-teal-50 text-teal-700',
  declined: 'bg-red-50 text-red-700',
  disbursed: 'bg-green-50 text-green-700',
};
const STATUS_LABEL: Record<string, string> = {
  'pending-bm': 'Awaiting BM', 'pending-hoc': 'Awaiting HoC',
  approved: 'Approved', declined: 'Declined', disbursed: 'Disbursed',
};

export default function HeadCreditDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [declineModal, setDeclineModal] = useState<Loan | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tab, setTab] = useState<'queue' | 'portfolio'>('queue');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [lr, pr] = await Promise.all([
        authFetch('/loans'),
        authFetch('/loans/portfolio-summary'),
      ]);
      if (lr.ok) setLoans(await lr.json());
      if (pr.ok) setPortfolio(await pr.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDecision = async (id: number, approve: boolean, reason?: string) => {
    setActionLoading(id); setIsSubmitting(true);
    try {
      await authFetch(`/loans/${id}/hoc-decision`, {
        method: 'PATCH',
        body: JSON.stringify({ approve, declineReason: reason }),
      });
      setDeclineModal(null); setDeclineReason('');
      load();
    } finally { setActionLoading(null); setIsSubmitting(false); }
  };

  const pending = loans.filter(l => l.status === 'pending-hoc');
  const allLoans = loans;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="head-credit" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-br from-yellow-800 to-yellow-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Head of Credit</h1>
              <p className="text-yellow-200 text-sm">Lending oversight — loan approvals, portfolio management, credit policy</p>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[
                { label: 'Total Loans', value: portfolio?.totalLoans ?? 0, c: 'text-white' },
                { label: 'Total Portfolio', value: portfolio ? fmt(portfolio.totalAmount) : '—', c: 'text-white' },
                { label: 'Awaiting Approval', value: pending.length, c: pending.length > 0 ? 'text-yellow-300' : 'text-yellow-200' },
                { label: 'PAR Ratio', value: portfolio ? `${portfolio.parRatio}%` : '—', c: 'text-green-300' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[90px]">
                  <div className={`text-xl font-bold ${s.c}`}>{s.value}</div>
                  <div className="text-yellow-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={load} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[{ id: 'queue', label: `Approval Queue ${pending.length > 0 ? `(${pending.length})` : ''}` }, { id: 'portfolio', label: 'Loan Portfolio' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${tab === t.id ? 'bg-yellow-700 text-white' : 'bg-white border border-gray-200 text-[#64748B] hover:bg-gray-50'}`}>{t.label}</button>
          ))}
        </div>

        {tab === 'queue' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <Landmark className="w-4 h-4 text-yellow-700" />
              <h3 className="font-bold text-[#0A1F44]">Loans Awaiting Your Approval</h3>
              {pending.length > 0 && <span className="ml-auto bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-1 rounded-full">{pending.length} awaiting</span>}
            </div>
            {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
              : pending.length === 0 ? (
                <div className="text-center py-12 text-[#64748B]">
                  <CheckCircle className="w-10 h-10 mx-auto mb-3 text-yellow-200" />
                  <p className="font-medium text-sm">No loans pending your approval</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {pending.map(loan => (
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
                          {loan.branchManager ? ` · BM: ${loan.branchManager.fullName}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleDecision(loan.id, true)} disabled={actionLoading === loan.id}
                          className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-60">
                          {actionLoading === loan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                        </button>
                        <button onClick={() => { setDeclineModal(loan); setDeclineReason(''); }}
                          className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {tab === 'portfolio' && (
          <div className="space-y-6">
            {/* By Status */}
            {portfolio && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(portfolio.byStatus).map(([status, count]) => (
                  <div key={status} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                    <div className="text-2xl font-bold text-[#0A1F44]">{count}</div>
                    <div className={`mt-2 px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${STATUS_STYLE[status] ?? 'bg-gray-50 text-gray-600'}`}>{STATUS_LABEL[status] ?? status}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-yellow-700" />
                <h3 className="font-bold text-[#0A1F44]">All Loans</h3>
              </div>
              {loading ? <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                : allLoans.length === 0 ? <div className="text-center py-10 text-[#64748B] text-sm">No loans in the system yet</div>
                : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="border-b border-gray-100 bg-[#F8FAFC]">
                        {['Applicant', 'Type', 'Amount', 'Term', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {allLoans.map(loan => (
                          <tr key={loan.id} className="border-b border-gray-50 hover:bg-[#F8FAFC]">
                            <td className="py-3.5 px-5"><div className="font-semibold text-[#0A1F44] text-sm">{loan.customerName}</div><div className="text-xs text-gray-400 font-mono">{loan.accountNumber}</div></td>
                            <td className="py-3.5 px-5"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">{loan.type}</span></td>
                            <td className="py-3.5 px-5 font-bold text-[#0A1F44] text-sm">{fmt(loan.amount)}</td>
                            <td className="py-3.5 px-5 text-sm text-[#64748B]">{loan.termMonths}mo</td>
                            <td className="py-3.5 px-5"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[loan.status] ?? 'bg-gray-50 text-gray-600'}`}>{STATUS_LABEL[loan.status] ?? loan.status}</span></td>
                            <td className="py-3.5 px-5 text-xs text-[#64748B]">{new Date(loan.createdAt).toLocaleDateString('en-NG')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800"><span className="font-bold">Credit Policy:</span> You are the final credit approval authority. Approved loans move to Operations for disbursement. All decisions are logged and auditable.</p>
        </div>
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
                placeholder="State the reason for declining this loan application..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none" />
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
    </div>
  );
}
