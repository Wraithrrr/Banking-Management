'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import ComplianceOverview from '@/components/SmartBank/Compliance/ComplianceOverview';
import ShariahCompliance from '@/components/SmartBank/Compliance/ShariahCompliance';
import ComplianceWorkflows from '@/components/SmartBank/Compliance/ComplianceWorkflows';
import { authFetch } from '@/lib/auth-client';
import { CheckCircle, Clock, AlertTriangle, User, Loader2, RefreshCw, FileText } from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import { Scale } from 'lucide-react';

function GovernanceBoard() { return <ComplianceOverview />; }
function ShariahAuditReview() { return <ShariahCompliance />; }

// ── Real KYC/AML tab ──────────────────────────────────────────────────────────
interface Customer {
  id: number; firstName: string; lastName: string; bvn: string; phone: string;
  email: string; gender: string; isKycApproved: boolean; kycDocumentPaths: string;
  createdAt: string; createdBy?: { fullName: string };
}

function KYCAMLRegulatory() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approving, setApproving] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (res.ok) setCustomers(await res.json());
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: number) => {
    setApproving(id);
    try {
      const res = await authFetch(`/customers/${id}/approve-kyc`, { method: 'PATCH' });
      if (res.ok) load();
    } finally { setApproving(null); }
  };

  const filtered = customers.filter(c =>
    filter === 'all' ? true :
    filter === 'pending' ? !c.isKycApproved :
    c.isKycApproved
  );
  const pending = customers.filter(c => !c.isKycApproved).length;
  const approved = customers.filter(c => c.isKycApproved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KYC / AML & Regulatory</h2>
          <p className="text-gray-600 text-sm mt-1">Review and approve customer KYC documents</p>
        </div>
        <button onClick={load} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'KYC Pending', value: pending, color: pending > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-600' },
          { label: 'KYC Approved', value: approved, color: 'bg-teal-50 text-teal-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm">
            <div className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</div>
            <div className="text-gray-500 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${filter === f ? 'bg-amber-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{f}</button>
          ))}
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or BVN..." className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400" />
      </div>

      {/* Customer KYC List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p className="text-sm">{filter === 'pending' ? 'All KYC documents are approved' : 'No customers found'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(c => {
              const docs: string[] = (() => {
                try { return JSON.parse(c.kycDocumentPaths || '[]'); } catch { return []; }
              })();
              return (
                <div key={c.id} className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{c.firstName} {c.lastName}</span>
                      <span className="text-xs text-gray-400 font-mono">BVN: {c.bvn}</span>
                      <span className="text-xs text-gray-400 capitalize">· {c.gender}</span>
                    </div>
                    <p className="text-xs text-gray-500">{c.phone} · {c.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{docs.length} document{docs.length !== 1 ? 's' : ''} uploaded</span>
                      {docs.length > 0 && (
                        <div className="flex gap-1.5">
                          {docs.map((path, i) => (
                            <a key={i} href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/${path}`} target="_blank" rel="noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                              <FileText className="w-3 h-3" />Doc {i + 1}
                            </a>
                          ))}
                        </div>
                      )}
                      {c.createdBy && <span className="text-xs text-gray-400">· AO: {c.createdBy.fullName}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {c.isKycApproved ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> KYC Approved
                      </span>
                    ) : (
                      <>
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                        <button onClick={() => handleApprove(c.id)} disabled={approving === c.id}
                          className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors">
                          {approving === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Approve KYC'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800"><span className="font-bold">KYC Policy:</span> Verify all uploaded identity documents before approving. Once approved, the customer's account becomes fully active. Only Compliance officers can approve KYC.</p>
      </div>
    </div>
  );
}

function ZakatSocial() {
  const kpis = [
    { label: 'Zakat Collected (₦)', value: 125000000, color: 'bg-green-100', text: 'text-green-700' },
    { label: 'Zakat Distributed (₦)', value: 98000000, color: 'bg-blue-100', text: 'text-blue-700' },
    { label: 'Pending Distribution (₦)', value: 27000000, color: 'bg-yellow-100', text: 'text-yellow-700' },
    { label: 'Social Projects', value: 12, color: 'bg-amber-100', text: 'text-amber-700' },
  ];
  const distributionData = [
    { name: 'Education', value: 35 }, { name: 'Healthcare', value: 25 },
    { name: 'Poverty Relief', value: 20 }, { name: 'Community Dev.', value: 12 }, { name: 'Other', value: 8 },
  ];
  const projects = [
    { name: 'School Renovation', type: 'Education', amount: 12000000, status: 'Completed', date: '2025-08-10' },
    { name: 'Medical Outreach', type: 'Healthcare', amount: 8000000, status: 'Ongoing', date: '2025-09-15' },
    { name: 'Food Drive', type: 'Poverty Relief', amount: 5000000, status: 'Completed', date: '2025-07-20' },
    { name: 'Clean Water Project', type: 'Community Dev.', amount: 7000000, status: 'Ongoing', date: '2025-09-28' },
  ];
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <Scale className="w-7 h-7 text-green-700" />
        <h2 className="text-2xl font-bold text-gray-900">Zakat & Social Responsibility</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k, i) => (
          <div key={i} className={`rounded-xl p-6 ${k.color} border border-gray-200`}>
            <p className="text-sm text-gray-600">{k.label}</p>
            <p className={`text-2xl font-bold ${k.text}`}>{typeof k.value === 'number' && k.value > 100 ? formatCurrency(k.value) : k.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Zakat Distribution by Category</h3>
        <ProfessionalChart data={distributionData} barColor="#22c55e" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4"><FileText className="w-5 h-5 text-green-700" /><h3 className="text-lg font-bold text-gray-900">Recent Social Finance Projects</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-green-50 text-green-900">
              {['Project', 'Type', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="px-4 py-2 text-left font-semibold">{h}</th>)}
            </tr></thead>
            <tbody>
              {projects.map((p, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-2 text-gray-700">{p.type}</td>
                  <td className="px-4 py-2 text-gray-700">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-2 text-gray-700">{p.status}</td>
                  <td className="px-4 py-2 text-gray-700">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComplianceReports() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Compliance Reports</h2>
      <p className="text-gray-700 mb-4">Downloadable reports, audit logs, and regulatory submissions.</p>
      <div className="text-gray-400">(Coming soon)</div>
    </div>
  );
}

function ComplianceDashboardInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'governance' | 'audit' | 'kyc' | 'zakat' | 'workflows' | 'reports'>('governance');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'audit' || tab === 'kyc' || tab === 'zakat' || tab === 'workflows' || tab === 'reports') setActiveTab(tab);
    else setActiveTab('governance');
  }, [searchParams]);

  const tabs = [
    { id: 'governance', label: 'Governance' },
    { id: 'kyc', label: 'KYC / AML' },
    { id: 'audit', label: 'Shariah Audit' },
    { id: 'zakat', label: 'Zakat & Social' },
    { id: 'workflows', label: 'Workflows' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <div className="min-h-screen bg-amber-50 lg:flex">
      <Sidebar role="compliance" />
      <div className="flex-1 lg:ml-0">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-5 flex items-center justify-between">
              <div className="ml-12 lg:ml-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Compliance</h1>
                <p className="text-sm text-gray-600 mt-1">Regulatory & Shariah Oversight</p>
              </div>
              <div className="hidden sm:flex gap-1.5 flex-wrap">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === t.id ? 'bg-amber-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{t.label}</button>
                ))}
              </div>
            </div>
            {/* Mobile tab pills */}
            <div className="sm:hidden flex gap-1.5 pb-4 overflow-x-auto">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600'}`}>{t.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'governance' && <GovernanceBoard />}
          {activeTab === 'audit' && <ShariahAuditReview />}
          {activeTab === 'kyc' && <KYCAMLRegulatory />}
          {activeTab === 'zakat' && <ZakatSocial />}
          {activeTab === 'workflows' && <ComplianceWorkflows />}
          {activeTab === 'reports' && <ComplianceReports />}
        </div>
      </div>
    </div>
  );
}

export default function ComplianceDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-amber-50" />}>
      <ComplianceDashboardInner />
    </Suspense>
  );
}
