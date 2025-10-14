'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import ComplianceOverview from '@/components/SmartBank/Compliance/ComplianceOverview';
import ShariahCompliance from '@/components/SmartBank/Compliance/ShariahCompliance';
import ComplianceWorkflows from '@/components/SmartBank/Compliance/ComplianceWorkflows';

// Placeholders for new tabs
function GovernanceBoard() {
  return <ComplianceOverview />;
}
function ShariahAuditReview() {
  return <ShariahCompliance />;
}
function KYCAMLRegulatory() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">KYC/AML & Regulatory</h2>
      <p className="text-gray-700 mb-4">KYC queue, AML monitoring, CBN reporting, suspicious activity logs, and regulatory returns will be shown here.</p>
      <div className="text-gray-400">(Coming soon)</div>
    </div>
  );
}
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import { Scale, FileText } from 'lucide-react';
function ZakatSocial() {
  // Demo KPIs
  const kpis = [
    { label: 'Zakat Collected (₦)', value: 125000000, color: 'bg-green-100', text: 'text-green-700' },
    { label: 'Zakat Distributed (₦)', value: 98000000, color: 'bg-blue-100', text: 'text-blue-700' },
    { label: 'Pending Distribution (₦)', value: 27000000, color: 'bg-yellow-100', text: 'text-yellow-700' },
    { label: 'Social Projects', value: 12, color: 'bg-amber-100', text: 'text-amber-700' },
  ];

  // Demo chart data
  const distributionData = [
    { name: 'Education', value: 35 },
    { name: 'Healthcare', value: 25 },
    { name: 'Poverty Relief', value: 20 },
    { name: 'Community Dev.', value: 12 },
    { name: 'Other', value: 8 },
  ];

  // Demo table data
  const projects = [
    { name: 'School Renovation', type: 'Education', amount: 12000000, status: 'Completed', date: '2025-08-10' },
    { name: 'Medical Outreach', type: 'Healthcare', amount: 8000000, status: 'Ongoing', date: '2025-09-15' },
    { name: 'Food Drive', type: 'Poverty Relief', amount: 5000000, status: 'Completed', date: '2025-07-20' },
    { name: 'Clean Water Project', type: 'Community Dev.', amount: 7000000, status: 'Ongoing', date: '2025-09-28' },
  ];

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <Scale className="w-7 h-7 text-green-700" />
        <h2 className="text-2xl font-bold text-gray-900">Zakat & Social Responsibility</h2>
      </div>
      <p className="text-gray-700 mb-6 max-w-2xl">Overview of Zakat collection, distribution, and social finance initiatives.</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((k, i) => (
          <div key={i} className={`rounded-xl p-6 ${k.color} border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{k.label}</p>
                <p className={`text-2xl font-bold ${k.text}`}>{typeof k.value === 'number' ? formatCurrency(k.value) : k.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zakat Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Zakat Distribution by Category</h3>
          <span className="text-xs text-gray-500">Demo data</span>
        </div>
        <ProfessionalChart data={distributionData} barColor="#22c55e" />
      </div>

      {/* Social Projects Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-green-700" />
          <h3 className="text-lg font-bold text-gray-900">Recent Social Finance Projects</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-green-50 text-green-900">
                <th className="px-4 py-2 text-left font-semibold">Project</th>
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-left font-semibold">Amount</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-2 text-gray-700">{p.type}</td>
                  <td className="px-4 py-2 text-gray-700">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-2 text-gray-700">{p.status}</td>
                  <td className="px-4 py-2 text-gray-700">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function ComplianceReports() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Compliance Reports</h2>
      <p className="text-gray-700 mb-4">Downloadable reports, audit logs, and regulatory submissions will be shown here.</p>
      <div className="text-gray-400">(Coming soon)</div>
    </div>
  );
}

function ComplianceDashboardInner() {
  const searchParams = useSearchParams();

  // New tab structure
  const [activeTab, setActiveTab] = useState<
    'governance' | 'audit' | 'kyc' | 'zakat' | 'workflows' | 'reports'
  >('governance');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'audit' || tab === 'kyc' || tab === 'zakat' || tab === 'workflows' || tab === 'reports') setActiveTab(tab);
    else setActiveTab('governance');
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-amber-50 lg:flex">
      <Sidebar role="compliance" userName="Head of Compliance" userEmail="compliance@SmartBank.ng" />
      <div className="flex-1 lg:ml-0">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Compliance</h1>
                  <p className="text-sm text-gray-600 mt-1">Regulatory & Shariah Oversight</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-600">Today</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'governance' && <GovernanceBoard />}
          {activeTab === 'audit' && <ShariahAuditReview />}
          {activeTab === 'kyc' && <KYCAMLRegulatory />}
          {activeTab === 'zakat' && <ZakatSocial />}
          {activeTab === 'workflows' && <ComplianceWorkflows />}
          {activeTab === 'reports' && <ComplianceReports />}
        </div>
      </div>
    </div>
  );
}

export default function ComplianceDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-amber-50" />}>
      <ComplianceDashboardInner />
    </Suspense>
  );
}
