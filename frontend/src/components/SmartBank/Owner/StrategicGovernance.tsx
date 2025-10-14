'use client';

import { Users, Target, Heart, TrendingUp, Award, Globe } from 'lucide-react';

export default function StrategicGovernance() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-gray-600 to-blue-600 rounded-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic Governance</h1>
            <p className="text-gray-600">People, Performance & Purpose</p>
          </div>
        </div>

        {/* Coming Soon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Department Performance */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-500" />
              <h3 className="font-bold text-gray-900">Department Index</h3>
            </div>
            <p className="text-gray-600 text-sm">Performance tracking by department</p>
          </div>

          {/* Staff Productivity */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <h3 className="font-bold text-gray-900">Staff Productivity</h3>
            </div>
            <p className="text-gray-600 text-sm">Revenue and cost per employee metrics</p>
          </div>

          {/* CSR / Zakat */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-gray-900">CSR / Zakat Impact</h3>
            </div>
            <p className="text-gray-600 text-sm">Social responsibility and Zakat distribution</p>
          </div>

          {/* Board Decisions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-indigo-500" />
              <h3 className="font-bold text-gray-900">Board Decisions</h3>
            </div>
            <p className="text-gray-600 text-sm">KPI tracking and strategic goals</p>
          </div>

          {/* Sustainability */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6 text-teal-500" />
              <h3 className="font-bold text-gray-900">ESG Overview</h3>
            </div>
            <p className="text-gray-600 text-sm">Environmental, Social & Governance metrics</p>
          </div>

          {/* Values Dashboard */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 shadow-lg border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="font-bold text-gray-900">Culture & Values</h3>
            </div>
            <p className="text-gray-600 text-sm">Leadership oversight and cultural alignment</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-purple-900 mb-2">Strategic Governance Dashboard</h4>
              <p className="text-purple-700 text-sm mb-3">
                Tracks people, performance, and purpose. Ensures the bank's culture and direction stay on course.
              </p>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• <strong>Department Performance Index</strong> - Real-time performance by department</li>
                <li>• <strong>Staff Productivity & Cost Ratio</strong> - Revenue and cost efficiency per employee</li>
                <li>• <strong>CSR / Zakat Impact Dashboard</strong> - Community impact and social responsibility</li>
                <li>• <strong>Board Decisions & KPIs</strong> - Strategic goal tracking and resolutions</li>
                <li>• <strong>Sustainability & ESG Overview</strong> - Environmental, Social, Governance scores</li>
              </ul>
              <div className="mt-4 p-3 bg-purple-100 rounded-lg">
                <p className="text-purple-900 text-sm font-medium">
                  💡 <strong>Purpose:</strong> Ends the dashboard on values — profits, ethics, and people in one frame
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
