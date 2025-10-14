'use client';

import { useState } from 'react';
import { Play, Pause, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  avgTimeMins: number;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
}

export default function TreasuryWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'wf-sukuk-rollover',
      name: 'Sukuk Maturity Rollover',
      description: 'Auto-evaluate maturing Sukuk and propose rollover or payout based on policy',
      steps: 6,
      avgTimeMins: 4,
      status: 'active',
      lastRun: 'Today 09:15',
    },
    {
      id: 'wf-profit-distribution',
      name: 'Monthly Profit Distribution',
      description: 'Calculate and post monthly Mudarabah profit shares to customer accounts',
      steps: 5,
      avgTimeMins: 7,
      status: 'active',
      lastRun: 'Yesterday 23:05',
    },
    {
      id: 'wf-liquidity-alerts',
      name: 'Liquidity Threshold Alerts',
      description: 'Monitor liquidity buffers and alert when thresholds approach limits',
      steps: 4,
      avgTimeMins: 1,
      status: 'paused',
    },
  ]);

  const toggleStatus = (id: string) => {
    setWorkflows(prev => prev.map(w =>
      w.id === id
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Treasury Workflows</h2>
          <p className="text-gray-600">Automations for asset management and profit distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {workflows.map(wf => (
          <div key={wf.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{wf.name}</h3>
                  {wf.status === 'active' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">Active</span>
                  ) : wf.status === 'paused' ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold">Paused</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold">Draft</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{wf.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1"><ChevronRight className="w-3 h-3" /> {wf.steps} steps</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> ~{wf.avgTimeMins} mins</span>
                  {wf.lastRun && (
                    <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Last run: {wf.lastRun}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleStatus(wf.id)} className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${wf.status === 'active' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  {wf.status === 'active' ? (
                    <span className="inline-flex items-center gap-1"><Pause className="w-4 h-4" /> Pause</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><Play className="w-4 h-4" /> Activate</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2 text-blue-800">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm">This is a demo: actions toggle status locally without persisting. Connect to backend to store definitions, run history, and approvals.</p>
        </div>
      </div>
    </div>
  );
}
