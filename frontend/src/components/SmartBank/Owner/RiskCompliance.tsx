'use client';

import { Shield, AlertTriangle, Activity, Eye, Brain, AlertCircle } from 'lucide-react';

export default function RiskCompliance() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-blue-600 rounded-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Risk & Compliance</h1>
            <p className="text-gray-600">Exposure Oversight & Shariah Compliance</p>
          </div>
        </div>

        {/* Coming Soon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Credit Risk */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-gray-900">Credit Risk Index</h3>
            </div>
            <p className="text-gray-600 text-sm">Real-time credit exposure monitoring</p>
          </div>

          {/* Market Risk */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-orange-500" />
              <h3 className="font-bold text-gray-900">Market Risk Index</h3>
            </div>
            <p className="text-gray-600 text-sm">Market volatility and exposure tracking</p>
          </div>

          {/* Operational Risk */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <h3 className="font-bold text-gray-900">Operational Risk</h3>
            </div>
            <p className="text-gray-600 text-sm">Process and system risk assessment</p>
          </div>

          {/* NPF Ratio */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-gray-900">NPF Ratio</h3>
            </div>
            <p className="text-gray-600 text-sm">Non-Performing Financing trends</p>
          </div>

          {/* Shariah Breach Monitor */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-gray-900">Shariah Monitor</h3>
            </div>
            <p className="text-gray-600 text-sm">Compliance tracking and breach detection</p>
          </div>

          {/* AI Early Warning */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">AI Early Warning</h3>
            </div>
            <p className="text-gray-600 text-sm">Predictive alerts and risk forecasting</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Risk & Compliance Dashboard</h4>
              <p className="text-amber-700 text-sm mb-3">
                This tab oversees every exposure and Shariah compliance standing. A single breach can destroy reputation and license.
              </p>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li>• <strong>Credit, Market & Operational Risk Index</strong> - Comprehensive risk monitoring</li>
                <li>• <strong>Non-Performing Financing (NPF %)</strong> - Default tracking and trends</li>
                <li>• <strong>Shariah Breach Monitor</strong> - Real-time compliance scoring and alerts</li>
                <li>• <strong>Cybersecurity Pulse</strong> - Digital security threat monitoring</li>
                <li>• <strong>AI Early-Warning Alerts</strong> - "Liquidity stress probability 12% next quarter"</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-amber-900 text-sm font-medium">
                  💡 <strong>Unique Feature:</strong> Blends financial metrics + faith metrics — where ethics meets control
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
