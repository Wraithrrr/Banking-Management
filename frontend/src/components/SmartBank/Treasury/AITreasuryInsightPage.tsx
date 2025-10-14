"use client";

import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
    Brain, TrendingUp, AlertTriangle, Shield, Lightbulb,
    DollarSign, PieChart as PieChartIcon, BarChart3,
    Target, Zap, FileText, Download,
    Activity, Sparkles, CheckCircle, XCircle,
    Info, Banknote, Wallet
} from "lucide-react";

// Predictive Data for Treasury
const sukukYieldForecast = [
    { month: "Jul", actual: 8.2, predicted: 8.2 },
    { month: "Aug", actual: 8.5, predicted: 8.5 },
    { month: "Sep", actual: 8.8, predicted: 8.8 },
    { month: "Oct", actual: null, predicted: 9.2 },
    { month: "Nov", actual: null, predicted: 9.6 },
    { month: "Dec", actual: null, predicted: 10.1 },
];

const liquidityTrend = [
    { month: "Jul", cashReserves: 18.5, sukuk: 32.4, investments: 45.6 },
    { month: "Aug", cashReserves: 17.8, sukuk: 33.2, investments: 46.8 },
    { month: "Sep", cashReserves: 19.2, sukuk: 34.8, investments: 48.2 },
    { month: "Oct", cashReserves: 20.5, sukuk: 36.2, investments: 49.8 },
    { month: "Nov", cashReserves: 21.8, sukuk: 37.8, investments: 51.2 },
    { month: "Dec", cashReserves: 23.2, sukuk: 39.5, investments: 52.8 },
];

const contractProfitability = [
    { month: "Oct", murabaha: 3.4, mudarabah: 2.2, ijara: 1.6, musharakah: 0.7 },
    { month: "Nov", murabaha: 3.6, mudarabah: 2.4, ijara: 1.7, musharakah: 0.8 },
    { month: "Dec", murabaha: 3.8, mudarabah: 2.6, ijara: 1.8, musharakah: 0.9 },
];

const riskExposure = [
    { factor: "Credit Risk", impact: 0.68 },
    { factor: "Market Volatility", impact: 0.54 },
    { factor: "Liquidity Pressure", impact: 0.42 },
    { factor: "Shariah Non-Compliance", impact: 0.18 },
    { factor: "Currency Fluctuation", impact: 0.35 },
];

export default function AITreasuryInsightPage() {
    const [timeRange, setTimeRange] = useState("6-months");
    const [forecastMetric, setForecastMetric] = useState("sukuk-yield");
    const [contractType, setContractType] = useState("all");
    const [scenarioType, setScenarioType] = useState("liquidity");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-8 text-white shadow-2xl border-t-4 border-yellow-400">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-400 rounded-xl">
                            <Brain className="w-8 h-8 text-blue-900" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-2">🧠 AI TREASURY INSIGHTS</h1>
                            <p className="text-blue-100 text-lg">SUMMIT ISLAMIC BANK - Treasury Intelligence Center</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-blue-200">AI Model Accuracy</div>
                        <div className="text-3xl font-bold text-yellow-400">96.2%</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">🔍 Analysis Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option value="3-months">Last 3 Months</option>
                        <option value="6-months">Last 6 Months</option>
                        <option value="12-months">Last 12 Months</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option>All Instruments</option>
                        <option>Sukuk</option>
                        <option>Murabaha</option>
                        <option>Ijara</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option>All Portfolios</option>
                        <option>Short-term</option>
                        <option>Long-term</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                        <option>Current Scenario</option>
                        <option>Optimistic</option>
                        <option>Conservative</option>
                    </select>
                </div>
            </div>

            {/* Executive AI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                            <span className="text-sm font-semibold text-gray-700">Sukuk Growth</span>
                        </div>
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">POSITIVE</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">+12.3%</div>
                    <div className="text-base font-medium text-gray-700">📈 Sukuk Yield Increase Q4</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Wallet className="w-8 h-8 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">Liquidity</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">OPTIMAL</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">142.5%</div>
                    <div className="text-base font-medium text-gray-700">💧 Predicted Liquidity Ratio</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-l-4 border-yellow-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                            <span className="text-sm font-semibold text-gray-700">Risk Level</span>
                        </div>
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">WATCH</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">6.8%</div>
                    <div className="text-base font-medium text-gray-700">⚠️ Market Volatility Risk</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-8 h-8 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-700">AI Insights</span>
                        </div>
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">ACTIVE</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">7</div>
                    <div className="text-base font-medium text-gray-700">💬 AI Recommendations</div>
                </div>
            </div>

            {/* SECTION 1: PREDICTIVE INTELLIGENCE */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">📊 SECTION 1: PREDICTIVE INTELLIGENCE</h2>
                </div>

                {/* Sukuk Yield Forecast */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Sukuk Yield & Return Forecast</h3>
                        <select value={forecastMetric} onChange={(e) => setForecastMetric(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                            <option value="sukuk-yield">Sukuk Yield</option>
                            <option value="profit-rate">Profit Rate</option>
                            <option value="roi">ROI Forecast</option>
                        </select>
                    </div>
                    <div className="h-80 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sukukYieldForecast}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <YAxis style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} name="Actual Yield (%)" dot={{ r: 6 }} />
                                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" name="AI Predicted (%)" dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4" />
                        <span className="font-medium">AI predicts 12.3% yield improvement through portfolio optimization</span>
                    </div>
                </div>

                {/* Liquidity Trend Projection */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">📈 Liquidity & Asset Allocation Forecast</h3>
                    </div>
                    <div className="h-80 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={liquidityTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <YAxis style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Area type="monotone" dataKey="cashReserves" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Cash Reserves (₦B)" />
                                <Area type="monotone" dataKey="sukuk" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Sukuk Holdings (₦B)" />
                                <Area type="monotone" dataKey="investments" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Investments (₦B)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                        <p className="text-sm font-bold text-blue-800">💡 AI Insight: Liquidity ratio will improve to 142.5% by December through strategic asset reallocation</p>
                    </div>
                </div>

                {/* Islamic Contract Profitability */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">💹 Islamic Contract Profitability Forecast</h3>
                        <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-base font-medium">
                            <option value="all">All Contracts</option>
                            <option value="murabaha">Murabaha</option>
                            <option value="ijara">Ijara</option>
                            <option value="musharakah">Musharakah</option>
                        </select>
                    </div>
                    <div className="h-80 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={contractProfitability}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <YAxis style={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                                <Bar dataKey="murabaha" fill="#3b82f6" name="Murabaha (₦B)" />
                                <Bar dataKey="mudarabah" fill="#10b981" name="Mudarabah (₦B)" />
                                <Bar dataKey="ijara" fill="#f59e0b" name="Ijara (₦B)" />
                                <Bar dataKey="musharakah" fill="#8b5cf6" name="Musharakah (₦B)" />
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
                    <h2 className="text-2xl font-bold text-gray-900">🧩 SECTION 2: DIAGNOSTIC INSIGHTS (WHY)</h2>
                </div>

                {/* Root Cause Analysis */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Root Cause Analysis</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">Sukuk portfolio yields increased 12.3%</p>
                                <p className="text-base text-gray-700 mt-1">→ Root cause: Strategic shift to longer-term Sukuk instruments with higher profit-sharing ratios</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">Temporary liquidity pressure detected</p>
                                <p className="text-base text-gray-700 mt-1">→ Root cause: Large corporate withdrawal (₦3.2B) offset by improved Murabaha collections</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <Banknote className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-bold text-lg text-gray-900">Murabaha profitability up 8.5%</p>
                                <p className="text-base text-gray-700 mt-1">→ Root cause: AI-optimized pricing strategy and improved customer credit scoring</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Factor Correlation */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📉 Treasury Risk Factor Correlation</h3>
                    <div className="space-y-3">
                        {riskExposure.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-48 font-bold text-base text-gray-900">{item.factor}</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-red-600 h-full flex items-center justify-end pr-3"
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
                        Risk correlation: Shows which factors most impact treasury operations
                    </div>
                </div>

                {/* Shariah Compliance Analysis */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🕌 Shariah Compliance AI Analysis</h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-5xl font-bold text-green-600">99.8%</div>
                                <div>
                                    <div className="font-bold text-lg text-gray-900">Shariah Compliance Score</div>
                                    <div className="text-sm text-gray-600">Across all treasury instruments</div>
                                </div>
                            </div>
                            <Shield className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="font-bold text-base text-gray-900">Compliant Instruments</span>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• All Sukuk verified by Shariah Board</li>
                                    <li>• Murabaha pricing structure approved</li>
                                    <li>• Ijara contracts fully compliant</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-5 h-5 text-yellow-600" />
                                    <span className="font-bold text-base text-gray-900">Minor Issues (0.2%)</span>
                                </div>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• 2 contracts pending board review</li>
                                    <li>• Documentation updates required</li>
                                    <li>• All flagged for immediate action</li>
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
                    <h2 className="text-2xl font-bold text-gray-900">💡 SECTION 3: PRESCRIPTIVE INTELLIGENCE (ACTION)</h2>
                </div>

                {/* AI Recommendations */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Treasury Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-200 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-5 h-5 text-blue-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[1] Sukuk Portfolio Optimization</div>
                                    <p className="text-sm text-gray-700">"Shift 20% of short-term Sukuk (3-6 months) to 12-month instruments to increase yield by 2.3%."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold">HIGH IMPACT</span>
                                        <span className="text-xs text-gray-600">Est. Additional Profit: ₦850M</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-200 rounded-lg flex-shrink-0">
                                    <Wallet className="w-5 h-5 text-green-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[2] Liquidity Buffer Enhancement</div>
                                    <p className="text-sm text-gray-700">"Increase cash reserves by ₦2B to maintain optimal liquidity ratio above 140% during Q4 peak."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">CRITICAL</span>
                                        <span className="text-xs text-gray-600">Risk Mitigation: High</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-200 rounded-lg flex-shrink-0">
                                    <PieChartIcon className="w-5 h-5 text-purple-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[3] Musharakah Expansion</div>
                                    <p className="text-sm text-gray-700">"Expand Musharakah portfolio by 5% — AI models show 18% higher profitability vs current mix."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-bold">MEDIUM IMPACT</span>
                                        <span className="text-xs text-gray-600">Profit Increase: +₦420M</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-yellow-200 rounded-lg flex-shrink-0">
                                    <Shield className="w-5 h-5 text-yellow-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[4] Currency Risk Hedging</div>
                                    <p className="text-sm text-gray-700">"Reduce FX exposure by 8% to mitigate projected currency volatility in Q4 2025."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">RISK MITIGATION</span>
                                        <span className="text-xs text-gray-600">Volatility Reduction: 35%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-5 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-200 rounded-lg flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[5] Ijara Lease Review</div>
                                    <p className="text-sm text-gray-700">"Review 12 Ijara contracts flagged by AI — pricing anomalies detected requiring adjustment."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-xs font-bold">URGENT</span>
                                        <span className="text-xs text-gray-600">Compliance Priority</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-5 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-200 rounded-lg flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 text-indigo-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[6] Murabaha Rate Optimization</div>
                                    <p className="text-sm text-gray-700">"AI suggests 0.3% rate adjustment on Murabaha products to maximize profit while staying competitive."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-xs font-bold">QUICK WIN</span>
                                        <span className="text-xs text-gray-600">Revenue Impact: +₦180M</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-5 border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-teal-200 rounded-lg flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-teal-700" />
                                </div>
                                <div>
                                    <div className="font-bold text-base text-gray-900 mb-2">[7] Green Sukuk Opportunity</div>
                                    <p className="text-sm text-gray-700">"Launch ₦5B Green Sukuk for renewable energy — AI predicts 92% subscription rate and 11% yield."</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="px-3 py-1 bg-teal-200 text-teal-800 rounded-full text-xs font-bold">STRATEGIC</span>
                                        <span className="text-xs text-gray-600">ESG Impact: Excellent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scenario Simulator */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🎮 AI Treasury Scenario Simulator</h3>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Scenario Type</label>
                                <select value={scenarioType} onChange={(e) => setScenarioType(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-medium">
                                    <option value="liquidity">Liquidity Management</option>
                                    <option value="yield">Yield Optimization</option>
                                    <option value="risk">Risk Mitigation</option>
                                    <option value="compliance">Shariah Compliance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">What If...</label>
                                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base font-medium">
                                    <option>Increase Sukuk allocation by 10%</option>
                                    <option>Reduce cash reserves to 15%</option>
                                    <option>Launch new Mudarabah product</option>
                                    <option>Adjust Murabaha pricing by 0.5%</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 bg-white rounded-lg p-5 border border-blue-200">
                            <div className="text-sm font-bold text-gray-600 mb-3">SIMULATION RESULTS</div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-2xl font-bold text-green-600">+₦1.8B</div>
                                    <div className="text-sm text-gray-600">Annual Profit Impact</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">138.5%</div>
                                    <div className="text-sm text-gray-600">New Liquidity Ratio</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">Low</div>
                                    <div className="text-sm text-gray-600">Risk Level</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Confidence Gauge */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📊 AI Treasury Model Confidence</h3>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
                                <div className="text-base text-gray-700 font-medium">Yield Forecast Confidence</div>
                                <div className="text-sm text-gray-600 mt-1">Uncertainty: ±1.8%</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-blue-600 mb-2">96.2%</div>
                                <div className="text-base text-gray-700 font-medium">Overall Model Accuracy</div>
                                <div className="text-sm text-gray-600 mt-1">Based on 24 months of data</div>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-purple-600 mb-2">18,750</div>
                                <div className="text-base text-gray-700 font-medium">Transactions Analyzed</div>
                                <div className="text-sm text-gray-600 mt-1">Last updated: 1 min ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Summary Bottom */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white shadow-xl">
                <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">💬 AI Treasury Executive Summary</h3>
                        <p className="text-lg text-blue-100 leading-relaxed">
                            "Q4 treasury forecast indicates <span className="font-bold text-yellow-300">strong yield growth (+12.3%)</span> with optimal liquidity position.
                            AI recommends <span className="font-bold text-yellow-300">strategic Sukuk reallocation</span> to maximize returns while maintaining
                            <span className="font-bold text-yellow-300"> 142.5% liquidity ratio</span>. Shariah compliance remains excellent (99.8%) with minor documentation
                            updates required. Strategic opportunity identified in <span className="font-bold text-yellow-300">Green Sukuk launch</span> with projected
                            92% subscription rate. Currency risk mitigation advised through 8% FX exposure reduction."
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
