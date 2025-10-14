'use client';

import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, FileText } from 'lucide-react';

export default function ShariahComplianceRisk() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shariah Compliance Risk</h2>
          <p className="text-gray-600">Ensuring Halal Transactions & Ethical Banking</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance Score */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h3 className="font-bold text-gray-900">Compliance Score</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">98.7%</p>
          <p className="text-sm text-green-600 mt-2">↑ 0.2% improvement</p>
        </div>

        {/* Active Issues */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <h3 className="font-bold text-gray-900">Minor Issues</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-600 mt-2">Pending review</p>
        </div>

        {/* Non-Compliant Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6 text-red-500" />
            <h3 className="font-bold text-gray-900">Flagged Txns</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">12</p>
          <p className="text-sm text-gray-600 mt-2">This month</p>
        </div>

        {/* Last Audit */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-500" />
            <h3 className="font-bold text-gray-900">Last Audit</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">14</p>
          <p className="text-sm text-gray-600 mt-2">Days ago</p>
        </div>
      </div>

      {/* Recent Non-Compliant Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Non-Compliant Transactions Log</h3>
        <div className="space-y-3">
          {[
            { id: 'TXN-8821', type: 'Interest-bearing component', severity: 'high', date: '2 days ago', status: 'Under Review' },
            { id: 'TXN-8765', type: 'Gharar (excessive uncertainty)', severity: 'medium', date: '5 days ago', status: 'Resolved' },
            { id: 'TXN-8701', type: 'Non-Halal industry exposure', severity: 'high', date: '8 days ago', status: 'Under Review' },
            { id: 'TXN-8654', type: 'Maysir (gambling element)', severity: 'low', date: '12 days ago', status: 'Resolved' },
          ].map((txn) => (
            <div key={txn.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <AlertTriangle className={`w-5 h-5 ${txn.severity === 'high' ? 'text-red-500' : txn.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                <div>
                  <p className="font-bold text-gray-900">{txn.id}</p>
                  <p className="text-sm text-gray-600">{txn.type}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${txn.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {txn.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">{txn.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Heatmap by Department */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Compliance Heatmap by Department</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { dept: 'Treasury', score: 99.2, status: 'excellent' },
            { dept: 'Business Development', score: 98.5, status: 'excellent' },
            { dept: 'Risk Management', score: 99.8, status: 'excellent' },
            { dept: 'Compliance', score: 100, status: 'excellent' },
            { dept: 'IT Security', score: 97.1, status: 'good' },
            { dept: 'Customer Service', score: 96.8, status: 'good' },
          ].map((dept) => (
            <div key={dept.dept} className={`p-4 rounded-lg border-2 ${dept.status === 'excellent' ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">{dept.dept}</h4>
                <Shield className={`w-5 h-5 ${dept.status === 'excellent' ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${dept.status === 'excellent' ? 'text-green-600' : 'text-blue-600'}`}>{dept.score}%</p>
              <p className="text-xs text-gray-600 mt-1 uppercase font-semibold">{dept.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Breach Detector */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">AI Breach Detector</h3>
          <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">ACTIVE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Transactions Scanned</p>
            <p className="text-2xl font-bold text-gray-900">24,567</p>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Patterns Detected</p>
            <p className="text-2xl font-bold text-yellow-600">8</p>
            <p className="text-xs text-gray-500 mt-1">Potential risks</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Model Accuracy</p>
            <p className="text-2xl font-bold text-green-600">96.4%</p>
            <p className="text-xs text-gray-500 mt-1">Detection rate</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Shariah Compliance Risk Dashboard</h4>
            <p className="text-amber-700 text-sm mb-3">
              Guards the soul of the bank — ensuring every transaction, portfolio, and product is Halal and ethical. A breach here isn't just financial — it's reputational and spiritual.
            </p>
            <ul className="space-y-2 text-amber-700 text-sm">
              <li>• <strong>Non-Compliant Transactions Log</strong> - Real-time flagging system</li>
              <li>• <strong>Shariah Audit Dashboard</strong> - Continuous monitoring and scoring</li>
              <li>• <strong>AI Breach Detector</strong> - Pattern recognition for early detection</li>
              <li>• <strong>Compliance Heatmap</strong> - Department and product-level tracking</li>
              <li>• <strong>Reputational Risk Tracking</strong> - Brand impact assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
