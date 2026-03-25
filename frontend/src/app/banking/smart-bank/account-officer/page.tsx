'use client';

import { useState } from 'react';
import { UserCheck, UserPlus, FileText, Clock, CheckCircle, AlertTriangle, X, Eye } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';

const recentAccounts = [
  { acctNo: '0012345678', customer: 'Mr. Babatunde Oladele', type: 'Current Account', kycStatus: 'pending-compliance', openedOn: '2025-01-25', docs: 3 },
  { acctNo: '0012345601', customer: 'Mrs. Hauwa Garba', type: 'Savings Account', kycStatus: 'approved', openedOn: '2025-01-24', docs: 4 },
  { acctNo: '0012345589', customer: 'Sunrise Logistics Ltd', type: 'Corporate Account', kycStatus: 'pending-compliance', openedOn: '2025-01-23', docs: 7 },
  { acctNo: '0012345571', customer: 'Mr. Emeka Chibuike', type: 'Savings Account', kycStatus: 'approved', openedOn: '2025-01-22', docs: 3 },
  { acctNo: '0012345548', customer: 'Mrs. Zainab Musa', type: 'Dom Account', kycStatus: 'incomplete', openedOn: '2025-01-20', docs: 1 },
];

const kycChecklist = [
  { doc: 'Valid Government ID (NIN/Passport/Drivers Licence)', required: true },
  { doc: 'Utility Bill (not older than 3 months)', required: true },
  { doc: 'Passport Photograph (2 copies)', required: true },
  { doc: 'BVN Verification', required: true },
  { doc: 'CAC Certificate (for corporate accounts)', required: false },
  { doc: 'Board Resolution (for corporate accounts)', required: false },
];

const KYC_CONFIG: Record<string, { label: string; color: string }> = {
  'approved': { label: 'KYC Approved', color: 'bg-green-50 text-green-700' },
  'pending-compliance': { label: 'Pending Compliance', color: 'bg-yellow-50 text-yellow-700' },
  'incomplete': { label: 'Incomplete Docs', color: 'bg-red-50 text-red-700' },
};

export default function AccountOfficerDashboard() {
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [acctType, setAcctType] = useState('');

  const pendingKyc = recentAccounts.filter(a => a.kycStatus === 'pending-compliance').length;
  const incompleteKyc = recentAccounts.filter(a => a.kycStatus === 'incomplete').length;
  const approved = recentAccounts.filter(a => a.kycStatus === 'approved').length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="account-officer" userName="Adaobi Nwosu" userEmail="adaobi@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-800 to-indigo-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-indigo-300 text-sm font-medium mb-1">Lagos Victoria Island Branch</p>
              <h1 className="text-2xl font-bold mb-1">Account Officer Dashboard</h1>
              <p className="text-indigo-200 text-sm">Account opening, KYC capture, and customer profile management</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Accounts Opened', value: recentAccounts.length, color: 'text-white' },
                { label: 'Pending KYC', value: pendingKyc, color: 'text-yellow-300' },
                { label: 'Incomplete Docs', value: incompleteKyc, color: incompleteKyc > 0 ? 'text-red-300' : 'text-indigo-200' },
                { label: 'KYC Approved', value: approved, color: 'text-green-300' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-3 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-indigo-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KYC notice */}
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3">
          <AlertTriangle className="w-4 h-4 text-indigo-700 flex-shrink-0" />
          <p className="text-indigo-800 text-sm">
            <strong>Separation of Duties:</strong> You capture and submit KYC documents. Final KYC approval is handled by the Compliance Officer.
          </p>
        </div>

        {/* Recent Accounts Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-indigo-700" />
            <h3 className="font-bold text-[#0A1F44]">Recent Account Openings</h3>
            <button
              onClick={() => setShowNewAccount(true)}
              className="ml-auto flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              New Account
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100">
                  {['Account No.', 'Customer', 'Account Type', 'KYC Status', 'Docs', 'Opened'].map(h => (
                    <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAccounts.map((acc) => (
                  <tr key={acc.acctNo} className="border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#0A1F44] text-sm font-mono">{acc.acctNo}</td>
                    <td className="py-3.5 px-5 text-sm font-semibold text-[#0A1F44]">{acc.customer}</td>
                    <td className="py-3.5 px-5 text-xs text-[#64748B]">{acc.type}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${KYC_CONFIG[acc.kycStatus].color}`}>
                        {KYC_CONFIG[acc.kycStatus].label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="text-sm font-semibold text-[#0A1F44]">{acc.docs}</span>
                      <span className="text-xs text-[#64748B]"> docs</span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-[#64748B] flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3" />{acc.openedOn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KYC Checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <FileText className="w-4 h-4 text-indigo-700" />
            <h3 className="font-bold text-[#0A1F44]">KYC Document Requirements</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kycChecklist.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.required ? 'border-indigo-100 bg-indigo-50' : 'border-gray-100 bg-[#F8FAFC]'}`}>
                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.required ? 'text-indigo-600' : 'text-gray-400'}`} />
                <div>
                  <p className={`text-sm ${item.required ? 'text-[#0A1F44] font-medium' : 'text-[#64748B]'}`}>{item.doc}</p>
                  <p className="text-xs mt-0.5 font-semibold text-[#64748B]">{item.required ? 'Mandatory' : 'Corporate accounts only'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Account Modal */}
      {showNewAccount && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">Open New Account</h3>
              <button onClick={() => setShowNewAccount(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {['Full Name', 'BVN', 'Phone Number', 'Email Address'].map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">{f}</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Savings', 'Current', 'Dom Account', 'Corporate'].map(t => (
                    <button
                      key={t}
                      onClick={() => setAcctType(t)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        acctType === t ? 'border-[#F97316] bg-orange-50 text-[#0A1F44]' : 'border-gray-200 text-[#64748B] hover:border-gray-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowNewAccount(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowNewAccount(false)} className="flex-1 bg-[#F97316] hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-sm transition-all">
                Submit for KYC Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
