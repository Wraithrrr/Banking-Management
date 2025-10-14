'use client';

import { Droplets, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Clock } from 'lucide-react';
import ProfessionalLineChart from '@/components/ui/ProfessionalLineChart';
import ProfessionalChart from '@/components/ui/ProfessionalChart';

export default function LiquidityCashflow() {
    // LCR Trend Data (12 months)
    const lcrTrendData = [
        { name: 'Jan', value: 128 },
        { name: 'Feb', value: 132 },
        { name: 'Mar', value: 135 },
        { name: 'Apr', value: 138 },
        { name: 'May', value: 142 },
        { name: 'Jun', value: 145 },
        { name: 'Jul', value: 143 },
        { name: 'Aug', value: 148 },
        { name: 'Sep', value: 151 },
        { name: 'Oct', value: 155 },
        { name: 'Nov', value: 158 },
        { name: 'Dec', value: 162 },
    ];

    // Daily Inflow/Outflow (Last 14 days)
    const cashflowData = [
        { name: '30 Sep', value: 2.3 },
        { name: '1 Oct', value: 2.1 },
        { name: '2 Oct', value: 2.5 },
        { name: '3 Oct', value: 2.8 },
        { name: '4 Oct', value: 3.1 },
        { name: '5 Oct', value: 2.9 },
        { name: '6 Oct', value: 2.7 },
        { name: '7 Oct', value: 3.0 },
        { name: '8 Oct', value: 3.2 },
        { name: '9 Oct', value: 2.8 },
        { name: '10 Oct', value: 3.1 },
        { name: '11 Oct', value: 3.3 },
        { name: '12 Oct', value: 3.5 },
        { name: '13 Oct', value: 3.4 },
    ];

    const outflowData = [
        { name: '30 Sep', value: 1.8 },
        { name: '1 Oct', value: 2.0 },
        { name: '2 Oct', value: 1.9 },
        { name: '3 Oct', value: 2.2 },
        { name: '4 Oct', value: 2.5 },
        { name: '5 Oct', value: 2.3 },
        { name: '6 Oct', value: 2.1 },
        { name: '7 Oct', value: 2.4 },
        { name: '8 Oct', value: 2.6 },
        { name: '9 Oct', value: 2.2 },
        { name: '10 Oct', value: 2.5 },
        { name: '11 Oct', value: 2.7 },
        { name: '12 Oct', value: 2.8 },
        { name: '13 Oct', value: 2.9 },
    ];

    // Funding Sources Breakdown
    const fundingSourcesData = [
        { name: 'Customer Deposits', value: 42, color: '#3B82F6' },
        { name: 'Interbank', value: 18, color: '#60A5FA' },
        { name: 'Sukuk Issuance', value: 22, color: '#2563EB' },
        { name: 'Shareholder Equity', value: 12, color: '#1E40AF' },
        { name: 'Other Sources', value: 6, color: '#1E3A8A' },
    ];

    // Liquidity Buffer Calculation
    const liquidityBuffer = 78.5; // Percentage
    const nsfr = 124.3; // Net Stable Funding Ratio

    return (
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <Droplets className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Liquidity & Cashflow Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Real-time funding, inflows, outflows, and cash reserves monitoring</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-xs sm:text-sm text-gray-500">Last Updated</div>
                    <div className="text-base sm:text-lg font-semibold text-gray-900">13 Oct 2025, 09:45 AM</div>
                </div>
            </div>

            {/* AI Early Warning Alert */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-3 sm:p-4 rounded-lg shadow-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-amber-900 mb-1">⚠️ AI Early Warning Detection</h3>
                        <p className="text-amber-800 text-xs sm:text-sm">
                            Liquidity dip projected in <strong>10 days</strong> (Oct 23, 2025). Expected temporary decline of <strong>₦850M</strong> due to Sukuk maturity payments.
                            Recommend activating interbank facility or delaying non-critical capital expenditure.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button className="px-3 py-1 bg-amber-600 text-white text-xs rounded-md hover:bg-amber-700">
                                View Mitigation Plan
                            </button>
                            <button className="px-3 py-1 bg-white text-amber-700 text-xs rounded-md border border-amber-300 hover:bg-amber-50">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* LCR Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">Excellent</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">162%</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Liquidity Coverage Ratio</div>
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="break-words">+7% vs last month | Min: 100%</span>
                    </div>
                </div>

                {/* NSFR Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">Stable</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{nsfr}%</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Net Stable Funding Ratio</div>
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="break-words">+24% above regulatory min (100%)</span>
                    </div>
                </div>

                {/* Liquidity Buffer Card */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-sm border border-cyan-200">
                    <div className="flex items-center justify-between mb-2">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                        <span className="text-xs font-semibold text-cyan-700 bg-cyan-200 px-2 py-1 rounded-full">Healthy</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">{liquidityBuffer}%</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Liquidity Buffer</div>
                    <div className="mt-2 flex items-center text-xs text-cyan-600">
                        <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="break-words">₦12.4B available | Target: ≥70%</span>
                    </div>
                </div>

                {/* Net Cashflow Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-200 px-2 py-1 rounded-full">Positive</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">₦8.7B</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Net Cashflow (30-Day)</div>
                    <div className="mt-2 flex items-center text-xs text-indigo-600">
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="break-words">+12% vs forecast | Inflow &gt; Outflow</span>
                    </div>
                </div>
            </div>

            {/* LCR Trend Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Liquidity Coverage Ratio (LCR) Trend</h2>
                        <p className="text-xs sm:text-sm text-gray-600">12-month historical performance tracking</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">LCR %</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-1 bg-red-500"></div>
                            <span className="text-gray-700 hidden sm:inline">Regulatory Min: 100%</span>
                            <span className="text-gray-700 sm:hidden">Min: 100%</span>
                        </div>
                    </div>
                </div>
                <div className="h-64 sm:h-80">
                    <ProfessionalLineChart
                        data={lcrTrendData}
                        lineColor="#3B82F6"
                        areaFill={true}
                        showDots={true}
                        strokeWidth={3}
                        showGrid={true}
                        yAxisLabel="LCR (%)"
                        minValue={100}
                        maxValue={170}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">Current LCR</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">162%</div>
                        <div className="text-xs text-blue-600 mt-1">↑ 62% above minimum</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">12-Month Average</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">145%</div>
                        <div className="text-xs text-blue-600 mt-1">Consistently above 100%</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">Trend Direction</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-1" /> Upward
                        </div>
                        <div className="text-xs text-blue-600 mt-1">+26% YoY growth</div>
                    </div>
                </div>
            </div>

            {/* Daily Inflow/Outflow Graph */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Daily Cashflow - Net Inflow</h2>
                        <p className="text-xs sm:text-sm text-gray-600">Last 14 days • Amounts in ₦ Billion</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-gray-700">Net Inflow</span>
                        </div>
                    </div>
                </div>
                <div className="h-64 sm:h-80">
                    <ProfessionalChart
                        data={cashflowData}
                        barColor="#3B82F6"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium flex items-center gap-1">
                            <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" /> Total Inflow (14d)
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">₦41.6B</div>
                        <div className="text-xs text-gray-600 mt-1">Avg: ₦2.97B/day</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" /> Total Outflow (14d)
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">₦33.9B</div>
                        <div className="text-xs text-gray-600 mt-1">Avg: ₦2.42B/day</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">Net Position</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">+₦7.7B</div>
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> Positive cashflow
                        </div>
                    </div>
                </div>
            </div>

            {/* Funding Sources & Liquidity Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Funding Sources Breakdown */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Funding Sources Breakdown</h2>
                    <div className="h-64 sm:h-72 mb-6">
                        <ProfessionalChart
                            data={fundingSourcesData}
                            barColor="#3B82F6"
                        />
                    </div>
                    {/* Legend */}
                    <div className="space-y-2 pt-4 border-t border-gray-100">
                        {fundingSourcesData.map((source, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: source.color }}></div>
                                    <span className="text-xs sm:text-sm text-gray-700">{source.name}</span>
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-900">{source.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Short-Term vs Long-Term Liquidity Map */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Liquidity Time Horizon Map</h2>
                    <div className="space-y-4">
                        {/* Immediate (0-7 days) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-semibold text-gray-700">Immediate (0-7 days)</span>
                                </div>
                                <span className="text-lg font-bold text-green-900">₦8.2B</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: '95%' }}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">95% coverage • Excellent position</div>
                        </div>

                        {/* Short-Term (8-30 days) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">Short-Term (8-30 days)</span>
                                </div>
                                <span className="text-lg font-bold text-blue-900">₦14.7B</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '88%' }}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">88% coverage • Strong buffer</div>
                        </div>

                        {/* Medium-Term (31-90 days) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-cyan-600" />
                                    <span className="text-sm font-semibold text-gray-700">Medium-Term (31-90 days)</span>
                                </div>
                                <span className="text-lg font-bold text-cyan-900">₦22.3B</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-cyan-500 h-3 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">82% coverage • Adequate reserves</div>
                        </div>

                        {/* Long-Term (91-365 days) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-semibold text-gray-700">Long-Term (91-365 days)</span>
                                </div>
                                <span className="text-lg font-bold text-purple-900">₦38.5B</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">76% coverage • Stable long-term position</div>
                        </div>

                        {/* Strategic Reserve (1+ years) */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-indigo-600" />
                                    <span className="text-sm font-semibold text-gray-700">Strategic Reserve (1+ years)</span>
                                </div>
                                <span className="text-lg font-bold text-indigo-900">₦56.8B</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-1">92% coverage • Excellent long-term stability</div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Overall Liquidity Health: Excellent
                        </div>
                        <div className="text-xs text-gray-700 mt-1">
                            All time horizons above 75% coverage threshold. No liquidity stress detected.
                        </div>
                    </div>
                </div>
            </div>

            {/* Liquidity Action Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended Actions & Monitoring</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-900">Maintain Current Position</h3>
                        </div>
                        <p className="text-sm text-blue-800">LCR at 162% is well above regulatory minimum. Continue monitoring daily cashflows.</p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <h3 className="font-semibold text-amber-900">Prepare for Oct 23 Dip</h3>
                        </div>
                        <p className="text-sm text-amber-800">Activate ₦1B interbank standby facility to buffer Sukuk maturity payment.</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-green-900">Optimize Idle Cash</h3>
                        </div>
                        <p className="text-sm text-green-800">₦2.3B excess liquidity detected. Consider short-term Murabaha investments.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
