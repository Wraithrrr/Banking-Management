'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import BusinessDevOverview from '@/components/SmartBank/BusinessDevelopment/BusinessDevOverview';
import LeadManagement from '@/components/SmartBank/BusinessDevelopment/LeadManagement';
import AgentNetwork from '@/components/SmartBank/BusinessDevelopment/AgentNetwork';
import BusinessWorkflows from '@/components/SmartBank/BusinessDevelopment/BusinessWorkflows';

function BusinessDevelopmentDashboardInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'agents' | 'workflows'>('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'leads' || tab === 'agents' || tab === 'workflows') {
      setActiveTab(tab);
    } else {
      setActiveTab('overview');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar role="business-development" userName="Business Dev Manager" userEmail="bizdev@SmartBank.ng" />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Business Development</h1>
                  <p className="text-sm text-gray-600 mt-1">Financial Inclusion & Growth</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'overview' && <BusinessDevOverview />}
          {activeTab === 'leads' && <LeadManagement />}
          {activeTab === 'agents' && <AgentNetwork />}
          {activeTab === 'workflows' && <BusinessWorkflows />}
        </div>
      </div>
    </div>
  );
}

export default function BusinessDevelopmentDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <BusinessDevelopmentDashboardInner />
    </Suspense>
  );
}
