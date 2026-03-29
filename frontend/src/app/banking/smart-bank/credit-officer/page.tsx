'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { BookOpen, UserPlus, Clock, CheckCircle, AlertTriangle, X, Loader2, RefreshCw, DollarSign } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import DocumentManager from '@/components/SmartBank/DocumentManager';
import { authFetch } from '@/lib/auth-client';

interface LoanApplication {
  id: number; customerName: string; accountNumber: string; type: string;
  amount: string; purpose: string; termMonths: number; status: string; createdAt: string; declineReason?: string;
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
  'pending-bm': 'Awaiting Branch Manager',
  'pending-hoc': 'Awaiting Head of Credit',
  approved: 'Approved',
  declined: 'Declined',
  disbursed: 'Disbursed',
};

function CreditOfficerInner() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'applications';
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ customerId: '', customerName: '', accountNumber: '', type: 'personal', amount: '', purpose: '', termMonths: '12' });

  const loadLoans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/loans');
      if (res.ok) setLoans(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadLoans(); }, [loadLoans]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setIsSubmitting(true);
    try {
      const res = await authFetch('/loans', {
        method: 'POST',
        body: JSON.stringify({
          customerId: Number(form.customerId), customerName: form.customerName,
          accountNumber: form.accountNumber, type: form.type,
          amount: Number(form.amount), purpose: form.purpose,
          termMonths: Number(form.termMonths),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit loan.');
      setSubmitted(true); setShowModal(false);
      setForm({ customerId: '', customerName: '', accountNumber: '', type: 'personal', amount: '', purpose: '', termMonths: '12' });
      loadLoans();
    } catch (err: any) { setFormError(err.message); }
    finally { setIsSubmitting(false); }
  };

  const pending = loans.filter(l => l.status === 'pending-bm' || l.status === 'pending-hoc').length;
  const approved = loans.filter(l => l.status === 'approved' || l.status === 'disbursed').length;
  const declined = loans.filter(l => l.status === 'declined').length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="credit-officer" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div><h1 className="text-2xl font-bold mb-1">Credit Officer</h1><p className="text-blue-200 text-sm">Loan origination & recommendations</p></div>
            <div className="flex gap-3 flex-wrap items-start">
              {[{ label: 'Total Applications', value: loans.length }, { label: 'In Review', value: pending }, { label: 'Approved', value: approved }, { label: 'Declined', value: declined }].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[90px]">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={loadLoans} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        {activeTab !== 'documents' && (
        <>
        {submitted && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-teal-600" /><span className="text-sm font-medium text-teal-800">Loan application submitted. Awaiting Branch Manager review.</span></div>
            <button onClick={() => setSubmitted(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><BookOpen className="w-4 h-4 text-blue-700" /></div>
              <div><h2 className="font-bold text-[#0A1F44]">My Loan Applications</h2><p className="text-[#64748B] text-xs">{loans.length} total submissions</p></div>
            </div>
            <button onClick={() => { setShowModal(true); setFormError(''); }} className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
              <UserPlus className="w-4 h-4" />New Application
            </button>
          </div>

          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            : loans.length === 0 ? <div className="text-center py-16 text-[#64748B]"><BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-200" /><p className="font-medium">No applications yet</p></div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100 bg-[#F8FAFC]">
                    {['Applicant', 'Loan Type', 'Amount', 'Purpose', 'Term', 'Status', 'Date'].map(h => <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {loans.map(loan => (
                      <tr key={loan.id} className={`border-b border-gray-50 hover:bg-[#F8FAFC] ${loan.status === 'declined' ? 'bg-red-50/30' : ''}`}>
                        <td className="py-4 px-5"><div className="font-semibold text-[#0A1F44] text-sm">{loan.customerName}</div><div className="text-xs text-gray-400 font-mono">{loan.accountNumber}</div></td>
                        <td className="py-4 px-5"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">{loan.type}</span></td>
                        <td className="py-4 px-5 font-bold text-[#0A1F44] text-sm">{fmt(loan.amount)}</td>
                        <td className="py-4 px-5 text-sm text-[#64748B] max-w-[160px] truncate">{loan.purpose}</td>
                        <td className="py-4 px-5 text-sm text-[#64748B]">{loan.termMonths}mo</td>
                        <td className="py-4 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[loan.status] ?? 'bg-gray-50 text-gray-600'}`}>{STATUS_LABEL[loan.status] ?? loan.status}</span>
                          {loan.status === 'declined' && loan.declineReason && (
                            <div className="mt-1.5 flex items-start gap-1 max-w-[200px]">
                              <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                              <span className="text-xs text-red-600 italic leading-tight">"{loan.declineReason}"</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-5 text-xs text-[#64748B]">{new Date(loan.createdAt).toLocaleDateString('en-NG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-start gap-3">
          <DollarSign className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800"><span className="font-bold">Separation of Duties:</span> You recommend and submit loan applications. You cannot approve them. Approval flows: Branch Manager → Head of Credit → Disburse (Operations).</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-[#0A1F44]">New Loan Application</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-4">
                {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Customer Name *</label><input type="text" required value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" /></div>
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Account Number *</label><input type="text" required maxLength={10} value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g,'') }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Loan Type *</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400">
                      <option value="personal">Personal Loan</option><option value="business">Business / SME</option>
                    </select></div>
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Amount (₦) *</label><input type="number" required min="1000" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 500000" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" /></div>
                </div>
                <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Loan Purpose *</label><input type="text" required value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} placeholder="e.g. Business expansion, Medical expenses..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" /></div>
                <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Repayment Term</label>
                  <select value={form.termMonths} onChange={e => setForm(f => ({ ...f, termMonths: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400">
                    {[3,6,12,18,24,36,48,60].map(m => <option key={m} value={m}>{m} months</option>)}
                  </select></div>
              </div>
              <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-gray-100 flex-shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : 'Submit for BM Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        </>
        )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <DocumentManager
          defaultCategory="loan"
          allowedCategories={['loan', 'kyc', 'general']}
          title="Loan Documents"
          description="Upload collateral photos, income statements, business registration, offer letters, and other loan-related documents"
          accentColor="blue"
        />
      )}
    </div>
  );
}

export default function CreditOfficerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>}>
      <CreditOfficerInner />
    </Suspense>
  );
}
