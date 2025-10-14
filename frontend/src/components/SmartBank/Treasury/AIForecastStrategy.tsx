'use client';

import { Brain, TrendingUp, Lightbulb, Target, AlertTriangle, CheckCircle, Zap, BarChart3, Shield, DollarSign, Clock } from 'lucide-react';
import { useState } from 'react';
import ProfessionalLineChart from '@/components/ui/ProfessionalLineChart';

export default function AIForecastStrategy() {
  const [simulator, setSimulator] = useState({
    sukukYield: 0,
    liquidityChange: 0,
    fxRate: 0,
  });

  const [simulationResult, setSimulationResult] = useState<any>(null);

  // 3-Month Profit Projection
  const profitProjectionData = [
    { name: 'Oct 2025', value: 14.2 },
    { name: 'Nov 2025', value: 14.8 },
    { name: 'Dec 2025', value: 15.5 },
  ];

  // AI Recommendations
  const aiRecommendations = [
    {
      id: 1,
      title: 'Rebalance Sukuk Portfolio',
      description: 'Shift 5% of government Sukuk into short-term Murabaha contracts for improved liquidity and stable returns.',
      impact: '₦2.3B additional profit',
      confidence: 92,
      priority: 'High',
      timeline: '7 days',
      color: 'blue',
    },
    {
      id: 2,
      title: 'Hedge USD Exposure',
      description: 'Execute FX forward contracts to reduce USD exposure from 42% to 38%, mitigating currency risk.',
      impact: 'Risk reduction: 18%',
      confidence: 88,
      priority: 'High',
      timeline: '3 days',
      color: 'amber',
    },
    {
      id: 3,
      title: 'Increase Corporate Sukuk Allocation',
      description: 'Corporate Sukuk offer 1.5% higher yields than government Sukuk. Reallocate 8% for better ROI.',
      impact: '₦1.8B incremental profit',
      confidence: 85,
      priority: 'Medium',
      timeline: '14 days',
      color: 'green',
    },
    {
      id: 4,
      title: 'Diversify Commodity Portfolio',
      description: 'Gold concentration at 74% is high. Shift 10% into silver and agricultural commodities for diversification.',
      impact: 'Risk reduction: 12%',
      confidence: 79,
      priority: 'Medium',
      timeline: '21 days',
      color: 'purple',
    },
    {
      id: 5,
      title: 'Lock in FX Gains',
      description: 'Current USD appreciation has generated ₦18.7B gains. Consider partial repatriation before potential reversal.',
      impact: 'Secure ₦12.5B profit',
      confidence: 76,
      priority: 'Low',
      timeline: '10 days',
      color: 'cyan',
    },
  ];

  const runSimulation = () => {
    // Simple simulation logic
    const baseProfit = 14.2; // Current month projection in billions
    const yieldImpact = (simulator.sukukYield / 100) * 8.5; // 8.5B sensitivity
    const liquidityImpact = (simulator.liquidityChange / 100) * 2.3;
    const fxImpact = (simulator.fxRate / 100) * 6.2;

    const newProfit = baseProfit + yieldImpact + liquidityImpact + fxImpact;
    const percentChange = ((newProfit - baseProfit) / baseProfit) * 100;

    setSimulationResult({
      newProfit: newProfit.toFixed(2),
      percentChange: percentChange.toFixed(1),
      breakdown: {
        yield: yieldImpact.toFixed(2),
        liquidity: liquidityImpact.toFixed(2),
        fx: fxImpact.toFixed(2),
      },
    });
  };

  const resetSimulation = () => {
    setSimulator({ sukukYield: 0, liquidityChange: 0, fxRate: 0 });
    setSimulationResult(null);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            AI Forecast & Strategy
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Turn treasury data into foresight — predict returns, liquidity, and investment timing</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-semibold">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            AI Powered
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-indigo-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="flex items-start gap-2 sm:gap-3">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-1">🧠 AI Strategic Insight (Confidence: 94%)</h3>
            <p className="text-blue-800 text-xs sm:text-sm">
              Based on 18 months of historical data and current market trends, our AI model recommends <strong>rebalancing 5% of Sukuk into short-term Murabaha</strong> for enhanced stability.
              This strategy could generate an additional <strong>₦2.3B profit</strong> over the next quarter while maintaining Shariah compliance.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                View Full Analysis
              </button>
              <button className="px-3 py-1 bg-white text-blue-700 text-xs rounded-md border border-blue-300 hover:bg-blue-50">
                Export Strategy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Month Profit Projection */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">3-Month Profit Projection</h2>
            <p className="text-xs sm:text-sm text-gray-600">AI-powered forecast based on current portfolio and market conditions</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-xs sm:text-sm text-gray-500">Q4 2025 Forecast</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">₦44.5B</div>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <ProfessionalLineChart
            data={profitProjectionData}
            lineColor="#3B82F6"
            areaFill={true}
            showDots={true}
            strokeWidth={3}
            showGrid={true}
            yAxisLabel="Profit (₦B)"
            minValue={12}
            maxValue={17}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs sm:text-sm text-blue-600 font-medium">October 2025</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">₦14.2B</div>
            <div className="text-xs text-blue-600 mt-1">Confidence: 96%</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs sm:text-sm text-blue-600 font-medium">November 2025</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">₦14.8B</div>
            <div className="text-xs text-blue-600 mt-1">Confidence: 89%</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-xs sm:text-sm text-blue-600 font-medium">December 2025</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">₦15.5B</div>
            <div className="text-xs text-blue-600 mt-1">Confidence: 82%</div>
          </div>
        </div>
      </div>

      {/* Liquidity Stress Simulator */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Liquidity Stress Simulator</h2>
            <p className="text-xs sm:text-sm text-gray-600">What-if analysis: See how market changes impact your portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
          {/* Sukuk Yield Change */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Sukuk Yield Change
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={simulator.sukukYield}
                onChange={(e) => setSimulator({ ...simulator, sukukYield: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-lg font-bold text-gray-900 min-w-[60px]">
                {simulator.sukukYield > 0 ? '+' : ''}{simulator.sukukYield}%
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Range: -3% to +3%</div>
          </div>

          {/* Liquidity Change */}
          <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Liquidity Position Change
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={simulator.liquidityChange}
                onChange={(e) => setSimulator({ ...simulator, liquidityChange: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-lg font-bold text-gray-900 min-w-[60px]">
                {simulator.liquidityChange > 0 ? '+' : ''}{simulator.liquidityChange}%
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Range: -10% to +10%</div>
          </div>

          {/* FX Rate Change */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              USD/NGN FX Rate Change
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={simulator.fxRate}
                onChange={(e) => setSimulator({ ...simulator, fxRate: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-lg font-bold text-gray-900 min-w-[60px]">
                {simulator.fxRate > 0 ? '+' : ''}{simulator.fxRate}%
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Range: -5% to +5%</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <button
            onClick={runSimulation}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            Run Simulation
          </button>
          <button
            onClick={resetSimulation}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 text-sm sm:text-base font-semibold rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>
        </div>

        {simulationResult && (
          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <h3 className="font-bold text-blue-900 text-base sm:text-lg">Simulation Results</h3>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-blue-700">Projected Monthly Profit</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">₦{simulationResult.newProfit}B</div>
                <div className={`text-xs sm:text-sm font-semibold ${parseFloat(simulationResult.percentChange) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {simulationResult.percentChange > 0 ? '+' : ''}{simulationResult.percentChange}% vs baseline
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg">
                <div className="text-xs text-blue-600 font-medium">Yield Impact</div>
                <div className={`text-base sm:text-lg font-bold ${parseFloat(simulationResult.breakdown.yield) >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                  {simulationResult.breakdown.yield > 0 ? '+' : ''}₦{simulationResult.breakdown.yield}B
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-xs text-cyan-600 font-medium">Liquidity Impact</div>
                <div className={`text-base sm:text-lg font-bold ${parseFloat(simulationResult.breakdown.liquidity) >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                  {simulationResult.breakdown.liquidity > 0 ? '+' : ''}₦{simulationResult.breakdown.liquidity}B
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="text-xs text-indigo-600 font-medium">FX Impact</div>
                <div className={`text-base sm:text-lg font-bold ${parseFloat(simulationResult.breakdown.fx) >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                  {simulationResult.breakdown.fx > 0 ? '+' : ''}₦{simulationResult.breakdown.fx}B
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Recommendations (Ranked by ROI + Confidence)</h2>
            <p className="text-xs sm:text-sm text-gray-600">Strategic insights powered by machine learning algorithms</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-blue-700 w-full sm:w-auto">
            Export All
          </button>
        </div>

        <div className="space-y-3">
          {aiRecommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border-l-4 bg-gradient-to-r from-${rec.color}-50 to-white border-${rec.color}-500`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded bg-${rec.color}-200 text-${rec.color}-900`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rec.timeline}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{rec.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Impact:</span>{' '}
                      <span className="font-semibold text-green-700">{rec.impact}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-600">Confidence</div>
                  <div className="text-3xl font-bold text-purple-900">{rec.confidence}%</div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${rec.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className={`px-3 py-1 bg-${rec.color}-600 text-white text-xs rounded-md hover:bg-${rec.color}-700`}>
                  Implement Strategy
                </button>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">
                  View Details
                </button>
                <button className="px-3 py-1 bg-white text-gray-700 text-xs rounded-md border border-gray-300 hover:bg-gray-50">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Confidence Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Model Accuracy</div>
              <div className="text-2xl font-bold text-gray-900">94.2%</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">Based on 18 months of validated predictions</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-cyan-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Data Points Analyzed</div>
              <div className="text-2xl font-bold text-gray-900">1.2M+</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">Historical transactions and market data</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">AI Model Version</div>
              <div className="text-2xl font-bold text-gray-900">v4.8</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">Last updated: Oct 1, 2025</div>
        </div>
      </div>
    </div>
  );
}
