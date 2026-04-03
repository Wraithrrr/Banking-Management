'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { AlertTriangle, FileClock, ClipboardCheck, Activity, Eye, CheckCircle, XCircle, Clock, Shield, Loader2, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import DocumentManager from '@/components/SmartBank/DocumentManager';
import { authFetch } from '@/lib/auth-client';


const MODULE_ACCESS = [
  { module: 'User Management', access: 'Read Only' },
  { module: 'Accounts', access: 'Read Only' },
  { module: 'KYC', access: 'Read Only' },
  { module: 'Transactions', access: 'Read Only' },
  { module: 'Loans', access: 'Read Only' },
  { module: 'Compliance', access: 'Read Only' },
  { module: 'Audit Logs', access: 'Full Access' },
  { module: 'Reports', access: 'Read + Export' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transaction {
  id: number; reference: string; type: string; amount: string;
  status: string; narration: string; createdAt: string;
  fromAccount?: { accountNumber: string; customer?: { firstName: string; lastName: string } };
  toAccount?: { accountNumber: string };
  teller?: { fullName: string; role: string };
  requiresApproval?: boolean;
}

interface Loan {
  id: number; customerName: string; accountNumber: string;
  amount: string; status: string; declineReason?: string; createdAt: string;
  creditOfficer?: { fullName: string };
}

const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });

const txnTypeToModule = (type: string) => {
  const map: Record<string, string> = { deposit: 'TXN', withdrawal: 'TXN', transfer: 'TXN' };
  return map[type] ?? 'TXN';
};

const statusOfTxn = (txn: Transaction): 'normal' | 'flagged' | 'violation' => {
  if (txn.status === 'rejected') return 'violation';
  if (txn.requiresApproval && txn.status === 'pending-approval') return 'flagged';
  return 'normal';
};

// ─── Component ────────────────────────────────────────────────────────────────

function InternalControlInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'exceptions' | 'reports'>('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'logs') setActiveTab('logs');
    else if (tab === 'exceptions') setActiveTab('exceptions');
    else if (tab === 'reports') setActiveTab('reports');
    else setActiveTab('overview');
  }, [searchParams]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditExceptions, setAuditExceptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [txnRes, loanRes, auditRes, exceptRes] = await Promise.all([
        authFetch('/transactions'),
        authFetch('/loans'),
        authFetch('/audit-logs'),
        authFetch('/audit-logs/exceptions'),
      ]);
      if (txnRes.ok) setTransactions(await txnRes.json());
      if (loanRes.ok) setLoans(await loanRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
      if (exceptRes.ok) setAuditExceptions(await exceptRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Audit events: real audit log first, fall back to derived transactions ──
  const auditEvents = auditLogs.length > 0
    ? auditLogs.slice(0, 50).map(log => ({
        id: `LOG-${log.id}`,
        user: log.actorName ?? 'System',
        role: log.actorRole ?? 'system',
        action: log.description,
        module: log.entityType?.toUpperCase() ?? 'SYS',
        time: new Date(log.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        status: log.action?.includes('DECLINED') || log.action?.includes('REJECTED') ? 'violation' as const : 'normal' as const,
        reference: `${log.entityType?.toUpperCase()}-${log.entityId}`,
        createdAt: log.createdAt,
      }))
    : transactions.slice(0, 30).map(txn => ({
        id: `TXN-${txn.id}`,
        user: txn.teller?.fullName ?? 'System',
        role: txn.teller?.role ?? 'teller',
        action: `${txn.type.charAt(0).toUpperCase() + txn.type.slice(1)} of ${fmt(txn.amount)} — ${txn.narration ?? 'No narration'}`,
        module: txnTypeToModule(txn.type),
        time: new Date(txn.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        status: statusOfTxn(txn),
        reference: txn.reference,
        createdAt: txn.createdAt,
      }));

  // ── Exceptions: real audit exceptions + derived + policy ──────────────────
  const auditExceptionItems = auditExceptions.map(log => ({
    ref: `AL-${log.id}`,
    description: log.description,
    severity: log.action?.includes('DECLINED') ? 'high' as const : 'medium' as const,
    date: new Date(log.createdAt).toLocaleDateString('en-CA'),
    status: 'resolved' as const,
    source: 'audit' as const,
  }));

  const liveExceptions = [
    ...auditExceptionItems,
    ...transactions.filter(t => t.status === 'rejected' && !auditExceptionItems.some(a => a.ref.includes(String(t.id)))).map(t => ({
      ref: t.reference,
      description: `Transaction rejected: ${t.type} of ${fmt(t.amount)}${t.fromAccount?.customer ? ` by ${t.fromAccount.customer.firstName} ${t.fromAccount.customer.lastName}` : ''}`,
      severity: 'high' as const,
      date: new Date(t.createdAt).toLocaleDateString('en-CA'),
      status: 'resolved' as const,
      source: 'live' as const,
    })),
    ...loans.filter(l => l.status === 'declined').map(l => ({
      ref: `LOAN-${l.id}`,
      description: `Loan declined: ${fmt(l.amount)} for ${l.customerName}${l.declineReason ? ` — Reason: ${l.declineReason}` : ''}`,
      severity: 'medium' as const,
      date: new Date(l.createdAt).toLocaleDateString('en-CA'),
      status: 'resolved' as const,
      source: 'live' as const,
    })),
  ];

  const openExceptions = liveExceptions.filter(e => e.status === 'open' || e.status === 'under-review').length;
  const violations = auditEvents.filter(l => l.status === 'violation').length + transactions.filter(t => t.status === 'rejected').length;
  const flaggedCount = auditEvents.filter(l => l.status === 'flagged').length;
  const pendingApprovals = transactions.filter(t => t.status === 'pending-approval').length;
  const declinedLoans = loans.filter(l => l.status === 'declined').length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="internal-control" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-300" />
                <span className="text-purple-300 text-sm font-medium">Read-Only · Full Oversight Access</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">Internal Control & Audit</h1>
              <p className="text-purple-200 text-sm">Independent oversight — monitoring policy compliance across all modules</p>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[
                { label: 'Transactions Monitored', value: loading ? '…' : transactions.length.toString(), color: 'text-white' },
                { label: 'Pending Approvals', value: loading ? '…' : pendingApprovals.toString(), color: pendingApprovals > 0 ? 'text-yellow-300' : 'text-white' },
                { label: 'Violations / Rejected', value: loading ? '…' : violations.toString(), color: violations > 0 ? 'text-red-300' : 'text-white' },
                { label: 'Declined Loans', value: loading ? '…' : declinedLoans.toString(), color: declinedLoans > 0 ? 'text-amber-300' : 'text-white' },
              ].map(s => (
                <div key={s.label} className="text-center bg-white/10 rounded-xl px-4 py-3 min-w-[110px]">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-purple-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={loadData} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Read-only notice */}
        <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-5 py-3">
          <Eye className="w-4 h-4 text-purple-700 flex-shrink-0" />
          <p className="text-purple-800 text-sm font-medium">
            Internal Control has <strong>read-only</strong> access to all modules. No operational actions can be performed from this view.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm flex-wrap">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'logs', label: `Transaction Log (${transactions.length})` },
            { key: 'exceptions', label: `Exceptions (${openExceptions} open)` },
            { key: 'reports', label: 'Audit Documents' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === tab.key ? 'bg-purple-700 text-white' : 'text-[#64748B] hover:text-[#0A1F44]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Module Access */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0A1F44] mb-4">Module Access Scope</h3>
              <div className="space-y-2">
                {MODULE_ACCESS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-[#0A1F44]">{m.module}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      m.access === 'Full Access' ? 'bg-purple-100 text-purple-800' :
                      m.access === 'Read + Export' ? 'bg-blue-50 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{m.access}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-4">Live Transaction Summary</h3>
                {loading ? (
                  <div className="flex items-center justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-purple-400" /></div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total Transactions', value: transactions.length, color: 'text-[#0A1F44]', bg: 'bg-slate-50' },
                      { label: 'Pending Approval', value: pendingApprovals, color: pendingApprovals > 0 ? 'text-amber-600' : 'text-[#0A1F44]', bg: 'bg-amber-50' },
                      { label: 'Rejected', value: transactions.filter(t => t.status === 'rejected').length, color: 'text-red-600', bg: 'bg-red-50' },
                      { label: 'Declined Loans', value: declinedLoans, color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map(s => (
                      <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                        <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-[#64748B] mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent exception summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0A1F44] mb-4">Open Exceptions</h3>
                {liveExceptions.filter(e => e.status === 'open' || e.status === 'under-review').length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>No open exceptions at this time</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {liveExceptions.filter(e => e.status === 'open' || e.status === 'under-review').slice(0, 3).map((ex, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-gray-100">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ex.severity === 'high' ? 'bg-red-500' : ex.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'}`} />
                        <div>
                          <p className="text-sm text-[#0A1F44] font-medium leading-tight">{ex.description}</p>
                          <p className="text-xs text-[#64748B] mt-0.5">{ex.ref} · {ex.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Transaction Log ── */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <FileClock className="w-4 h-4 text-purple-700" />
              <h3 className="font-bold text-[#0A1F44]">Transaction Audit Log</h3>
              <span className="ml-auto text-xs text-[#64748B]">{transactions.length} transactions</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-purple-300" /></div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-[#64748B] text-sm">No transactions recorded yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-gray-100">
                      {['Reference', 'Action', 'Amount', 'Teller', 'Module', 'Time', 'Status'].map(h => (
                        <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditEvents.map((log) => (
                      <tr key={log.id} className={`border-b border-gray-50 transition-colors ${
                        log.status === 'violation' ? 'bg-red-50' : log.status === 'flagged' ? 'bg-yellow-50' : 'hover:bg-[#F8FAFC]'
                      }`}>
                        <td className="py-3 px-5 font-mono text-xs text-[#64748B]">{log.reference}</td>
                        <td className="py-3 px-5 text-sm text-[#0A1F44] max-w-xs truncate">{log.action}</td>
                        <td className="py-3 px-5 font-semibold text-sm text-[#0A1F44]">
                          {transactions.find(t => `TXN-${t.id}` === log.id)?.amount
                            ? fmt(transactions.find(t => `TXN-${t.id}` === log.id)!.amount)
                            : '—'}
                        </td>
                        <td className="py-3 px-5">
                          <div className="font-semibold text-[#0A1F44] text-xs">{log.user}</div>
                          <div className="text-[#64748B] text-xs capitalize">{log.role}</div>
                        </td>
                        <td className="py-3 px-5">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">{log.module}</span>
                        </td>
                        <td className="py-3 px-5 text-xs text-[#64748B]">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{log.time}
                          </div>
                          <div className="text-[#94A3B8]">{new Date(log.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })}</div>
                        </td>
                        <td className="py-3 px-5">
                          {log.status === 'violation' ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-700"><XCircle className="w-3.5 h-3.5" /> Rejected</span>
                          ) : log.status === 'flagged' ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-yellow-700"><AlertTriangle className="w-3.5 h-3.5" /> Pending</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle className="w-3.5 h-3.5" /> Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Audit Documents ── */}
        {activeTab === 'reports' && (
          <DocumentManager
            defaultCategory="compliance"
            allowedCategories={['compliance', 'operational', 'general']}
            title="Audit & Control Documents"
            description="Internal audit reports, inspection findings, control assessments, management letters, and regulatory correspondence"
            accentColor="purple"
          />
        )}

        {/* ── Exceptions ── */}
        {activeTab === 'exceptions' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h3 className="font-bold text-[#0A1F44]">Exception Reports</h3>
              <span className="ml-auto text-xs text-[#64748B]">{liveExceptions.length} total ({openExceptions} open)</span>
            </div>
            <div className="divide-y divide-gray-50">
              {liveExceptions.map((ex, idx) => (
                <div key={idx} className="p-5 flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    ex.severity === 'high' ? 'bg-red-500' :
                    ex.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-[#0A1F44] text-sm">{ex.ref}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        ex.severity === 'high' ? 'bg-red-50 text-red-700' :
                        ex.severity === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'
                      }`}>{ex.severity.toUpperCase()}</span>
                      {'source' in ex && ex.source === 'live' && (
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">Live Data</span>
                      )}
                    </div>
                    <p className="text-sm text-[#0A1F44]">{ex.description}</p>
                    <p className="text-xs text-[#64748B] mt-1">{ex.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    ex.status === 'open' ? 'bg-red-50 text-red-700' :
                    ex.status === 'under-review' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>{ex.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InternalControlDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>}>
      <InternalControlInner />
    </Suspense>
  );
}
