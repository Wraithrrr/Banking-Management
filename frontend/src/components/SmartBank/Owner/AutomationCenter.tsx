'use client';

import { useState } from 'react';
import { Workflow, Zap, Settings, CheckCircle2, Pause, Play, Clock, ChevronRight } from 'lucide-react';

type Status = 'active' | 'paused' | 'draft';

interface Automation {
  id: string;
  name: string;
  owner: string;
  department: 'Treasury' | 'Business Dev' | 'Operations';
  runs: number;
  status: Status;
  sla: string;
}

export default function AutomationCenter() {
  const [automations, setAutomations] = useState<Automation[]>([
    { id: 'a1', name: 'Monthly Profit Distribution', owner: 'Treasury', department: 'Treasury', runs: 12, status: 'active', sla: '< 10m' },
    { id: 'a2', name: 'Lead Nurture Sequence', owner: 'Business Dev', department: 'Business Dev', runs: 58, status: 'active', sla: '< 5m' },
    { id: 'a3', name: 'Real-time Compliance Scan', owner: 'Operations', department: 'Operations', runs: 1000, status: 'active', sla: '< 1s' },
    { id: 'a4', name: 'High-Value Approval', owner: 'Operations', department: 'Operations', runs: 21, status: 'paused', sla: '< 30m' },
  ]);

  const toggle = (id: string) => setAutomations(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Center</h2>
          <p className="text-gray-600">Bank-wide workflow orchestration (demo)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {automations.map(a => (
          <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{a.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{a.status === 'active' ? 'Active' : 'Paused'}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1"><Workflow className="w-3 h-3" /> {a.department}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> SLA {a.sla}</span>
                  <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Runs {a.runs}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(a.id)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${a.status === 'active' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  {a.status === 'active' ? (
                    <span className="inline-flex items-center gap-1"><Pause className="w-4 h-4" /> Pause</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><Play className="w-4 h-4" /> Activate</span>
                  )}
                </button>
                <button className="px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 hover:bg-gray-50">Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">Demo mode: toggles are local only. A production setup would include workflow engine integration, approvals, audit logs, and SLA monitoring.</p>
      </div>
    </div>
  );
}
