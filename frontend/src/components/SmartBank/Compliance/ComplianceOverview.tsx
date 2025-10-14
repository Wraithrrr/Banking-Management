'use client';

import { useMemo } from 'react';
import { Shield, FileCheck, Scale, Activity, FileText } from 'lucide-react';
import ProfessionalChart from '@/components/ui/ProfessionalChart';

export default function ComplianceOverview() {
  // Demo KPI and chart data
  const kpis = useMemo(() => ([
    { label: 'KYC Pending', value: 342, icon: FileCheck },
    { label: 'Reg. Reports (This Month)', value: 12, icon: Scale },
    { label: 'Shariah Reviews', value: 18, icon: Shield },
    { label: 'Open Issues', value: 5, icon: Activity },
  ]), []);

  const postureData = useMemo(() => ([
    { name: 'Policy Coverage', value: 92 },
    { name: 'Control Effectiveness', value: 88 },
    { name: 'Audit Readiness', value: 81 },
    { name: 'Training Completion', value: 95 },
    { name: 'Issue Remediation', value: 76 },
  ]), []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="w-7 h-7 text-blue-700" />
        <h2 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h2>
      </div>
      <p className="text-gray-700 mb-6 max-w-2xl">Key compliance metrics and posture for regulatory and Shariah operations.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k, i) => {
          const Icon = k.icon as any;
          return (
            <div key={i} className="rounded-xl p-6 bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{k.label}</p>
                  <p className="text-2xl font-bold text-amber-700">{k.value}</p>
                </div>
                <Icon className="w-7 h-7 text-amber-700" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Posture Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Compliance Posture</h3>
          <span className="text-xs text-gray-500">Demo data — integrates with Recharts</span>
        </div>
        <ProfessionalChart data={postureData} barColor="#b45309" />
      </div>
    </div>
  );
}
