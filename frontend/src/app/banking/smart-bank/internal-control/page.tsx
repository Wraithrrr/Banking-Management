'use client';

import { useState } from 'react';
import { AlertTriangle, FileClock, ClipboardCheck, Activity, Eye, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';

const auditLogs = [
  { id: 'AL001', user: 'Fatima Bello', role: 'Teller', action: 'Processed deposit of ₦450,000', module: 'TXN', time: '09:14 AM', status: 'normal' },
  { id: 'AL002', user: 'Chidi Okonkwo', role: 'Credit Officer', action: 'Created loan application #LN-2024-0041', module: 'LON', time: '09:32 AM', status: 'normal' },
  { id: 'AL003', user: 'Emeka Nwosu', role: 'Branch Manager', action: 'Approved transaction above branch limit', module: 'TXN', time: '10:05 AM', status: 'flagged' },
  { id: 'AL004', user: 'Zainab Ahmad', role: 'Compliance Officer', action: 'Approved KYC for customer ID C-00912', module: 'KYC', time: '10:28 AM', status: 'normal' },
  { id: 'AL005', user: 'Taiwo Adekunle', role: 'Head of Operations', action: 'Updated approval threshold for Abuja branch', module: 'SET', time: '11:00 AM', status: 'normal' },
  { id: 'AL006', user: 'Ahmed Suleiman', role: 'IT Admin', action: 'Created new user: Musa Garba (Teller)', module: 'USR', time: '11:45 AM', status: 'normal' },
  { id: 'AL007', user: 'Fatima Bello', role: 'Teller', action: 'Attempted self-transaction — BLOCKED by system', module: 'TXN', time: '12:02 PM', status: 'violation' },
  { id: 'AL008', user: 'Chidi Okonkwo', role: 'Credit Officer', action: 'Uploaded supporting docs for LN-2024-0041', module: 'LON', time: '12:30 PM', status: 'normal' },
];

const exceptions = [
  { ref: 'EX-0041', description: 'Teller attempted to process own account transaction', severity: 'high', date: '2025-01-25', status: 'open' },
  { ref: 'EX-0040', description: 'Branch Manager approved transaction exceeding branch limit without escalation', severity: 'high', date: '2025-01-24', status: 'under-review' },
  { ref: 'EX-0039', description: 'Loan approved same day as application — missing 24hr waiting period', severity: 'medium', date: '2025-01-23', status: 'resolved' },
  { ref: 'EX-0038', description: 'KYC documents uploaded after account activation (retroactive)', severity: 'medium', date: '2025-01-22', status: 'resolved' },
  { ref: 'EX-0037', description: 'User login from unrecognised IP address flagged', severity: 'low', date: '2025-01-21', status: 'resolved' },
];

const moduleAccess = [
  { module: 'User Management', access: 'Read Only' },
  { module: 'Accounts', access: 'Read Only' },
  { module: 'KYC', access: 'Read Only' },
  { module: 'Transactions', access: 'Read Only' },
  { module: 'Loans', access: 'Read Only' },
  { module: 'Compliance', access: 'Read Only' },
  { module: 'Audit Logs', access: 'Full Access' },
  { module: 'Reports', access: 'Read + Export' },
];

export default function InternalControlDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'exceptions'>('overview');

  const openExceptions = exceptions.filter(e => e.status === 'open' || e.status === 'under-review').length;
  const violations = auditLogs.filter(l => l.status === 'violation').length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="internal-control" userName="Audit Officer" userEmail="audit@demobank.ng" bankName="Demo Bank Ltd" />

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
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Log Entries Today', value: auditLogs.length, color: 'text-white' },
                { label: 'Violations', value: violations, color: 'text-red-300' },
                { label: 'Open Exceptions', value: openExceptions, color: 'text-yellow-300' },
                { label: 'Modules Monitored', value: moduleAccess.length, color: 'text-purple-200' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-4 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-purple-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
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
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'logs', label: 'Audit Logs' },
            { key: 'exceptions', label: `Exceptions (${openExceptions} open)` },
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

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Module Access */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0A1F44] mb-4">Module Access Scope</h3>
              <div className="space-y-2">
                {moduleAccess.map((m, i) => (
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

            {/* Exception Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0A1F44] mb-4">Exception Summary</h3>
              <div className="space-y-3">
                {exceptions.slice(0, 4).map((ex, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-gray-100">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      ex.severity === 'high' ? 'bg-red-500' :
                      ex.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0A1F44] font-medium">{ex.description}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{ex.ref} · {ex.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      ex.status === 'open' ? 'bg-red-50 text-red-700' :
                      ex.status === 'under-review' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>{ex.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <FileClock className="w-4 h-4 text-purple-700" />
              <h3 className="font-bold text-[#0A1F44]">Today's Audit Log</h3>
              <span className="ml-auto text-xs text-[#64748B]">{auditLogs.length} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-gray-100">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">User</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Action</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Module</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Time</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className={`border-b border-gray-50 ${log.status === 'violation' ? 'bg-red-50' : log.status === 'flagged' ? 'bg-yellow-50' : 'hover:bg-[#F8FAFC]'} transition-colors`}>
                      <td className="py-3 px-5">
                        <div className="font-semibold text-[#0A1F44] text-sm">{log.user}</div>
                        <div className="text-[#64748B] text-xs">{log.role}</div>
                      </td>
                      <td className="py-3 px-5 text-sm text-[#0A1F44] max-w-xs">{log.action}</td>
                      <td className="py-3 px-5">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">{log.module}</span>
                      </td>
                      <td className="py-3 px-5 text-xs text-[#64748B] flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3" />{log.time}
                      </td>
                      <td className="py-3 px-5">
                        {log.status === 'violation' ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-700"><XCircle className="w-3.5 h-3.5" /> Violation</span>
                        ) : log.status === 'flagged' ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-yellow-700"><AlertTriangle className="w-3.5 h-3.5" /> Flagged</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-[#0D9488]"><CheckCircle className="w-3.5 h-3.5" /> Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exceptions */}
        {activeTab === 'exceptions' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <h3 className="font-bold text-[#0A1F44]">Exception Reports</h3>
              <span className="ml-auto text-xs text-[#64748B]">{exceptions.length} total</span>
            </div>
            <div className="divide-y divide-gray-50">
              {exceptions.map((ex) => (
                <div key={ex.ref} className="p-5 flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    ex.severity === 'high' ? 'bg-red-500' :
                    ex.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#0A1F44] text-sm">{ex.ref}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        ex.severity === 'high' ? 'bg-red-50 text-red-700' :
                        ex.severity === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'
                      }`}>{ex.severity.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-[#0A1F44]">{ex.description}</p>
                    <p className="text-xs text-[#64748B] mt-1">{ex.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    ex.status === 'open' ? 'bg-red-50 text-red-700' :
                    ex.status === 'under-review' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
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
