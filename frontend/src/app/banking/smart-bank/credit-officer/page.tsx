'use client';

import { useState } from 'react';
import { BookOpen, UserPlus, Clock, CheckCircle, AlertTriangle, FileText, TrendingUp, X } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';

const myApplications = [
  { ref: 'LN-2025-0041', applicant: 'Adewale Traders Ltd', type: 'SME Loan', amount: '₦8,500,000', status: 'pending-bm', submittedOn: '2025-01-24', daysOpen: 2 },
  { ref: 'LN-2025-0038', applicant: 'Mrs. Ngozi Okeke', type: 'Personal Loan', amount: '₦650,000', status: 'approved', submittedOn: '2025-01-20', daysOpen: 6 },
  { ref: 'LN-2025-0035', applicant: 'Bright Future Schools', type: 'Education Loan', amount: '₦4,200,000', status: 'pending-hoc', submittedOn: '2025-01-18', daysOpen: 8 },
  { ref: 'LN-2025-0031', applicant: 'Mr. Abdullahi Musa', type: 'Consumer Loan', amount: '₦300,000', status: 'declined', submittedOn: '2025-01-15', daysOpen: 0 },
  { ref: 'LN-2025-0028', applicant: 'Zara Fashion House', type: 'SME Loan', amount: '₦2,100,000', status: 'disbursed', submittedOn: '2025-01-10', daysOpen: 0 },
];

const collectionsQueue = [
  { ref: 'LN-2024-0198', borrower: 'Kola Enterprises', overdueDays: 14, amount: '₦320,000', lastAction: 'SMS sent 3 days ago' },
  { ref: 'LN-2024-0167', borrower: 'Mrs. Aisha Ibrahim', overdueDays: 7, amount: '₦48,000', lastAction: 'Phone call made' },
  { ref: 'LN-2024-0144', borrower: 'TechPad Solutions', overdueDays: 31, amount: '₦1,200,000', lastAction: 'Escalated to Branch Manager' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'pending-bm': { label: 'Awaiting BM Review', color: 'bg-yellow-50 text-yellow-700' },
  'pending-hoc': { label: 'Awaiting HoC Approval', color: 'bg-blue-50 text-blue-700' },
  'approved': { label: 'Approved', color: 'bg-green-50 text-green-700' },
  'declined': { label: 'Declined', color: 'bg-red-50 text-red-700' },
  'disbursed': { label: 'Disbursed', color: 'bg-[#0D9488]/10 text-[#0D9488]' },
};

export default function CreditOfficerDashboard() {
  const [showNewLoan, setShowNewLoan] = useState(false);
  const [form, setForm] = useState({ applicantName: '', loanType: '', amount: '', purpose: '' });

  const approved = myApplications.filter(a => a.status === 'approved' || a.status === 'disbursed').length;
  const pending = myApplications.filter(a => a.status === 'pending-bm' || a.status === 'pending-hoc').length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="credit-officer" userName="Chidi Okonkwo" userEmail="chidi@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-blue-300 text-sm font-medium mb-1">Lagos Victoria Island Branch</p>
              <h1 className="text-2xl font-bold mb-1">Credit Officer Dashboard</h1>
              <p className="text-blue-200 text-sm">Manage loan applications and borrower follow-ups</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Applications', value: myApplications.length, color: 'text-white' },
                { label: 'In Progress', value: pending, color: 'text-yellow-300' },
                { label: 'Approved', value: approved, color: 'text-green-300' },
                { label: 'Overdue Follow-ups', value: collectionsQueue.length, color: 'text-red-300' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-3 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Restriction notice */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3">
          <AlertTriangle className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <p className="text-blue-800 text-sm">
            <strong>Separation of Duties:</strong> You can create and recommend loan applications. Approval is handled by your Branch Manager and the Head of Credit.
          </p>
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-[#0A1F44]">My Loan Applications</h3>
            <button
              onClick={() => setShowNewLoan(true)}
              className="ml-auto flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              New Application
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-gray-100">
                  {['Reference', 'Applicant', 'Type', 'Amount', 'Status', 'Submitted'].map(h => (
                    <th key={h} className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myApplications.map((app) => (
                  <tr key={app.ref} className="border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#0A1F44] text-sm">{app.ref}</td>
                    <td className="py-3.5 px-5 text-sm text-[#0A1F44]">{app.applicant}</td>
                    <td className="py-3.5 px-5 text-xs text-[#64748B]">{app.type}</td>
                    <td className="py-3.5 px-5 text-sm font-bold text-[#0A1F44]">{app.amount}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[app.status].color}`}>
                        {STATUS_CONFIG[app.status].label}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-[#64748B] flex items-center gap-1.5 mt-2">
                      <Clock className="w-3 h-3" />{app.submittedOn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collections */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-bold text-[#0A1F44]">Overdue Collections Follow-up</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {collectionsQueue.map((c) => (
              <div key={c.ref} className="p-5 flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.overdueDays > 30 ? 'bg-red-500' : c.overdueDays > 14 ? 'bg-yellow-500' : 'bg-orange-400'}`} />
                <div className="flex-1">
                  <p className="font-semibold text-[#0A1F44] text-sm">{c.borrower}</p>
                  <p className="text-xs text-[#64748B]">{c.ref} · Overdue: {c.overdueDays} days · {c.lastAction}</p>
                </div>
                <span className="font-bold text-red-700 text-sm">{c.amount}</span>
                <button className="px-3 py-1.5 bg-[#0A1F44] text-white rounded-lg text-xs font-semibold hover:bg-[#1E3A5F] transition-colors">
                  Log Action
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Loan Modal */}
      {showNewLoan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">New Loan Application</h3>
              <button onClick={() => setShowNewLoan(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Applicant Name', key: 'applicantName', placeholder: 'e.g. Adewale Traders Ltd' },
                { label: 'Amount Requested (₦)', key: 'amount', placeholder: 'e.g. 5000000' },
                { label: 'Purpose', key: 'purpose', placeholder: 'e.g. Working capital expansion' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Loan Type</label>
                <select
                  value={form.loanType}
                  onChange={e => setForm({ ...form, loanType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                >
                  <option value="">Select loan type</option>
                  {['SME Loan', 'Personal Loan', 'Agricultural Loan', 'Education Loan', 'Consumer Loan', 'Mortgage'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowNewLoan(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowNewLoan(false)} className="flex-1 bg-[#F97316] hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-sm transition-all">
                Submit for BM Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
