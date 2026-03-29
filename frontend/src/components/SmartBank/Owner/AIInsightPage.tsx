"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
    Brain, TrendingUp, AlertTriangle, Shield, Lightbulb,
    TrendingDown, DollarSign, Users, BarChart3,
    Target, Zap, FileText, Download, ChevronDown,
    Activity, PieChart, Sparkles, CheckCircle, XCircle,
    ArrowUpRight, ArrowDownRight, Info
} from "lucide-react";

// Predictive Data
const revenueForecast = [
    { month: "Jul", actual: 1380, predicted: 1380 },
    { month: "Aug", actual: 1420, predicted: 1420 },
    { month: "Sep", actual: 1480, predicted: 1480 },
    { month: "Oct", actual: null, predicted: 1540 },
    { month: "Nov", actual: null, predicted: 1615 },
    { month: "Dec", actual: null, predicted: 1688 },
];

const customerGrowth = [
    { month: "Jul", retail: 280000, sme: 42000, corporate: 8500 },
    { month: "Aug", retail: 295000, sme: 44000, corporate: 8800 },
    { month: "Sep", retail: 310000, sme: 45500, corporate: 9100 },
    { month: "Oct", retail: 325000, sme: 47200, corporate: 9400 },
    { month: "Nov", retail: 338000, sme: 48800, corporate: 9700 },
    { month: "Dec", retail: 352000, sme: 50500, corporate: 10000 },
];

const liquidityForecast = [
    { month: "Oct", cashflow: 18.5, sukuk: 32.4, financing: 28.2 },
    { month: "Nov", cashflow: 17.2, sukuk: 34.1, financing: 30.5 },
    { month: "Dec", cashflow: 16.8, sukuk: 35.8, financing: 32.8 },
];

// Correlation Data
const correlationData = [
    { factor: "IT Investment", impact: 0.85 },
    { factor: "Branch Efficiency", impact: 0.72 },
    { factor: "Digital Adoption", impact: 0.68 },
    { factor: "Customer Satisfaction", impact: 0.55 },
    { factor: "Marketing Spend", impact: 0.42 },
];

export default function AIInsightPage() {
    const [timeRange, setTimeRange] = useState("6-months");
    const [department, setDepartment] = useState("all");
    const [predictiveMetric, setPredictiveMetric] = useState("revenue");
    const [customerSegment, setCustomerSegment] = useState("all");
    const [scenarioType, setScenarioType] = useState("credit");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-black rounded-2xl p-8 text-white shadow-2xl border-t-4 border-yellow-400">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-400 rounded-xl">
                            <Brain className="w-8 h-8 text-blue-900" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">AI Intelligence Dashboard</h1>
                            <p className="text-blue-100 text-lg">Summit Islamic Bank — Predictive Intelligence Center</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-blue-200">AI Model Accuracy</div>
                        <div className="text-3xl font-bold text-yellow-400">94.7%</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Analysis Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option value="3-months">Last 3 Months</option>
                        <option value="6-months">Last 6 Months</option>
                        <option value="12-months">Last 12 Months</option>
                    </select>
                    <select value={department} onChange={(e) => setDepartment(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option value="all">All Departments</option>
                        <option value="credit">Credit & Loans</option>
                        <option value="operations">Operations</option>
                        <option value="retail">Retail Banking</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option>All Branches</option>
                        <option>Lagos Victoria Island</option>
                        <option>Abuja Central</option>
                        <option>Kano Main</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option>Current Scenario</option>
                        <option>Optimistic Growth</option>
                        <option>Conservative</option>
                    </select>
                </div>
            </div>

            {/* Executive AI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">POSITIVE</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">+7.4%</div>
                    <div className="text-base font-medium text-gray-700">Predicted Revenue Growth (Q4)</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">MODERATE</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">Low</div>
                    <div className="text-base font-medium text-gray-700">Liquidity Risk Level</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">EXCELLENT</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">0.2%</div>
                    <div className="text-base font-medium text-gray-700">Shariah Compliance Risk</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <Lightbulb className="w-8 h-8 text-purple-600" />
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">ACTIVE</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
                    <div className="text-base font-medium text-gray-700">AI Recommendations</div>
                </div>
            </div>

            {/* SECTION 1: PREDICTIVE INTELLIGENCE */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Section 1: Predictive Intelligence</h2>
                </div>

                {/* Revenue Forecast */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Revenue & Profit Forecast</h3>
                        <select value={predictiveMetric} onChange={(e) => setPredictiveMetric(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                            <option value="revenue">Revenue</option>
                            <option value="profit">Profit</option>
                            <option value="deposits">Deposits</option>
                            <option value="investments">Investments</option>
                        </select>
                    </div>
                    <div className="h-80 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <YAxis style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} name="Actual Revenue (₦B)" dot={{ r: 6 }} />
                                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted (₦B)" dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span className="font-medium">Predictive Horizon: 3 / 6 / 12 months</span>
                    </div>
                </div>

                {/* Customer Growth Projection */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Customer Growth Projection</h3>
                        <select value={customerSegment} onChange={(e) => setCustomerSegment(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                            <option value="all">All Segments</option>
                            <option value="retail">Retail</option>
                            <option value="sme">SME</option>
                            <option value="corporate">Corporate</option>
                        </select>
                    </div>
                    <div className="h-80 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={customerGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <YAxis style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="retail" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Retail" />
                                <Area type="monotone" dataKey="sme" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="SME" />
                                <Area type="monotone" dataKey="corporate" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Corporate" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                        <p className="text-sm font-bold text-yellow-800">Churn Risk Prediction: Retail segment shows 3.2% churn risk increase in Q4</p>
                    </div>
                </div>

                {/* Liquidity Forecast */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Liquidity & Funding Projection</h3>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                            <option>Cashflow</option>
                            <option>Sukuk</option>
                            <option>Corporate Financing</option>
                        </select>
                    </div>
                    <div className="h-80 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={liquidityForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <YAxis style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Bar dataKey="cashflow" fill="#06b6d4" name="Cashflow (₦B)" />
                                <Bar dataKey="sukuk" fill="#8b5cf6" name="Sukuk (₦B)" />
                                <Bar dataKey="financing" fill="#f59e0b" name="Financing (₦B)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* SECTION 2: DIAGNOSTIC INSIGHTS */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Activity className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Section 2: Diagnostic Insights</h2>
                </div>

                {/* Root Cause Analysis */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Root Cause Analysis</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                            <TrendingDown className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">Profit decreased by 2.1%</p>
                                <p className="text-base text-gray-700 mt-1">→ Root cause: Higher IT infrastructure spend (+12%) for cybersecurity upgrades</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">Liquidity dip detected</p>
                                <p className="text-base text-gray-700 mt-1">→ Root cause: Linked to SME segment withdrawals (+8.5%) in September</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">Customer acquisition improved</p>
                                <p className="text-base text-gray-700 mt-1">→ Root cause: Digital onboarding efficiency increased by 24% through AI automation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Correlation Map */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Impact Correlation</h3>
                    <div className="space-y-3">
                        {correlationData.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-48 font-bold text-base text-gray-900">{item.factor}</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-full flex items-center justify-end pr-3"
                                        style={{ width: `${item.impact * 100}%` }}
                                    >
                                        <span className="text-white font-bold text-sm">{(item.impact * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-sm text-gray-600 font-medium">
                        <Info className="w-4 h-4 inline mr-1" />
                        Correlation strength: Shows which variables most affect profitability
                    </div>
                </div>

                {/* Sentiment Analysis */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Sentiment Analysis</h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-5xl font-bold text-green-600">80%</div>
                                <div>
                                    <div className="font-bold text-lg text-gray-900">Positive Sentiment</div>
                                    <div className="text-sm text-gray-600">From 12,450 customer interactions</div>
                                </div>
                            </div>
                            <Sparkles className="w-12 h-12 text-yellow-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="font-bold text-base text-gray-900">Top Praise</span>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Fast transaction processing</li>
                                    <li>• Excellent customer service</li>
                                    <li>• User-friendly mobile app</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <span className="font-bold text-base text-gray-900">Major Concern</span>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• Mobile app downtime (18% complaints)</li>
                                    <li>• ATM network issues</li>
                                    <li>• Long branch wait times</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: PRESCRIPTIVE INTELLIGENCE */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Section 3: Prescriptive Intelligence</h2>
                </div>

                {/* AI Recommendations */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Strategic Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-200 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[1] Liquidity Optimization</div>
                                    <p className="text-sm text-gray-700">"Increase short-term Sukuk holdings by ₦2B to stabilize liquidity and reduce risk exposure."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">HIGH IMPACT</span>
                                        <span className="text-xs text-gray-600">Est. ROI: +4.2%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-200 rounded-lg flex-shrink-0">
                                    <Shield className="w-5 h-5 text-red-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[2] Fraud Prevention</div>
                                    <p className="text-sm text-gray-700">"Deploy AI fraud monitoring on corporate accounts — anomaly risk detected at 6.8%."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">CRITICAL</span>
                                        <span className="text-xs text-gray-600">Est. Savings: ₦850M</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-200 rounded-lg flex-shrink-0">
                                    <PieChart className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[3] Investment Rebalancing</div>
                                    <p className="text-sm text-gray-700">"Rebalance investment mix: reduce FX exposure by 5% to mitigate currency volatility risk."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">MEDIUM IMPACT</span>
                                        <span className="text-xs text-gray-600">Risk Reduction: 15%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-200 rounded-lg flex-shrink-0">
                                    <Users className="w-5 h-5 text-purple-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[4] Customer Retention</div>
                                    <p className="text-sm text-gray-700">"Launch targeted SME retention campaign — AI predicts 42% churn prevention success rate."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">HIGH IMPACT</span>
                                        <span className="text-xs text-gray-600">Expected Retention: 1,200 accounts</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-yellow-200 rounded-lg flex-shrink-0">
                                    <Activity className="w-5 h-5 text-yellow-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[5] Operational Efficiency</div>
                                    <p className="text-sm text-gray-700">"Implement AI-powered queue management in 5 high-traffic branches to reduce wait time by 35%."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">QUICK WIN</span>
                                        <span className="text-xs text-gray-600">Customer Sat. +18%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scenario Simulator */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Scenario Simulator</h3>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Scenario Type</label>
                                <select value={scenarioType} onChange={(e) => setScenarioType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-medium">
                                    <option value="credit">Credit Operations</option>
                                    <option value="compliance">Compliance</option>
                                    <option value="operations">Branch Operations</option>
                                    <option value="growth">Customer Growth</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">What If...</label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-medium">
                                    <option>Increase Murabaha rate by 0.5%</option>
                                    <option>Launch new SME loan product</option>
                                    <option>Reduce operational cost by 10%</option>
                                    <option>Open 3 new branches</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 bg-white rounded-lg p-5 border border-blue-200">
                            <div className="text-sm font-bold text-gray-600 mb-3">SIMULATION RESULTS</div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-2xl font-bold text-green-600">+5.8%</div>
                                    <div className="text-sm text-gray-600">Predicted ROI</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">Medium</div>
                                    <div className="text-sm text-gray-600">Risk Score</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">+₦1.2B</div>
                                    <div className="text-sm text-gray-600">Liquidity Impact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Confidence Gauge */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Model Confidence & Accuracy</h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                                <div className="text-base text-gray-700 font-medium">Revenue Forecast Confidence</div>
                                <div className="text-sm text-gray-600 mt-1">Uncertainty: ±2.3%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-blue-600 mb-2">94.7%</div>
                                <div className="text-base text-gray-700 font-medium">Overall Model Accuracy</div>
                                <div className="text-sm text-gray-600 mt-1">Based on 18 months of data</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-purple-600 mb-2">12,450</div>
                                <div className="text-base text-gray-700 font-medium">Data Points Analyzed</div>
                                <div className="text-sm text-gray-600 mt-1">Last updated: 2 mins ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Summary Bottom */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-8 text-white shadow-xl">
                <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">AI Executive Summary</h3>
                        <p className="text-lg text-blue-100 leading-relaxed">
                            "Q4 forecast indicates <span className="font-bold text-yellow-300">stable profit growth (+7.4%)</span> with minor liquidity pressure.
                            AI recommends <span className="font-bold text-yellow-300">rebalancing Sukuk allocation (+₦2B)</span> and deploying
                            <span className="font-bold text-yellow-300"> mobile app stability patch</span> to improve uptime by 24%.
                            Customer sentiment remains positive (80%) but requires attention to mobile experience.
                            Strategic opportunity detected in <span className="font-bold text-yellow-300">SME segment expansion</span> with projected
                            42% churn prevention success rate."
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                        <Download className="w-5 h-5" />
                        Export as PDF
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                        <FileText className="w-5 h-5" />
                        Export as PPT
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                        <BarChart3 className="w-5 h-5" />
                        Export as Excel
                    </button>
                </div>
            </div>
        </div>
    );
}
