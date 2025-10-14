"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { 
  Brain, TrendingUp, AlertTriangle, Shield, Lightbulb, 
  TrendingDown, DollarSign, PieChart as PieChartIcon, BarChart3, 
  Target, Zap, FileText, Download, 
  Activity, Sparkles, CheckCircle, XCircle,
  Info, Banknote, Wallet
} from "lucide-react";

// AI-Enhanced Islamic Treasury Data
interface AIInsight {
    category: string;
    insight: string;
    confidence: number;
    impact: 'high' | 'medium' | 'low';
    action?: string;
}

interface PredictiveMetric {
    name: string;
    current: number;
    predicted: number;
    confidence: number;
    trend: 'up' | 'down' | 'stable';
}

interface ChartDataPoint {
    name: string;
    value: number;
}

interface PieDataPoint {
    name: string;
    value: number;
    percentage: number;
    color: string;
}

// AI Treasury Insights
const aiTreasuryInsights: AIInsight[] = [
    {
        category: 'Liquidity Optimization',
        insight: 'AI algorithms predict 15% improvement in cash flow efficiency by optimizing Sukuk maturity profiles.',
        confidence: 94,
        impact: 'high',
        action: 'Restructure 30% of short-term Sukuk holdings to 6-month instruments'
    },
    {
        category: 'Shariah Compliance Risk',
        insight: 'ML models detect potential compliance issues in 2% of Murabaha contracts due to pricing anomalies.',
        confidence: 87,
        impact: 'medium',
        action: 'Review pricing mechanisms for 45 Murabaha contracts flagged by AI'
    },
    {
        category: 'Profit Optimization',
        insight: 'Portfolio rebalancing could increase annual returns by ₦2.3B through strategic Musharakah investments.',
        confidence: 91,
        impact: 'high',
        action: 'Increase Musharakah allocation from 13% to 18% of total portfolio'
    },
    {
        category: 'Risk Mitigation',
        insight: 'Predictive models show 23% reduction in market risk exposure through diversified Ijara leasing.',
        confidence: 89,
        impact: 'medium',
        action: 'Expand Ijara portfolio in renewable energy and healthcare sectors'
    }
];

// Predictive Treasury Metrics
const predictiveMetrics: PredictiveMetric[] = [
    {
        name: 'Liquidity Ratio',
        current: 125.8,
        predicted: 142.3,
        confidence: 94,
        trend: 'up'
    },
    {
        name: 'Profit Margin',
        current: 12.8,
        predicted: 15.1,
        confidence: 87,
        trend: 'up'
    },
    {
        name: 'Risk Exposure',
        current: 8.2,
        predicted: 6.8,
        confidence: 91,
        trend: 'down'
    },
    {
        name: 'Asset Utilization',
        current: 89.5,
        predicted: 94.2,
        confidence: 88,
        trend: 'up'
    }
];

// AI-Generated Optimization Opportunities
const optimizationData: ChartDataPoint[] = [
    { name: 'Sukuk', value: 15.3 },
    { name: 'Murabaha', value: 12.8 },
    { name: 'Ijara', value: 18.7 },
    { name: 'Musharakah', value: 22.1 }
];

// Risk Prediction Data
const riskPredictionData: ChartDataPoint[] = [
    { name: 'Credit', value: 6.8 },
    { name: 'Market', value: 4.2 },
    { name: 'Operational', value: 5.1 },
    { name: 'Shariah', value: 1.8 }
];

// AI Performance Tracking
const aiPerformanceData: PieDataPoint[] = [
    { name: 'Successful Predictions', value: 94, percentage: 94, color: '#16a34a' },
    { name: 'Pending Validation', value: 4, percentage: 4, color: '#eab308' },
    { name: 'Incorrect Predictions', value: 2, percentage: 2, color: '#dc2626' }
];

export default function AITreasuryInsightPage() {
    const [selectedInsight, setSelectedInsight] = useState<string>('all');

    const formatCurrency = (value: number): string => {
        if (value >= 1000000000) {
            return `₦${(value / 1000000000).toFixed(1)}B`;
        }
        return `₦${(value / 1000000).toFixed(1)}M`;
    };

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const TrendBadge = ({ trend, value }: { trend: 'up' | 'down' | 'stable'; value: number }) => (
        <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' :
                trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
            {trend === 'up' ? <ArrowUp className="w-4 h-4" /> :
                trend === 'down' ? <ArrowDown className="w-4 h-4" /> :
                    <Target className="w-4 h-4" />}
            <span className="text-sm font-bold">{Math.abs(value)}%</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Enhanced Header */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                                <Brain className="w-10 h-10 text-blue-700" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">AI Treasury Intelligence</h1>
                                <p className="text-xl text-gray-600">Advanced Islamic Banking Treasury Analytics & Predictions</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                                <Zap className="w-4 h-4 text-blue-700" />
                                <span className="text-sm font-medium text-blue-700">Real-time AI Analysis</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                                <CheckCircle className="w-4 h-4 text-green-700" />
                                <span className="text-sm font-medium text-green-700">94% Accuracy</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
                                <Target className="w-4 h-4 text-purple-700" />
                                <span className="text-sm font-medium text-purple-700">Predictive Models</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">AI Model Version</div>
                        <div className="text-lg font-semibold text-gray-900">v3.2.1</div>
                        <div className="text-sm text-gray-600">Updated: {new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            {/* AI Insights Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {aiTreasuryInsights.map((insight, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                                    <Lightbulb className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{insight.category}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-600">Confidence:</span>
                                        <span className="font-semibold text-blue-600">{insight.confidence}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getImpactColor(insight.impact)}`}>
                                {insight.impact.toUpperCase()}
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{insight.insight}</p>
                        {insight.action && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-blue-900">Recommended Action</span>
                                </div>
                                <p className="text-sm text-blue-800">{insight.action}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Predictive Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Predictive Metrics */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Predictive Treasury Metrics</h3>
                            <p className="text-gray-600">AI-generated forecasts for next quarter</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {predictiveMetrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <div className="font-semibold text-gray-900">{metric.name}</div>
                                    <div className="text-sm text-gray-600">Confidence: {metric.confidence}%</div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="text-sm text-gray-500">Current</div>
                                            <div className="font-bold text-gray-900">{metric.current}%</div>
                                        </div>
                                        <ArrowUp className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <div className="text-sm text-gray-500">Predicted</div>
                                            <div className="font-bold text-blue-600">{metric.predicted}%</div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <TrendBadge trend={metric.trend} value={Math.abs(metric.predicted - metric.current)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Performance Tracking */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">AI Model Performance</h3>
                            <p className="text-gray-600">Prediction accuracy tracking</p>
                        </div>
                    </div>
                    <div className="h-80">
                        <ProfessionalPieChart data={aiPerformanceData} />
                    </div>
                </div>
            </div>

            {/* Optimization & Risk Prediction Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Optimization Opportunities */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <BarChart2 className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">AI Optimization Opportunities</h3>
                            <p className="text-gray-600">Potential improvement by instrument type</p>
                        </div>
                    </div>
                    <div className="h-80">
                        <ProfessionalChart
                            data={optimizationData}
                            barColor="#EAB308"
                        />
                    </div>
                </div>

                {/* Risk Prediction */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Predicted Risk Levels</h3>
                            <p className="text-gray-600">AI-forecasted risk exposure by category</p>
                        </div>
                    </div>
                    <div className="h-80">
                        <ProfessionalChart
                            data={riskPredictionData}
                            barColor="#DC2626"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
