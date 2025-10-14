'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/SmartBank/Sidebar';
import TreasuryOverview from '@/components/SmartBank/Treasury/TreasuryOverview';
import LiquidityCashflow from '@/components/SmartBank/Treasury/LiquidityCashflow';
import InvestmentsSukuk from '@/components/SmartBank/Treasury/InvestmentsSukuk';
import ForexMarketPosition from '@/components/SmartBank/Treasury/ForexMarketPosition';
import AIForecastStrategy from '@/components/SmartBank/Treasury/AIForecastStrategy';

function TreasuryDashboardInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'liquidity' | 'investments' | 'forex' | 'ai-forecast'>('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'liquidity' || tab === 'investments' || tab === 'forex' || tab === 'ai-forecast') {
      setActiveTab(tab);
    } else {
      setActiveTab('overview');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar role="treasury" userName="Treasury Manager" userEmail="treasury@SmartBank.ng" />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Treasury Department</h1>
                  <p className="text-sm text-gray-600 mt-1">Shariah-Compliant Asset Management</p>
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
          {activeTab === 'overview' && <TreasuryOverview />}
          {activeTab === 'liquidity' && <LiquidityCashflow />}
          {activeTab === 'investments' && <InvestmentsSukuk />}
          {activeTab === 'forex' && <ForexMarketPosition />}
          {activeTab === 'ai-forecast' && <AIForecastStrategy />}
        </div>
      </div>
    </div>
  );
}

export default function TreasuryDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <TreasuryDashboardInner />
    </Suspense>
  );
}
