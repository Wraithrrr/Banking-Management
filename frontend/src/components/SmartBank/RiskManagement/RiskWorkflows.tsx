'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Brain, AlertTriangle, ShieldCheck, BarChart3, Clock, CheckCircle2, ChevronRight, History, Settings, Calendar, TrendingUp, XCircle, User, FileText, Eye, X } from 'lucide-react';

interface WorkflowExecution {
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  duration: string;
  recordsProcessed: number;
  alertsGenerated: number;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: number;
  avgTime: string;
  status: 'active' | 'paused' | 'draft';
  lastRun?: string;
  successRate: number;
  totalRuns: number;
  owner: string;
  approvedBy?: string;
  executionHistory: WorkflowExecution[];
}

export default function RiskWorkflows() {
  const [flows, setFlows] = useState<Workflow[]>([
    {
      id: 'wf-fraud-detection',
      name: 'Fraud Pattern Detection',
      description: 'Graph-based anomaly detection on card & transfers',
      steps: 7,
      avgTime: '<1s',
      status: 'active',
      lastRun: 'Just now',
      successRate: 98.5,
      totalRuns: 1247,
      owner: 'Fraud Team',
      approvedBy: 'Chief Risk Officer',
      executionHistory: [
        { timestamp: '2 mins ago', status: 'success', duration: '0.8s', recordsProcessed: 3421, alertsGenerated: 2 },
        { timestamp: '1 hour ago', status: 'success', duration: '0.9s', recordsProcessed: 3156, alertsGenerated: 1 },
        { timestamp: '2 hours ago', status: 'success', duration: '0.7s', recordsProcessed: 2987, alertsGenerated: 0 },
        { timestamp: '3 hours ago', status: 'failed', duration: '5.2s', recordsProcessed: 0, alertsGenerated: 0 },
      ]
    },
    {
      id: 'wf-credit-scoring',
      name: 'Credit Scoring AI',
      description: 'Score new loans using ML model and set risk bands',
      steps: 6,
      avgTime: '2m',
      status: 'active',
      lastRun: '5m ago',
      successRate: 99.2,
      totalRuns: 892,
      owner: 'Credit Risk Team',
      approvedBy: 'Head of Credit',
      executionHistory: [
        { timestamp: '5 mins ago', status: 'success', duration: '1.8m', recordsProcessed: 45, alertsGenerated: 3 },
        { timestamp: '3 hours ago', status: 'success', duration: '2.1m', recordsProcessed: 38, alertsGenerated: 2 },
        { timestamp: '6 hours ago', status: 'success', duration: '1.9m', recordsProcessed: 52, alertsGenerated: 4 },
      ]
    },
    {
      id: 'wf-aml-screening',
      name: 'AML Screening',
      description: 'Screen counterparties against sanctions & PEP lists',
      steps: 5,
      avgTime: '3m',
      status: 'paused',
      successRate: 97.8,
      totalRuns: 654,
      owner: 'Compliance Team',
      approvedBy: 'Compliance Officer',
      executionHistory: [
        { timestamp: '2 days ago', status: 'success', duration: '2.8m', recordsProcessed: 124, alertsGenerated: 8 },
      ]
    },
    {
      id: 'wf-early-warning',
      name: 'Early Warning Signals',
      description: 'Monitor leading indicators and issue EWS alerts',
      steps: 4,
      avgTime: '30s',
      status: 'active',
      lastRun: '10m ago',
      successRate: 100,
      totalRuns: 2341,
      owner: 'Risk Analytics',
      approvedBy: 'Chief Risk Officer',
      executionHistory: [
        { timestamp: '10 mins ago', status: 'success', duration: '28s', recordsProcessed: 856, alertsGenerated: 1 },
        { timestamp: '1 hour ago', status: 'success', duration: '32s', recordsProcessed: 834, alertsGenerated: 2 },
      ]
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string, action: 'activate' | 'pause' } | null>(null);

  // Persist changes to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('riskWorkflows');
    if (saved) {
      try {
        setFlows(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load workflows from storage');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('riskWorkflows', JSON.stringify(flows));
  }, [flows]);

  const requestApproval = (id: string, action: 'activate' | 'pause') => {
    setPendingAction({ id, action });
    setShowApprovalModal(true);
  };

  const approveAction = () => {
    if (!pendingAction) return;

    setFlows(prev => prev.map(f =>
      f.id === pendingAction.id
        ? {
          ...f,
          status: pendingAction.action === 'activate' ? 'active' : 'paused',
          approvedBy: 'Current User',
          lastRun: pendingAction.action === 'activate' ? 'Just now' : f.lastRun
        }
        : f
    ));

    setShowApprovalModal(false);
    setPendingAction(null);
  };

  const toggle = (id: string) => {
    const workflow = flows.find(f => f.id === id);
    if (!workflow) return;

    const action = workflow.status === 'active' ? 'pause' : 'activate';
    requestApproval(id, action);
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Workflows</h2>
          <p className="text-gray-600">Automated risk detection and monitoring processes</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium text-gray-700"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Workflows</p>
          <p className="text-2xl font-bold text-gray-900">{flows.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{flows.filter(f => f.status === 'active').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Avg Success Rate</p>
          <p className="text-2xl font-bold text-blue-600">
            {(flows.reduce((sum, f) => sum + f.successRate, 0) / flows.length).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Executions</p>
          <p className="text-2xl font-bold text-gray-900">
            {flows.reduce((sum, f) => sum + f.totalRuns, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 gap-4">
        {flows.map(flow => (
          <div key={flow.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{flow.name}</h3>
                  {flow.status === 'active' ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  ) : flow.status === 'paused' ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">Paused</span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold">Draft</span>
                  )}
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {flow.successRate}% Success
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{flow.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Steps</p>
                    <p className="text-sm font-semibold text-gray-900">{flow.steps} steps</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Duration</p>
                    <p className="text-sm font-semibold text-gray-900">{flow.avgTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Run</p>
                    <p className="text-sm font-semibold text-gray-900">{flow.lastRun || 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Runs</p>
                    <p className="text-sm font-semibold text-gray-900">{flow.totalRuns.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Owner: {flow.owner}
                  </span>
                  {flow.approvedBy && (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      Approved by: {flow.approvedBy}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggle(flow.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${flow.status === 'active'
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    {flow.status === 'active' ? (
                      <span className="inline-flex items-center gap-2">
                        <Pause className="w-4 h-4" /> Pause Workflow
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Play className="w-4 h-4" /> Activate Workflow
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setSelectedWorkflow(flow)}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    View History
                  </button>

                  <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>

                  <button
                    className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Audit Log
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Execution History Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedWorkflow(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedWorkflow.name}</h2>
                <p className="text-sm text-gray-600">Execution History & Performance Metrics</p>
              </div>
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-green-900">{selectedWorkflow.successRate}%</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 mb-1">Total Executions</p>
                  <p className="text-3xl font-bold text-blue-900">{selectedWorkflow.totalRuns}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-700 mb-1">Avg Duration</p>
                  <p className="text-3xl font-bold text-purple-900">{selectedWorkflow.avgTime}</p>
                </div>
              </div>

              {/* Execution Log */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Executions
                </h3>
                <div className="space-y-3">
                  {selectedWorkflow.executionHistory.map((exec, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {exec.status === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : exec.status === 'failed' ? (
                            <XCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                          )}
                          <span className="font-semibold text-gray-900">
                            {exec.status === 'success' ? 'Completed Successfully' :
                              exec.status === 'failed' ? 'Execution Failed' :
                                'Running...'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${exec.status === 'success' ? 'bg-green-100 text-green-700' :
                              exec.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            {exec.status.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{exec.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold text-gray-900">{exec.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Records Processed</p>
                          <p className="font-semibold text-gray-900">{exec.recordsProcessed.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Alerts Generated</p>
                          <p className="font-semibold text-gray-900">{exec.alertsGenerated}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && pendingAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-900">Approval Required</h2>
            </div>
            <p className="text-gray-700 mb-6">
              You are about to <span className="font-semibold">{pendingAction.action}</span> the workflow:{' '}
              <span className="font-semibold">{flows.find(f => f.id === pendingAction.id)?.name}</span>.
              This action requires approval and will be logged in the audit trail.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowApprovalModal(false); setPendingAction(null); }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={approveAction}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Approve & {pendingAction.action === 'activate' ? 'Activate' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        <span>Workflow changes are now persisted and require approval. All actions are logged for audit compliance.</span>
      </div>
    </div>
  );
}
