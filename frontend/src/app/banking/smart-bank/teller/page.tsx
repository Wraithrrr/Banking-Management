'use client';

import { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CheckCircle, AlertTriangle, Clock, Printer } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';

const todayTransactions = [
  { ref: 'TXN-20250125-0041', type: 'deposit', customer: 'Mrs. Hauwa Garba', acct: '0012345601', amount: 450000, time: '09:14 AM', status: 'completed' },
  { ref: 'TXN-20250125-0039', type: 'withdrawal', customer: 'Mr. Kola Adeyemi', acct: '0023456712', amount: 120000, time: '09:32 AM', status: 'completed' },
  { ref: 'TXN-20250125-0038', type: 'transfer', customer: 'Ekene Auto Parts Ltd', acct: '0034561290', amount: 980000, time: '10:05 AM', status: 'pending-approval' },
  { ref: 'TXN-20250125-0036', type: 'deposit', customer: 'Mrs. Aisha Ibrahim', acct: '0056781234', amount: 75000, time: '10:28 AM', status: 'completed' },
  { ref: 'TXN-20250125-0034', type: 'withdrawal', customer: 'Mr. Chinedu Obi', acct: '0078901234', amount: 50000, time: '11:00 AM', status: 'completed' },
];

const TXN_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  deposit: { icon: ArrowDownCircle, color: 'text-[#0D9488]', bg: 'bg-teal-50', label: 'Deposit' },
  withdrawal: { icon: ArrowUpCircle, color: 'text-[#F97316]', bg: 'bg-orange-50', label: 'Withdrawal' },
  transfer: { icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Transfer' },
};

export default function TellerDashboard() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [acctNo, setAcctNo] = useState('');
  const [benAcct, setBenAcct] = useState('');
  const [narration, setNarration] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalDeposits = todayTransactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = todayTransactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const tillBalance = 2000000 + totalDeposits - totalWithdrawals;
  const pendingApprovals = todayTransactions.filter(t => t.status === 'pending-approval').length;

  const formatCurrency = (n: number) => `₦${n.toLocaleString('en-NG')}`;

  const handleProcess = () => {
    if (!amount || !acctNo) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setAmount('');
      setAcctNo('');
      setBenAcct('');
      setNarration('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="teller" userName="Fatima Bello" userEmail="fatima@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-cyan-800 to-cyan-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-cyan-300 text-sm font-medium mb-1">Lagos Victoria Island Branch · Till 03</p>
              <h1 className="text-2xl font-bold mb-1">Teller Dashboard</h1>
              <p className="text-cyan-200 text-sm">Process cash transactions, view history, balance your till</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Till Balance', value: formatCurrency(tillBalance), color: 'text-white' },
                { label: "Today's Deposits", value: formatCurrency(totalDeposits), color: 'text-green-300' },
                { label: "Today's Withdrawals", value: formatCurrency(totalWithdrawals), color: 'text-orange-300' },
                { label: 'Pending Approval', value: pendingApprovals, color: pendingApprovals > 0 ? 'text-yellow-300' : 'text-cyan-200' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-3 py-3">
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-cyan-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Self-transaction notice */}
        <div className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-xl px-5 py-3">
          <AlertTriangle className="w-4 h-4 text-cyan-700 flex-shrink-0" />
          <p className="text-cyan-800 text-sm">
            <strong>System Rule:</strong> You cannot process transactions for your own account or immediate family. Such attempts are automatically flagged and logged.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Transaction Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-[#0A1F44] mb-3">Process Transaction</h3>
              <div className="flex gap-1 bg-[#F8FAFC] rounded-xl p-1">
                {(['deposit', 'withdrawal', 'transfer'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab ? 'bg-[#0A1F44] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0A1F44]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {success && (
                <div className="flex items-center gap-2 p-3 bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-xl text-sm font-semibold text-[#0D9488]">
                  <CheckCircle className="w-4 h-4" /> Transaction processed successfully!
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">
                  {activeTab === 'transfer' ? 'Source Account Number' : 'Account Number'}
                </label>
                <input
                  type="text"
                  placeholder="10-digit account number"
                  value={acctNo}
                  onChange={e => setAcctNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>

              {activeTab === 'transfer' && (
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Beneficiary Account Number</label>
                  <input
                    type="text"
                    placeholder="10-digit account number"
                    value={benAcct}
                    onChange={e => setBenAcct(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Narration</label>
                <input
                  type="text"
                  placeholder="e.g. Cash deposit over the counter"
                  value={narration}
                  onChange={e => setNarration(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>

              <button
                onClick={handleProcess}
                disabled={processing || !amount || !acctNo}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === 'deposit' ? 'bg-[#0D9488] hover:bg-teal-600' :
                  activeTab === 'withdrawal' ? 'bg-[#F97316] hover:bg-orange-500' :
                  'bg-[#0A1F44] hover:bg-[#1E3A5F]'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? 'Processing...' : `Process ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
              </button>
            </div>
          </div>

          {/* Today's Transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <Clock className="w-4 h-4 text-cyan-700" />
              <h3 className="font-bold text-[#0A1F44]">Today's Transactions</h3>
              <span className="ml-auto text-xs text-[#64748B]">{todayTransactions.length} entries</span>
            </div>
            <div className="divide-y divide-gray-50 overflow-y-auto flex-1">
              {todayTransactions.map((txn) => {
                const cfg = TXN_CONFIG[txn.type];
                const Icon = cfg.icon;
                return (
                  <div key={txn.ref} className="p-4 flex items-center gap-3">
                    <div className={`w-9 h-9 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0A1F44] truncate">{txn.customer}</p>
                      <p className="text-xs text-[#64748B]">{cfg.label} · {txn.acct} · {txn.time}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${txn.type === 'deposit' ? 'text-[#0D9488]' : 'text-[#F97316]'}`}>
                        {txn.type === 'deposit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </p>
                      {txn.status === 'pending-approval' ? (
                        <span className="text-xs text-yellow-600 font-semibold">Pending BM</span>
                      ) : (
                        <span className="text-xs text-[#0D9488] font-semibold flex items-center gap-0.5 justify-end"><CheckCircle className="w-3 h-3" /> Done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Till Summary */}
        <div className="bg-[#0A1F44] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">End-of-Day Till Summary</h3>
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Opening Balance', value: '₦2,000,000', color: 'text-white' },
              { label: 'Total Deposits', value: formatCurrency(totalDeposits), color: 'text-[#0D9488]' },
              { label: 'Total Withdrawals', value: formatCurrency(totalWithdrawals), color: 'text-[#F97316]' },
              { label: 'Closing Balance', value: formatCurrency(tillBalance), color: 'text-white font-bold' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-blue-300 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
