'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown, Wallet, Loader2, RefreshCw, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import PayrollManager from '@/components/SmartBank/PayrollManager';
import { authFetch } from '@/lib/auth-client';

interface PendingTxn {
  id: number; reference: string; type: string; amount: string; narration: string;
  status: string; createdAt: string;
  fromAccount?: { accountNumber: string; customer?: { firstName: string; lastName: string } };
  toAccount?: { accountNumber: string };
  teller?: { fullName: string };
}
interface VaultSummary {
  branchId?: number; branchName?: string; date: string;
  openingBalance: string; totalDeposits: string; totalWithdrawals: string; closingBalance: string;
}

const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });

function HeadOperationsInner() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'approvals';
  const [pending, setPending] = useState<PendingTxn[]>([]);
  const [vaults, setVaults] = useState<VaultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [declineModal, setDeclineModal] = useState<PendingTxn | null>(null);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [result, setResult] = useState<{ id: number; success: boolean; action?: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, vr] = await Promise.all([
        authFetch('/transactions/pending'),
        authFetch('/transactions/vault/all'),
      ]);
      if (pr.ok) setPending(await pr.json());
      if (vr.ok) setVaults(await vr.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await authFetch(`/transactions/${id}/approve`, { method: 'PATCH' });
      if (res.ok) {
        setResult({ id, success: true, action: 'approved' });
        setPending(prev => prev.filter(t => t.id !== id));
        load();
      }
    } finally { setActionLoading(null); }
  };

  const handleDecline = async () => {
    if (!declineModal) return;
    setDeclineLoading(true);
    try {
      const res = await authFetch(`/transactions/${declineModal.id}/decline`, { method: 'PATCH' });
      if (res.ok) {
        setResult({ id: declineModal.id, success: true, action: 'declined' });
        setPending(prev => prev.filter(t => t.id !== declineModal.id));
        setDeclineModal(null);
        load();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message || 'Failed to decline transaction.');
      }
    } finally { setDeclineLoading(false); }
  };

  const totalDeposits = vaults.reduce((s, v) => s + parseFloat(v.totalDeposits || '0'), 0);
  const totalWithdrawals = vaults.reduce((s, v) => s + parseFloat(v.totalWithdrawals || '0'), 0);
  const totalVaultBalance = vaults.reduce((s, v) => s + parseFloat(v.closingBalance || '0'), 0);

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="head-operations" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-br from-teal-800 to-teal-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Head of Operations</h1>
              <p className="text-teal-200 text-sm">Bank-wide operational oversight</p>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[
                { label: 'Pending Approvals', value: pending.length, c: pending.length > 0 ? 'text-yellow-300' : 'text-white' },
                { label: "Total Deposits", value: fmt(totalDeposits), c: 'text-teal-200' },
                { label: "Total Withdrawals", value: fmt(totalWithdrawals), c: 'text-teal-200' },
                { label: "Total Vault Balance", value: fmt(totalVaultBalance), c: 'text-white' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[110px]">
                  <div className={`text-lg font-bold ${s.c}`}>{s.value}</div>
                  <div className="text-teal-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={load} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        {/* ── TAB: Payroll ── */}
        {activeTab === 'payroll' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-teal-700" />
              </div>
              <div>
                <h2 className="font-bold text-[#0A1F44]">Payroll Approvals</h2>
                <p className="text-[#64748B] text-xs">Review and approve monthly payroll runs generated by Admin</p>
              </div>
            </div>
            <PayrollManager role="head-operations" />
          </div>
        )}

        {/* Pending Approvals (default tab) */}
        {(activeTab === 'approvals' || activeTab === 'overview' || (!activeTab || activeTab === '')) && (
        <>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <Activity className="w-4 h-4 text-teal-700" />
            <h3 className="font-bold text-[#0A1F44]">Pending Transaction Approvals</h3>
            {pending.length > 0 && (
              <span className="ml-auto bg-[#F97316]/10 text-[#F97316] text-xs font-bold px-2.5 py-1 rounded-full">{pending.length} pending</span>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
          ) : pending.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-teal-200" />
              <p className="font-medium text-sm">No pending approvals — all clear</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {pending.map(txn => (
                <div key={txn.id} className="p-5 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-[#0A1F44] text-sm font-mono">{txn.reference}</span>
                      <span className="text-xs text-[#64748B] capitalize">· {txn.type}</span>
                    </div>
                    <p className="text-sm font-bold text-[#0A1F44]">{fmt(txn.amount)}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {txn.fromAccount ? `From: ${txn.fromAccount.accountNumber}${txn.fromAccount.customer ? ` (${txn.fromAccount.customer.firstName} ${txn.fromAccount.customer.lastName})` : ''}` : ''}
                      {txn.teller ? ` · Teller: ${txn.teller.fullName}` : ''}
                      {' · '}{new Date(txn.createdAt).toLocaleString('en-NG')}
                    </p>
                    {txn.narration && <p className="text-xs text-[#64748B] italic mt-0.5">"{txn.narration}"</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(txn.id)}
                      disabled={actionLoading === txn.id}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-60">
                      {actionLoading === txn.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Approve'}
                    </button>
                    <button onClick={() => setDeclineModal(txn)} className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vault Summary per Branch */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <Wallet className="w-4 h-4 text-teal-700" />
            <h3 className="font-bold text-[#0A1F44]">Branch Vault Summary — Today</h3>
          </div>
          {vaults.length === 0 ? (
            <div className="text-center py-10 text-[#64748B] text-sm">No vault data yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-gray-100 bg-[#F8FAFC]">
                  {['Branch', 'Opening Balance', 'Deposits', 'Withdrawals', 'Closing Balance'].map(h => (
                    <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {vaults.map((v, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-[#F8FAFC]">
                      <td className="py-3.5 px-5 font-semibold text-[#0A1F44] text-sm">{v.branchName ?? `Branch #${v.branchId}`}</td>
                      <td className="py-3.5 px-5 text-sm text-[#64748B]">{fmt(v.openingBalance)}</td>
                      <td className="py-3.5 px-5 text-sm text-teal-700 font-semibold">+{fmt(v.totalDeposits)}</td>
                      <td className="py-3.5 px-5 text-sm text-orange-600 font-semibold">-{fmt(v.totalWithdrawals)}</td>
                      <td className="py-3.5 px-5 font-bold text-[#0A1F44] text-sm">{fmt(v.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800"><span className="font-bold">Operations Policy:</span> Transactions above ₦1,000,000 require your approval before posting. Funds are held until you approve or decline.</p>
        </div>
        </>
        )}
      </div>

      {/* Decline confirmation */}
      {declineModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-[#0A1F44] mb-2">Decline Transaction?</h3>
            <p className="text-sm text-[#64748B] mb-1 font-mono">{declineModal.reference}</p>
            <p className="text-sm text-[#0A1F44] font-bold mb-4">{fmt(declineModal.amount)} — {declineModal.type}</p>
            <p className="text-sm text-[#64748B] mb-5">This will cancel the transaction. The teller will need to resubmit if needed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeclineModal(null)} disabled={declineLoading} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm disabled:opacity-60">Cancel</button>
              <button onClick={handleDecline} disabled={declineLoading} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white rounded-xl font-bold text-sm">
                {declineLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HeadOperationsDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>}>
      <HeadOperationsInner />
    </Suspense>
  );
}
