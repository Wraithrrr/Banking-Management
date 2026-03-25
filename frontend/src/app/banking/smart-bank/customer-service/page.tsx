'use client';

import { useState } from 'react';
import { HeadphonesIcon, CheckCircle, Clock, AlertTriangle, MessageSquare, User, X, Plus } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';

const tickets = [
  { ref: 'TKT-0291', customer: 'Mr. Babatunde Oladele', issue: 'Account funded but balance not reflecting after 48 hours', priority: 'high', status: 'open', created: '2025-01-25 09:12', sla: '24hrs', slaStatus: 'breached' },
  { ref: 'TKT-0290', customer: 'Mrs. Halima Sani', issue: 'Unable to complete transfer on mobile app — error code E409', priority: 'medium', status: 'in-progress', created: '2025-01-25 08:44', sla: '48hrs', slaStatus: 'ok' },
  { ref: 'TKT-0289', customer: 'Ekene Auto Parts Ltd', issue: 'Request for account statement for last 12 months', priority: 'low', status: 'resolved', created: '2025-01-24 14:30', sla: '72hrs', slaStatus: 'ok' },
  { ref: 'TKT-0288', customer: 'Mr. Chinedu Obi', issue: 'ATM card declined despite sufficient balance', priority: 'high', status: 'escalated', created: '2025-01-24 11:00', sla: '24hrs', slaStatus: 'at-risk' },
  { ref: 'TKT-0287', customer: 'Mrs. Aisha Mohammed', issue: 'Wrong name on debit card — request for reissuance', priority: 'medium', status: 'resolved', created: '2025-01-23 10:15', sla: '72hrs', slaStatus: 'ok' },
];

const recentInteractions = [
  { customer: 'Mr. Kola Adeyemi', action: 'Logged complaint — duplicate debit charge', time: '11:32 AM' },
  { customer: 'Mrs. Fatima Ibrahim', action: 'Updated ticket TKT-0290 — escalated to IT team', time: '10:58 AM' },
  { customer: 'Zenith Constructions Ltd', action: 'Resolved TKT-0289 — statement sent via email', time: '09:45 AM' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'open': { label: 'Open', color: 'bg-red-50 text-red-700' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  'escalated': { label: 'Escalated', color: 'bg-yellow-50 text-yellow-700' },
  'resolved': { label: 'Resolved', color: 'bg-green-50 text-green-700' },
};

export default function CustomerServiceDashboard() {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const open = tickets.filter(t => t.status === 'open').length;
  const inProgress = tickets.filter(t => t.status === 'in-progress').length;
  const breached = tickets.filter(t => t.slaStatus === 'breached').length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;

  const filtered = activeFilter === 'all' ? tickets : tickets.filter(t => t.status === activeFilter);

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="customer-service" userName="Grace Eze" userEmail="grace@demobank.ng" bankName="Demo Bank Ltd" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-emerald-300 text-sm font-medium mb-1">Lagos Victoria Island Branch</p>
              <h1 className="text-2xl font-bold mb-1">Customer Service</h1>
              <p className="text-emerald-200 text-sm">Manage complaints, tickets, and customer interactions</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Open Tickets', value: open, color: 'text-red-300' },
                { label: 'In Progress', value: inProgress, color: 'text-yellow-300' },
                { label: 'SLA Breached', value: breached, color: breached > 0 ? 'text-red-300' : 'text-emerald-200' },
                { label: 'Resolved Today', value: resolved, color: 'text-green-300' },
              ].map((s, i) => (
                <div key={i} className="text-center bg-white/10 rounded-xl px-3 py-3">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-emerald-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticket Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <HeadphonesIcon className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-[#0A1F44]">Complaint Tickets</h3>

            {/* Filter pills */}
            <div className="flex gap-1.5 ml-2">
              {['all', 'open', 'in-progress', 'escalated', 'resolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
                    activeFilter === f ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewTicket(true)}
              className="ml-auto flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Ticket
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((ticket) => (
              <div key={ticket.ref} className="p-5 flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  ticket.priority === 'high' ? 'bg-red-500' :
                  ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold text-[#0A1F44] text-sm">{ticket.ref}</span>
                    {ticket.slaStatus === 'breached' && (
                      <span className="text-xs font-bold text-red-700 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> SLA Breached</span>
                    )}
                    {ticket.slaStatus === 'at-risk' && (
                      <span className="text-xs font-bold text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3" /> SLA At Risk</span>
                    )}
                  </div>
                  <p className="text-sm text-[#0A1F44] font-medium">{ticket.issue}</p>
                  <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
                    <User className="w-3 h-3" />{ticket.customer} · {ticket.created}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[ticket.status].color}`}>
                    {STATUS_CONFIG[ticket.status].label}
                  </span>
                  {ticket.status !== 'resolved' && (
                    <button className="px-3 py-1.5 bg-[#0A1F44] text-white rounded-lg text-xs font-semibold hover:bg-[#1E3A5F] transition-colors">
                      Update
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Interactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-[#0A1F44]">My Recent Interactions</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInteractions.map((r, i) => (
              <div key={i} className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0A1F44]">{r.customer}</p>
                  <p className="text-xs text-[#64748B]">{r.action}</p>
                </div>
                <span className="text-xs text-[#64748B] flex items-center gap-1"><Clock className="w-3 h-3" />{r.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">Create New Ticket</h3>
              <button onClick={() => setShowNewTicket(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Customer Name', placeholder: 'e.g. Mr. Babatunde Oladele' },
                { label: 'Account Number', placeholder: 'e.g. 0123456789' },
                { label: 'Issue Description', placeholder: 'Describe the complaint in detail...' },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">{f.label}</label>
                  {f.label === 'Issue Description' ? (
                    <textarea placeholder={f.placeholder} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all resize-none" />
                  ) : (
                    <input type="text" placeholder={f.placeholder} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all" />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button key={p} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-[#64748B] hover:border-[#F97316] hover:text-[#0A1F44] transition-all">{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowNewTicket(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowNewTicket(false)} className="flex-1 bg-[#F97316] hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-sm transition-all">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
