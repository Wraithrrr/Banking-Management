"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import {
    Brain, TrendingUp, AlertTriangle, Shield, Lightbulb,
    DollarSign, BarChart3, Target, Zap, FileText, Download,
    Activity, Sparkles, CheckCircle, XCircle, Info, Lock, Eye, Calendar
} from "lucide-react";

// AI Insight Summary
const aiInsight = "Our AI models predict a 35% reduction in fraud incidents over the next 3 months, with enhanced pattern detection showing 92% accuracy. Credit risk is stabilizing across all segments, particularly in SME where PD is expected to decrease by 0.4% by year-end.";

// Fraud Detection Trends
const fraudTrends = [
    { month: "Jan", detected: 18, prevented: 16 },
    { month: "Feb", detected: 16, prevented: 15 },
    { month: "Mar", detected: 15, prevented: 14 },
    { month: "Apr", detected: 14, prevented: 13 },
    { month: "May", detected: 13, prevented: 12 },
    { month: "Jun", detected: 12, prevented: 11 },
    { month: "Jul", detected: 12, prevented: 11 },
    { month: "Aug", detected: 10, prevented: 9 },
    { month: "Sep", detected: 9, prevented: 8 },
    { month: "Oct", detected: 8, prevented: 7 },
];

// Credit PD by Segment
const creditPD = [
    { segment: "Retail", pd: 2.4 },
    { segment: "SME", pd: 3.1 },
    { segment: "Corporate", pd: 1.0 },
    { segment: "Microfinance", pd: 4.2 },
];

// Risk Distribution
const riskDistribution = [
    { type: "Credit Risk", value: 45, color: "#2563eb" },
    { type: "Market Risk", value: 25, color: "#f59e0b" },
    { type: "Operational Risk", value: 20, color: "#10b981" },
    { type: "Liquidity Risk", value: 10, color: "#6366f1" },
];

// Alerts by Type
const alertsByType = [
    { type: "Fraud", count: 24 },
    { type: "AML", count: 18 },
    { type: "Credit", count: 32 },
    { type: "Operational", count: 15 },
    { type: "Market", count: 9 },
];

// Fraud Detection Forecast
const fraudForecast = [
    { month: "Jul", actual: 12, predicted: 12, prevented: 11 },
    { month: "Aug", actual: 10, predicted: 10, prevented: 9 },
    { month: "Sep", actual: 8, predicted: 8, prevented: 7 },
    { month: "Oct", actual: null, predicted: 6, prevented: null },
    { month: "Nov", actual: null, predicted: 5, prevented: null },
    { month: "Dec", actual: null, predicted: 4, prevented: null },
];

// Credit Risk Prediction
const creditRiskTrend = [
    { month: "Jul", retail: 2.8, sme: 3.5, corporate: 1.2 },
    { month: "Aug", retail: 2.6, sme: 3.3, corporate: 1.1 },
    { month: "Sep", retail: 2.4, sme: 3.1, corporate: 1.0 },
    { month: "Oct", retail: 2.2, sme: 2.9, corporate: 0.9 },
    { month: "Nov", retail: 2.0, sme: 2.7, corporate: 0.8 },
    { month: "Dec", retail: 1.8, sme: 2.5, corporate: 0.7 },
];

// Operational Risk Alerts
const operationalRisk = [
    { month: "Oct", critical: 3, high: 8, medium: 15 },
    { month: "Nov", critical: 2, high: 6, medium: 12 },
    { month: "Dec", critical: 1, high: 5, medium: 10 },
];

// Risk Factor Impact
const riskFactors = [
    { factor: "Customer Credit Score", impact: 0.82 },
    { factor: "Transaction Pattern", impact: 0.75 },
    { factor: "Account Age", impact: 0.68 },
    { factor: "Geographic Location", impact: 0.54 },
    { factor: "Transaction Volume", impact: 0.48 },
];

export default function RiskAIInsightPage() {
    const [mainGraph, setMainGraph] = useState<'fraud' | 'credit'>('fraud');
    const [dateRange, setDateRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');

    return (
        <div className="space-y-8">
            {/* Header with Date Filter */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as any)}
                        className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium text-gray-700 hover:border-blue-500 transition-colors"
                    >
                        <option value="1M">Last Month</option>
                        <option value="3M">Last 3 Months</option>
                        <option value="6M">Last 6 Months</option>
                        <option value="1Y">Last Year</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* AI Insight Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-xl p-6 flex items-center gap-4 shadow">
                <Brain className="w-10 h-10 text-blue-600" />
                <p className="text-lg text-gray-800 font-medium">{aiInsight}</p>
            </div>
            {/* Main Graphs with Dropdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-700" />
                        <h2 className="text-xl font-bold text-gray-900">Key Risk Trends</h2>
                    </div>
                    <select
                        value={mainGraph}
                        onChange={e => setMainGraph(e.target.value as any)}
                        className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                        <option value="fraud">Fraud Trends</option>
                        <option value="credit">Credit PD by Segment</option>
                    </select>
                </div>
                <div className="h-80">
                    {mainGraph === 'fraud' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={fraudTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="detected" stroke="#2563eb" strokeWidth={3} name="Detected" />
                                <Line type="monotone" dataKey="prevented" stroke="#f59e0b" strokeWidth={3} name="Prevented" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={creditPD}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="segment" />
                                <YAxis label={{ value: 'PD (%)', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pd" fill="#2563eb" name="Probability of Default (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Risk Distribution and Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution Pie Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Shield className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-bold text-gray-900">Risk Distribution</h2>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    dataKey="value"
                                    nameKey="type"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ type, value }) => `${type}: ${value}%`}
                                >
                                    {riskDistribution.map((entry, idx) => (
                                        <Cell key={`cell-${idx}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts by Type Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-6 h-6 text-rose-600" />
                        <h2 className="text-xl font-bold text-gray-900">Alerts by Type</h2>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={alertsByType} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" />
                                <YAxis dataKey="type" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#2563eb" name="Alerts" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-green-900">Credit Quality</h3>
                        </div>
                        <p className="text-sm text-green-800">SME segment showing improvement. Consider increasing exposure by 10% in Q4.</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-5 h-5 text-yellow-600" />
                            <h3 className="font-semibold text-yellow-900">Fraud Prevention</h3>
                        </div>
                        <p className="text-sm text-yellow-800">Transaction patterns suggest increased scrutiny needed for Lagos-Abuja corridor.</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-900">Capital Optimization</h3>
                        </div>
                        <p className="text-sm text-blue-800">RAROC improvement of 2.1% possible through portfolio rebalancing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
