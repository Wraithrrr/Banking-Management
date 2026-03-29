'use client';

import { useState, useEffect, useCallback } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CheckCircle, AlertTriangle, Loader2, RefreshCw, Clock, TrendingUp, TrendingDown, Banknote, Receipt, Search } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import { authFetch, getStoredUser } from '@/lib/auth-client';

type TxnTab = 'deposit' | 'withdrawal' | 'transfer' | 'disburse' | 'collections';
interface Transaction { id: number; reference: string; type: string; amount: string; narration: string; status: string; createdAt: string; }
interface VaultBalance { openingBalance: string; totalDeposits: string; totalWithdrawals: string; closingBalance: string; }
interface AccountInfo { accountNumber: string; type: string; balance: string; customer?: { firstName: string; lastName: string }; }
interface ApprovedLoan { id: number; customerName: string; amount: string; purpose: string; termMonths: number; interestRate: string; createdAt: string; }
interface DisbursedLoan { id: number; customerName: string; amount: string; purpose: string; termMonths: number; }
interface Repayment { id: number; loanId: number; dueDate: string; amount: string; paidAmount: string; status: string; paidAt?: string; }
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

  // Disburse tab state
  const [approvedLoans, setApprovedLoans] = useState<ApprovedLoan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);
  const [disbursingId, setDisbursingId] = useState<number | null>(null);
  const [disburseResult, setDisburseResult] = useState<{ id: number; success: boolean; message: string } | null>(null);

  // Collections tab state
  const [disbursedLoans, setDisbursedLoans] = useState<DisbursedLoan[]>([]);
  const [loadingDisbursed, setLoadingDisbursed] = useState(false);
  const [loanSearch, setLoanSearch] = useState('');
  const [selectedLoan, setSelectedLoan] = useState<DisbursedLoan | null>(null);
  const [repayments, setRepayments] = useState<Repayment[]>([]);
  const [loadingRepayments, setLoadingRepayments] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payingId, setPayingId] = useState<number | null>(null);
  const [payResult, setPayResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [t, v] = await Promise.all([authFetch('/transactions'), authFetch('/transactions/vault')]);
      if (t.ok) setTransactions(await t.json());
      if (v.ok) setVault(await v.json());
    } finally { setLoadingData(false); }
  }, []);

  const loadApprovedLoans = useCallback(async () => {
    setLoadingLoans(true);
    try {
      const res = await authFetch('/loans');
      if (res.ok) {
        const all: ApprovedLoan[] = await res.json();
        setApprovedLoans(all.filter((l: any) => l.status === 'approved'));
      }
    } finally { setLoadingLoans(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (tab === 'disburse') loadApprovedLoans(); }, [tab, loadApprovedLoans]);

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

  const handleDisburse = async (loanId: number) => {
    setDisbursingId(loanId); setDisburseResult(null);
    try {
      const res = await authFetch(`/loans/${loanId}/disburse`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Disbursement failed.');
      setDisburseResult({ id: loanId, success: true, message: 'Loan disbursed successfully. Repayment schedule generated.' });
      setApprovedLoans(prev => prev.filter(l => l.id !== loanId));
      loadData();
    } catch (err: any) { setDisburseResult({ id: loanId, success: false, message: err.message }); }
    finally { setDisbursingId(null); }
  };

  const loadDisbursedLoans = useCallback(async () => {
    setLoadingDisbursed(true);
    try {
      const res = await authFetch('/loans');
      if (res.ok) {
        const all: any[] = await res.json();
        setDisbursedLoans(all.filter(l => l.status === 'disbursed'));
      }
    } finally { setLoadingDisbursed(false); }
  }, []);

  const loadRepayments = async (loan: DisbursedLoan) => {
    setSelectedLoan(loan); setRepayments([]); setLoadingRepayments(true); setPayResult(null);
    try {
      const res = await authFetch(`/loans/${loan.id}/repayments`);
      if (res.ok) setRepayments(await res.json());
    } finally { setLoadingRepayments(false); }
  };

  const handlePayment = async (repaymentId: number) => {
    if (!payAmount || Number(payAmount) <= 0) return;
    setPayingId(repaymentId); setPayResult(null);
    try {
      const res = await authFetch(`/loans/repayments/${repaymentId}/pay`, {
        method: 'PATCH',
        body: JSON.stringify({ amount: Number(payAmount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed.');
      setPayResult({ success: true, message: 'Payment recorded successfully.' });
      setPayAmount('');
      if (selectedLoan) loadRepayments(selectedLoan);
      loadData();
    } catch (err: any) { setPayResult({ success: false, message: err.message }); }
    finally { setPayingId(null); }
  };

  useEffect(() => { if (tab === 'collections') loadDisbursedLoans(); }, [tab, loadDisbursedLoans]);

  const filteredLoans = disbursedLoans.filter(l =>
    l.customerName.toLowerCase().includes(loanSearch.toLowerCase())
  );

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
              {tab === 'disburse' && (
                <div className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[110px]">
                  <Banknote className="w-4 h-4 mx-auto mb-1 text-amber-300" />
                  <div className="font-bold text-sm text-amber-300">{approvedLoans.length}</div>
                  <div className="text-cyan-300 text-xs">Pending Disburse</div>
                </div>
              )}
              <button onClick={() => { loadData(); if (tab === 'disburse') loadApprovedLoans(); }} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form / Disburse panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {([
                { id: 'deposit', label: 'Deposit', Icon: ArrowDownCircle },
                { id: 'withdrawal', label: 'Withdrawal', Icon: ArrowUpCircle },
                { id: 'transfer', label: 'Transfer', Icon: ArrowLeftRight },
                { id: 'disburse', label: 'Disburse', Icon: Banknote },
                { id: 'collections', label: 'Collections', Icon: Receipt },
              ] as const).map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setResult(null); setDisburseResult(null); setPayResult(null); setSelectedLoan(null); resetForm(); }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-4 text-xs font-semibold transition-colors whitespace-nowrap px-2 ${tab === t.id ? 'border-b-2 border-cyan-600 text-cyan-700 bg-cyan-50/50' : 'text-gray-500 hover:text-gray-700'}`}>
                  <t.Icon className={`w-3.5 h-3.5 ${tab === t.id ? 'text-cyan-600' : 'text-gray-400'}`} />{t.label}
                </button>
              ))}
            </div>

            {tab === 'collections' ? (
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-[#0A1F44] text-sm mb-0.5">Loan Repayment Collections</h3>
                  <p className="text-xs text-gray-400">Select a borrower to view their schedule and record payment</p>
                </div>

                {!selectedLoan ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input value={loanSearch} onChange={e => setLoanSearch(e.target.value)} placeholder="Search borrower name..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-500" />
                    </div>
                    {loadingDisbursed ? (
                      <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                    ) : filteredLoans.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 text-sm">No disbursed loans found</div>
                    ) : (
                      <div className="space-y-2 max-h-[360px] overflow-y-auto">
                        {filteredLoans.map(loan => (
                          <button key={loan.id} onClick={() => loadRepayments(loan)} className="w-full text-left border border-gray-100 rounded-xl p-3.5 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[#0A1F44] text-sm">{loan.customerName}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{loan.purpose} · {loan.termMonths} months</p>
                              </div>
                              <span className="text-sm font-bold text-teal-700">{fmt(loan.amount)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button onClick={() => { setSelectedLoan(null); setRepayments([]); setPayResult(null); }} className="flex items-center gap-1.5 text-xs text-cyan-700 font-semibold hover:underline">
                      ← Back to borrower list
                    </button>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3.5">
                      <p className="font-bold text-[#0A1F44] text-sm">{selectedLoan.customerName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedLoan.purpose} · {fmt(selectedLoan.amount)} · {selectedLoan.termMonths} months</p>
                    </div>

                    {payResult && (
                      <div className={`flex items-start gap-2.5 p-3 rounded-xl text-sm ${payResult.success ? 'bg-teal-50 border border-teal-200 text-teal-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                        {payResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
                        <span>{payResult.message}</span>
                      </div>
                    )}

                    {loadingRepayments ? (
                      <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                    ) : (
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {repayments.map((r, i) => (
                          <div key={r.id} className={`border rounded-xl p-3.5 ${r.status === 'paid' ? 'border-teal-200 bg-teal-50/50' : r.status === 'overdue' ? 'border-red-200 bg-red-50/50' : 'border-gray-100'}`}>
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-500">Installment {i + 1} · Due {new Date(r.dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                <p className="font-bold text-[#0A1F44] text-sm mt-0.5">{fmt(r.amount)}</p>
                                {parseFloat(r.paidAmount) > 0 && <p className="text-xs text-teal-600 mt-0.5">Paid: {fmt(r.paidAmount)}</p>}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'paid' ? 'bg-teal-100 text-teal-700' : r.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{r.status.toUpperCase()}</span>
                                {r.status !== 'paid' && (
                                  <div className="flex items-center gap-1.5">
                                    <input type="number" min="1" value={payingId === r.id ? payAmount : ''} onChange={e => setPayAmount(e.target.value)} placeholder="₦ amount" className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-300" onClick={() => setPayingId(r.id)} />
                                    <button onClick={() => handlePayment(r.id)} disabled={payingId === r.id && !payAmount} className="flex items-center gap-1 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all">
                                      {payingId === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Pay'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : tab !== 'disburse' ? (
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
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[#0A1F44] text-sm">Loans Ready for Disbursement</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Approved by Head of Credit — awaiting cash disbursement</p>
                  </div>
                  <button onClick={loadApprovedLoans} disabled={loadingLoans} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${loadingLoans ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {disburseResult && (
                  <div className={`flex items-start gap-2.5 p-3.5 rounded-xl text-sm ${disburseResult.success ? 'bg-teal-50 border border-teal-200 text-teal-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {disburseResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    <span>{disburseResult.message}</span>
                  </div>
                )}

                {loadingLoans ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
                ) : approvedLoans.length === 0 ? (
                  <div className="text-center py-12">
                    <Banknote className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400 font-medium">No loans pending disbursement</p>
                    <p className="text-xs text-gray-300 mt-1">Loans approved by Head of Credit will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[360px] overflow-y-auto">
                    {approvedLoans.map(loan => (
                      <div key={loan.id} className="border border-gray-100 rounded-xl p-4 hover:border-cyan-200 hover:bg-cyan-50/30 transition-all">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#0A1F44] text-sm truncate">{loan.customerName}</p>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{loan.purpose}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{fmt(loan.amount)}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{loan.termMonths}mo · {loan.interestRate}%</span>
                              <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">APPROVED</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDisburse(loan.id)}
                            disabled={disbursingId === loan.id}
                            className="flex-shrink-0 flex items-center gap-1.5 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all"
                          >
                            {disbursingId === loan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Banknote className="w-3.5 h-3.5" />}
                            Disburse
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
          <p className="text-sm text-amber-800"><span className="font-bold">Teller Policy:</span> You cannot process transactions on your own account. Amounts above ₦1,000,000 are automatically queued for Head of Operations approval before posting. Loan disbursements generate automatic monthly repayment schedules.</p>
        </div>
      </div>
    </div>
  );
}
