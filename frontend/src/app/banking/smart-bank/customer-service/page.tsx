'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeadphonesIcon, CheckCircle, Clock, AlertTriangle, MessageSquare, User, X, Plus, Loader2, RefreshCw } from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import { authFetch } from '@/lib/auth-client';

interface Complaint {
  id: number; ticketNumber: string; customerName: string; accountNumber: string;
  issueType: string; description: string; priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'escalated' | 'resolved'; slaDeadline: string; createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  'open': { label: 'Open', color: 'bg-red-50 text-red-700' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  'escalated': { label: 'Escalated', color: 'bg-yellow-50 text-yellow-700' },
  'resolved': { label: 'Resolved', color: 'bg-green-50 text-green-700' },
};

const PRIORITY_DOT: Record<string, string> = {
  high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-blue-300',
};

export default function CustomerServiceDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [resolveModal, setResolveModal] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [form, setForm] = useState({ customerName: '', accountNumber: '', issueType: '', description: '', priority: 'medium' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/complaints');
      if (res.ok) setComplaints(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setIsSubmitting(true);
    try {
      const res = await authFetch('/complaints', { method: 'POST', body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create ticket');
      setShowModal(false);
      setForm({ customerName: '', accountNumber: '', issueType: '', description: '', priority: 'medium' });
      load();
    } catch (err: any) { setFormError(err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleEscalate = async (id: number) => {
    setActionLoading(id);
    try {
      await authFetch(`/complaints/${id}/escalate`, { method: 'PATCH' });
      load();
    } finally { setActionLoading(null); }
  };

  const handleResolve = async () => {
    if (!resolveModal) return;
    setIsSubmitting(true);
    try {
      await authFetch(`/complaints/${resolveModal.id}/resolve`, { method: 'PATCH', body: JSON.stringify({ resolutionNote }) });
      setResolveModal(null); setResolutionNote(''); load();
    } finally { setIsSubmitting(false); }
  };

  const filtered = activeFilter === 'all' ? complaints : complaints.filter(c => c.status === activeFilter);
  const open = complaints.filter(c => c.status === 'open').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const escalated = complaints.filter(c => c.status === 'escalated').length;
  const resolved = complaints.filter(c => c.status === 'resolved').length;
  const slaBreached = complaints.filter(c => c.status !== 'resolved' && new Date(c.slaDeadline) < new Date()).length;

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="customer-service" />
      <div className="flex-1 p-4 lg:p-8 space-y-6">

        <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">Customer Service</h1>
              <p className="text-emerald-200 text-sm">Manage complaints, tickets, and customer interactions</p>
            </div>
            <div className="flex gap-3 flex-wrap items-start">
              {[{ label: 'Open', value: open, c: 'text-red-300' }, { label: 'In Progress', value: inProgress, c: 'text-yellow-300' }, { label: 'Escalated', value: escalated, c: 'text-orange-300' }, { label: 'SLA Breached', value: slaBreached, c: slaBreached > 0 ? 'text-red-300' : 'text-emerald-200' }, { label: 'Resolved', value: resolved, c: 'text-green-300' }].map(s => (
                <div key={s.label} className="bg-white/10 rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className={`text-2xl font-bold ${s.c}`}>{s.value}</div>
                  <div className="text-emerald-300 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
              <button onClick={load} className="bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <HeadphonesIcon className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-[#0A1F44]">Complaint Tickets</h3>
            <div className="flex gap-1.5 ml-2">
              {['all', 'open', 'in-progress', 'escalated', 'resolved'].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${activeFilter === f ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'}`}>{f}</button>
              ))}
            </div>
            <button onClick={() => { setShowModal(true); setFormError(''); }} className="ml-auto flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <Plus className="w-3.5 h-3.5" />New Ticket
            </button>
          </div>

          {loading ? <div className="flex items-center justify-center py-16"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            : filtered.length === 0 ? <div className="text-center py-16 text-[#64748B]"><HeadphonesIcon className="w-10 h-10 mx-auto mb-3 text-gray-200" /><p className="font-medium">No tickets found</p></div>
            : (
              <div className="divide-y divide-gray-50">
                {filtered.map(c => {
                  const slaBreached = c.status !== 'resolved' && new Date(c.slaDeadline) < new Date();
                  const slaAtRisk = !slaBreached && c.status !== 'resolved' && (new Date(c.slaDeadline).getTime() - Date.now()) < 4 * 3600000;
                  return (
                    <div key={c.id} className="p-5 flex items-start gap-4">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${PRIORITY_DOT[c.priority]}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-[#0A1F44] text-sm font-mono">{c.ticketNumber}</span>
                          {slaBreached && <span className="text-xs font-bold text-red-700 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> SLA Breached</span>}
                          {slaAtRisk && <span className="text-xs font-bold text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3" /> SLA At Risk</span>}
                        </div>
                        <p className="text-sm text-[#0A1F44] font-medium">{c.description}</p>
                        <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1.5">
                          <User className="w-3 h-3" />{c.customerName} · {c.accountNumber} · {c.issueType} · {new Date(c.createdAt).toLocaleDateString('en-NG')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[c.status].color}`}>{STATUS_CONFIG[c.status].label}</span>
                        {c.status === 'open' && (
                          <button onClick={() => handleEscalate(c.id)} disabled={actionLoading === c.id}
                            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-60">
                            {actionLoading === c.id ? '...' : 'Escalate'}
                          </button>
                        )}
                        {(c.status === 'open' || c.status === 'in-progress' || c.status === 'escalated') && (
                          <button onClick={() => { setResolveModal(c); setResolutionNote(''); }}
                            className="px-3 py-1.5 bg-[#0A1F44] hover:bg-[#1E3A5F] text-white rounded-lg text-xs font-semibold transition-colors">Resolve</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">Create New Ticket</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Customer Name *</label>
                  <input type="text" required value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" /></div>
                <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Account Number</label>
                  <input type="text" maxLength={10} value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Issue Type *</label>
                <select required value={form.issueType} onChange={e => setForm(f => ({ ...f, issueType: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400">
                  <option value="">Select issue type...</option>
                  <option>Account funding not reflecting</option>
                  <option>Failed transfer</option>
                  <option>ATM / Card issue</option>
                  <option>Account statement request</option>
                  <option>Unauthorized transaction</option>
                  <option>Account freeze / restriction</option>
                  <option>Other</option>
                </select></div>
              <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Description *</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none" /></div>
              <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                      className={`flex-1 py-2.5 border-2 rounded-xl text-sm font-semibold capitalize transition-all ${form.priority === p ? 'border-emerald-600 text-emerald-700 bg-emerald-50' : 'border-gray-200 text-[#64748B] hover:border-emerald-400'}`}>{p}</button>
                  ))}
                </div></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-[#0A1F44] mb-1">Resolve Ticket</h3>
            <p className="text-sm text-[#64748B] mb-4 font-mono">{resolveModal.ticketNumber} — {resolveModal.customerName}</p>
            <div><label className="block text-sm font-semibold text-[#0A1F44] mb-1.5">Resolution Note *</label>
              <textarea rows={3} required value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} placeholder="Describe how the issue was resolved..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none" /></div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setResolveModal(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold text-sm">Cancel</button>
              <button onClick={handleResolve} disabled={isSubmitting || !resolutionNote.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Resolving...</> : <><CheckCircle className="w-4 h-4" />Mark Resolved</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
