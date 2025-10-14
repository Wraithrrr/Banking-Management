'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import RiskOverview from '@/components/SmartBank/RiskManagement/RiskOverview';
import RiskAlertsFeed from '@/components/SmartBank/RiskManagement/RiskAlertsFeed';
import RiskWorkflows from '@/components/SmartBank/RiskManagement/RiskWorkflows';
import RiskAIInsightPage from '@/components/SmartBank/RiskManagement/RiskAIInsightPage';
import CreditFinancingRisk from '@/components/SmartBank/RiskManagement/CreditFinancingRisk';
import MarketLiquidityRisk from '@/components/SmartBank/RiskManagement/MarketLiquidityRisk';
import ShariahComplianceRisk from '@/components/SmartBank/RiskManagement/ShariahComplianceRisk';

function RiskManagementDashboardInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'credit' | 'liquidity' | 'shariah' | 'ai-intelligence' | 'alerts' | 'workflows' | 'ai-insight'>('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'credit' || tab === 'liquidity' || tab === 'shariah' || tab === 'ai-intelligence' || tab === 'alerts' || tab === 'workflows' || tab === 'ai-insight') {
      setActiveTab(tab as any);
    } else {
      setActiveTab('overview');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar role="risk-management" userName="Chief Risk Officer" userEmail="risk@SmartBank.ng" />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Risk Management</h1>
                  <p className="text-sm text-gray-600 mt-1">Fraud, Credit Risk & Enterprise Risk</p>
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
          {activeTab === 'overview' && <RiskOverview />}
          {activeTab === 'credit' && <CreditFinancingRisk />}
          {activeTab === 'liquidity' && <MarketLiquidityRisk />}
          {activeTab === 'shariah' && <ShariahComplianceRisk />}
          {(activeTab === 'ai-intelligence' || activeTab === 'ai-insight') && <RiskAIInsightPage />}
          {activeTab === 'alerts' && <RiskAlertsFeed />}
          {activeTab === 'workflows' && <RiskWorkflows />}
        </div>
      </div>
    </div>
  );
}

export default function RiskManagementDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <RiskManagementDashboardInner />
    </Suspense>
  );
}
