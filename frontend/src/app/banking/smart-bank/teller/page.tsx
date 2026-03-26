'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CheckCircle, AlertTriangle, Loader2, RefreshCw, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import { authFetch, getStoredUser } from '@/lib/auth-client';

type TxnTab = 'deposit' | 'withdrawal' | 'transfer';
interface Transaction { id: number; reference: string; type: string; amount: string; narration: string; status: string; createdAt: string; }
interface VaultBalance { openingBalance: string; totalDeposits: string; totalWithdrawals: string; closingBalance: string; }
interface AccountInfo { accountNumber: string; type: string; balance: string; customer?: { firstName: string; lastName: string }; }
const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });

export default function TellerDashboard() {
  const user = getStoredUser();
  const [tab, setTab] = useState<TxnTab>('deposit');
  const [accountNumber, setAccountNumber] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; requiresApproval?: boolean } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [vault, setVault] = useState<VaultBalance | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [t, v] = await Promise.all([authFetch('/transactions'), authFetch('/transactions/vault')]);
      if (t.ok) setTransactions(await t.json());
      if (v.ok) setVault(await v.json());
    } finally { setLoadingData(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const lookupAccount = async (acc: string) => {
    if (acc.length !== 10) { setAccountInfo(null); return; }
    setLookupLoading(true); setLookupError('');
    try {
      const res = await authFetch(`/accounts/number/${acc}`);
      if (res.ok) setAccountInfo(await res.json());
      else { setAccountInfo(null); setLookupError('Account not found'); }
    } catch { setLookupError('Could not verify account'); }
    finally { setLookupLoading(false); }
  };

  const resetForm = () => { setAccountNumber(''); setToAccountNumber(''); setAmount(''); setNarration(''); setAccountInfo(null); setLookupError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true); setResult(null);
    try {
      const endpoint = tab === 'deposit' ? '/transactions/deposit' : tab === 'withdrawal' ? '/transactions/withdrawal' : '/transactions/transfer';
      const body = tab === 'transfer'
        ? { fromAccountNumber: accountNumber, toAccountNumber, amount: Number(amount), narration }
        : { accountNumber, amount: Number(amount), narration };
      const res = await authFetch(endpoint, { method: 'POST', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Transaction failed.');
      setResult({ success: true, message: data.message, requiresApproval: data.requiresApproval });
      resetForm(); loadData();
    } catch (err: any) { setResult({ success: false, message: err.message }); }
    finally { setIsProcessing(false); }
  };

  const tillBalance = vault ? parseFloat(vault.closingBalance) : 0;
  const todayDeposits = vault ? parseFloat(vault.totalDeposits) : 0;
  const todayWithdrawals = vault ? parseFloat(vault.totalWithdrawals) : 0;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="teller" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-r from-cyan-800 to-cyan-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Teller Station</h1>
              <p className="text-cyan-200 text-sm">{user?.fullName ?? 'Teller'} · {new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[{ label: 'Till Balance', value: fmt(tillBalance), Icon: Wallet, c: 'text-white' }, { label: 'Deposits', value: fmt(todayDeposits), Icon: TrendingUp, c: 'text-cyan-200' }, { label: 'Withdrawals', value: fmt(todayWithdrawals), Icon: TrendingDown, c: 'text-cyan-200' }].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[110px]">
                  <s.Icon className={`w-4 h-4 mx-auto mb-1 ${s.c}`} />
                  <div className={`font-bold text-sm ${s.c}`}>{s.value}</div>
                  <div className="text-cyan-300 text-xs">{s.label}</div>
                </div>
              ))}
              <button onClick={loadData} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {([{ id: 'deposit', label: 'Deposit', Icon: ArrowDownCircle }, { id: 'withdrawal', label: 'Withdrawal', Icon: ArrowUpCircle }, { id: 'transfer', label: 'Transfer', Icon: ArrowLeftRight }] as const).map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setResult(null); resetForm(); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-4 text-xs font-semibold transition-colors ${tab === t.id ? 'border-b-2 border-cyan-600 text-cyan-700 bg-cyan-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                  <t.Icon className={`w-3.5 h-3.5 ${tab === t.id ? 'text-cyan-600' : 'text-gray-400'}`} />{t.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {result && (
                <div className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm ${result.success ? (result.requiresApproval ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-teal-50 border border-teal-200 text-teal-800') : 'bg-red-50 border border-red-200 text-red-700'}`}>
                  {result.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                  <span>{result.message}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">{tab === 'transfer' ? 'From Account Number' : 'Account Number'}</label>
                <div className="relative">
                  <input type="text" maxLength={10} value={accountNumber} onChange={e => { setAccountNumber(e.target.value.replace(/\D/g, '')); setAccountInfo(null); setLookupError(''); }} onBlur={() => lookupAccount(accountNumber)} placeholder="10-digit account number" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition-all pr-10" />
                  {lookupLoading && <Loader2 className="absolute right-3 top-3.5 w-4 h-4 animate-spin text-gray-400" />}
                  {accountInfo && <CheckCircle className="absolute right-3 top-3.5 w-4 h-4 text-teal-500" />}
                </div>
                {accountInfo && <div className="mt-1.5 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-800"><span className="font-semibold">{accountInfo.customer ? `${accountInfo.customer.firstName} ${accountInfo.customer.lastName}` : 'Account found'}</span>{' · '}{accountInfo.type.toUpperCase()} · Bal: {fmt(accountInfo.balance)}</div>}
                {lookupError && <p className="mt-1 text-xs text-red-500">{lookupError}</p>}
              </div>
              {tab === 'transfer' && (
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">To Account Number</label>
                  <input type="text" maxLength={10} value={toAccountNumber} onChange={e => setToAccountNumber(e.target.value.replace(/\D/g, ''))} placeholder="Beneficiary account number" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition-all" />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Amount (₦)</label>
                <input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition-all" />
                {Number(amount) > 1_000_000 && <p className="mt-1 text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Above ₦1M — requires Head of Operations approval</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Narration (optional)</label>
                <input type="text" value={narration} onChange={e => setNarration(e.target.value)} placeholder="e.g. Salary payment..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500 transition-all" />
              </div>
              <button type="submit" disabled={isProcessing} className="w-full flex items-center justify-center gap-2 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all">
                {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : `Process ${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col" style={{ maxHeight: 520 }}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /><h3 className="font-bold text-[#0A1F44] text-sm">Today's Transactions</h3></div>
              <span className="text-xs text-gray-400">{transactions.length} records</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loadingData ? <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                : transactions.length === 0 ? <div className="text-center py-12 text-gray-400 text-sm">No transactions yet today</div>
                : transactions.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${txn.type === 'deposit' ? 'bg-teal-50' : txn.type === 'withdrawal' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                        {txn.type === 'deposit' ? <ArrowDownCircle className="w-4 h-4 text-teal-600" /> : txn.type === 'withdrawal' ? <ArrowUpCircle className="w-4 h-4 text-orange-500" /> : <ArrowLeftRight className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div><p className="text-sm font-semibold text-[#0A1F44] capitalize">{txn.type}</p><p className="text-xs text-gray-400 font-mono">{txn.reference}</p></div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${txn.type === 'deposit' ? 'text-teal-600' : 'text-orange-500'}`}>{txn.type === 'deposit' ? '+' : '-'}{fmt(txn.amount)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${txn.status === 'completed' ? 'bg-teal-50 text-teal-700' : txn.status === 'pending-approval' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500'}`}>{txn.status}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800"><span className="font-bold">Teller Policy:</span> You cannot process transactions on your own account. Amounts above ₦1,000,000 are automatically queued for Head of Operations approval before posting.</p>
        </div>
      </div>
    </div>
  );
}
