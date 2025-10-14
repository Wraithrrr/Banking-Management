'use client';

import { useState } from 'react';
import { Play, Pause, FileCheck, Shield, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

interface Workflow { id: string; name: string; description: string; steps: number; avgTime: string; status: 'active' | 'paused' | 'draft'; lastRun?: string; }

export default function ComplianceWorkflows() {
  const [flows, setFlows] = useState<Workflow[]>([
    { id: 'wf-kyc-review', name: 'KYC Review Queue', description: 'Automated verification and escalation for pending KYC', steps: 5, avgTime: '8m', status: 'active', lastRun: 'Today 09:30' },
    { id: 'wf-reg-report', name: 'Regulatory Reporting', description: 'Generate and submit monthly regulatory returns', steps: 6, avgTime: '15m', status: 'active', lastRun: 'Yesterday 23:00' },
    { id: 'wf-shariah-audit', name: 'Shariah Audit', description: 'Review contracts and transactions for Shariah compliance', steps: 7, avgTime: '30m', status: 'paused' },
  ]);

  const toggle = (id: string) => setFlows(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'active' ? 'paused' : 'active' } : f));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Workflows</h2>
          <p className="text-gray-600">Automations for KYC, reporting, and Shariah review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {flows.map(flow => (
          <div key={flow.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{flow.name}</h3>
                  {flow.status === 'active' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">Active</span>
                  ) : flow.status === 'paused' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">Paused</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">Draft</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{flow.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1"><ChevronRight className="w-3 h-3" /> {flow.steps} steps</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> Avg {flow.avgTime}</span>
                  {flow.lastRun && (
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Last run: {flow.lastRun}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(flow.id)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${flow.status === 'active' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  {flow.status === 'active' ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">Demo-only: toggles don’t persist. Production would add orchestration, approvals, audit logs, and monitoring.</div>
    </div>
  );
}
