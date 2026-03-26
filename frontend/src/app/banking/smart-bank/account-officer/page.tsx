'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserCheck, UserPlus, FileText, Clock, CheckCircle, AlertTriangle, X, Loader2, RefreshCw } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import { authFetch } from '@/lib/auth-client';

interface Account {
  id: number; accountNumber: string; type: string; balance: string; status: string; createdAt: string;
  customer?: { firstName: string; lastName: string; bvn: string; isKycApproved: boolean };
}

const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });

export default function AccountOfficerDashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; accountNumber?: string } | null>(null);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', bvn: '', phone: '', email: '',
    dateOfBirth: '', address: '', gender: 'male', accountType: 'savings',
  });
  const [kycFiles, setKycFiles] = useState<FileList | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/accounts');
      if (res.ok) setAccounts(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setIsCreating(true);
    try {
      // Step 1: Create customer (with KYC docs)
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (!['accountType'].includes(k)) fd.append(k, v); });
      if (kycFiles) Array.from(kycFiles).forEach(f => fd.append('kycDocs', f));

      const custRes = await authFetch('/customers', { method: 'POST', body: fd, headers: {} });
      const custData = await custRes.json();
      if (!custRes.ok) throw new Error(custData.message || 'Failed to create customer.');

      // Step 2: Open account
      const accRes = await authFetch('/accounts', {
        method: 'POST',
        body: JSON.stringify({ customerId: custData.id, type: form.accountType }),
      });
      const accData = await accRes.json();
      if (!accRes.ok) throw new Error(accData.message || 'Failed to open account.');

      setResult({ success: true, message: `Account opened for ${form.firstName} ${form.lastName}`, accountNumber: accData.accountNumber });
      setShowModal(false);
      setForm({ firstName: '', lastName: '', bvn: '', phone: '', email: '', dateOfBirth: '', address: '', gender: 'male', accountType: 'savings' });
      setKycFiles(null);
      loadAccounts();
    } catch (err: any) { setFormError(err.message); }
    finally { setIsCreating(false); }
  };

  const approvedCount = accounts.filter(a => a.customer?.isKycApproved).length;
  const pendingCount = accounts.filter(a => !a.customer?.isKycApproved).length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="account-officer" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Account Officer</h1>
              <p className="text-indigo-200 text-sm">Customer onboarding & account opening</p>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[{ label: 'Accounts Opened', value: accounts.length }, { label: 'KYC Approved', value: approvedCount }, { label: 'Pending KYC', value: pendingCount }].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[110px]">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-indigo-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={loadAccounts} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        {result?.success && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#0A1F44]">{result.message}</p>
                {result.accountNumber && <p className="text-sm text-[#64748B] mt-1">Account Number: <span className="font-mono font-bold text-[#0A1F44] text-base tracking-widest">{result.accountNumber}</span></p>}
                <p className="text-xs text-[#64748B] mt-1">KYC documents submitted. Awaiting Compliance Officer approval.</p>
              </div>
            </div>
            <button onClick={() => setResult(null)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center"><UserCheck className="w-4 h-4 text-indigo-700" /></div>
              <div><h2 className="font-bold text-[#0A1F44]">Recent Account Openings</h2><p className="text-[#64748B] text-xs">{accounts.length} accounts</p></div>
            </div>
            <button onClick={() => { setShowModal(true); setFormError(''); setResult(null); }} className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">
              <UserPlus className="w-4 h-4" />Open New Account
            </button>
          </div>

          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            : accounts.length === 0 ? <div className="text-center py-16 text-[#64748B]"><UserCheck className="w-10 h-10 mx-auto mb-3 text-gray-200" /><p className="font-medium">No accounts opened yet</p></div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100 bg-[#F8FAFC]">
                    {['Customer', 'Account Number', 'Type', 'Balance', 'KYC Status', 'Opened'].map(h => <th key={h} className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {accounts.map(acc => (
                      <tr key={acc.id} className="border-b border-gray-50 hover:bg-[#F8FAFC]">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">{acc.customer ? `${acc.customer.firstName[0]}${acc.customer.lastName[0]}` : '?'}</div>
                            <div><p className="font-semibold text-[#0A1F44] text-sm">{acc.customer ? `${acc.customer.firstName} ${acc.customer.lastName}` : '—'}</p><p className="text-xs text-gray-400">BVN: {acc.customer?.bvn ?? '—'}</p></div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-[#0A1F44] text-sm">{acc.accountNumber}</td>
                        <td className="py-4 px-6"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 capitalize">{acc.type}</span></td>
                        <td className="py-4 px-6 font-semibold text-[#0A1F44] text-sm">{fmt(acc.balance)}</td>
                        <td className="py-4 px-6">
                          {acc.customer?.isKycApproved
                            ? <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700"><CheckCircle className="w-3.5 h-3.5" />Approved</span>
                            : <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600"><Clock className="w-3.5 h-3.5" />Pending Compliance</span>}
                        </td>
                        <td className="py-4 px-6 text-xs text-[#64748B]">{new Date(acc.createdAt).toLocaleDateString('en-NG')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 flex items-start gap-3">
          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800"><span className="font-bold">Separation of Duties:</span> You capture customer data and KYC documents. The Compliance Officer reviews and approves KYC. Only after approval can the account be fully activated for transactions.</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-[#0A1F44]">Open New Account</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="overflow-y-auto flex-1">
              <div className="p-6 space-y-4">
                {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}

                <div className="grid grid-cols-2 gap-4">
                  {[['firstName', 'First Name'], ['lastName', 'Last Name']].map(([k, l]) => (
                    <div key={k}><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">{l} *</label>
                      <input type="text" required value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]" /></div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">BVN * (11 digits)</label>
                    <input type="text" required maxLength={11} value={form.bvn} onChange={e => setForm(f => ({ ...f, bvn: e.target.value.replace(/\D/g, '') }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]" /></div>
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Phone *</label>
                    <input type="text" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]" /></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]" /></div>
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Date of Birth *</label>
                    <input type="date" required value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]" /></div>
                </div>

                <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Address *</label>
                  <input type="text" required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]" /></div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Gender *</label>
                    <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]">
                      <option value="male">Male</option><option value="female">Female</option>
                    </select></div>
                  <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Account Type *</label>
                    <select value={form.accountType} onChange={e => setForm(f => ({ ...f, accountType: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316]">
                      <option value="savings">Savings</option><option value="current">Current</option>
                    </select></div>
                </div>

                <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">KYC Documents (ID Card, Utility Bill, Passport Photo — PDF/Image, max 5MB each)</label>
                  <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={e => setKycFiles(e.target.files)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-xs file:font-semibold" /></div>
              </div>

              <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-gray-100 flex-shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isCreating} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all">
                  {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" />Opening Account...</> : 'Open Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
