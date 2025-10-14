'use client';

import { TrendingUp, FileText, Target, Shield, AlertCircle, CheckCircle, DollarSign, PieChart, BarChart3, Calendar } from 'lucide-react';
import ProfessionalLineChart from '@/components/ui/ProfessionalLineChart';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';

export default function InvestmentsSukuk() {
    // Sukuk Holdings by Type
    const sukukByTypeData = [
        { name: 'Government Sukuk', value: 38, percentage: 38, color: '#3B82F6' },
        { name: 'Corporate Sukuk', value: 27, percentage: 27, color: '#60A5FA' },
        { name: 'Sovereign Sukuk', value: 22, percentage: 22, color: '#2563EB' },
        { name: 'Supranational', value: 13, percentage: 13, color: '#1E40AF' },
    ];

    // ROI vs Benchmark (12 months)
    const roiData = [
        { name: 'Jan', value: 8.2 },
        { name: 'Feb', value: 8.5 },
        { name: 'Mar', value: 8.8 },
        { name: 'Apr', value: 9.1 },
        { name: 'May', value: 9.3 },
        { name: 'Jun', value: 9.5 },
        { name: 'Jul', value: 9.7 },
        { name: 'Aug', value: 10.1 },
        { name: 'Sep', value: 10.3 },
        { name: 'Oct', value: 10.5 },
        { name: 'Nov', value: 10.8 },
        { name: 'Dec', value: 11.2 },
    ];

    // Investment by Contract Type
    const contractTypeData = [
        { name: 'Murabaha', value: 32 },
        { name: 'Ijara', value: 28 },
        { name: 'Musharakah', value: 18 },
        { name: 'Mudarabah', value: 15 },
        { name: 'Sukuk', value: 7 },
    ];

    return (
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Investments & Sukuk Portfolio
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Track all Shariah-compliant investments and portfolio performance</p>
                </div>
                <div className="text-left md:text-right">
                    <div className="text-xs sm:text-sm text-gray-500">Portfolio Value</div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">₦156.8B</div>
                </div>
            </div>

            {/* Ethical Weight Alert */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-lg shadow-sm">
                <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-green-900 mb-1">✓ 100% Shariah-Compliant Portfolio</h3>
                        <p className="text-green-800 text-xs sm:text-sm">
                            All investments meet Islamic banking principles. Zero exposure to haram sectors (alcohol, gambling, interest-based instruments).
                            Certified by Shariah Board on <strong>Oct 1, 2025</strong>.
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700">
                                View Shariah Certificate
                            </button>
                            <button className="px-3 py-1 bg-white text-green-700 text-xs rounded-md border border-green-300 hover:bg-green-50">
                                Download Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Portfolio Value */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">Growing</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">₦156.8B</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Total Portfolio Value</div>
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>+8.5% YTD growth</span>
                    </div>
                </div>

                {/* Average ROI */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-sm border border-indigo-200">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                        <span className="text-xs font-semibold text-indigo-700 bg-indigo-200 px-2 py-1 rounded-full">Above Target</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">11.2%</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Average ROI (Annualized)</div>
                    <div className="mt-2 flex items-center text-xs text-indigo-600">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="break-words">Benchmark: 9.5% | +1.7% outperformance</span>
                    </div>
                </div>

                {/* Active Sukuk */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 sm:p-6 rounded-xl shadow-sm border border-cyan-200">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                        <span className="text-xs font-semibold text-cyan-700 bg-cyan-200 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">47</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Active Sukuk Holdings</div>
                    <div className="mt-2 flex items-center text-xs text-cyan-600">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="break-words">12 maturing in next 90 days</span>
                    </div>
                </div>

                {/* Shariah Compliance */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-xl shadow-sm border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-2 py-1 rounded-full">Certified</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">100%</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">Shariah-Compliant</div>
                    <div className="mt-2 flex items-center text-xs text-blue-600">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>All assets ethically screened</span>
                    </div>
                </div>
            </div>

            {/* Sukuk Holdings by Type & Contract Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Sukuk Holdings by Type */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Sukuk Holdings by Type</h2>
                    <div className="h-64 sm:h-80">
                        <ProfessionalPieChart
                            data={sukukByTypeData}
                            showLegend={true}
                            showLabels={true}
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {sukukByTypeData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs text-gray-700">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Investment by Contract Type */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Investment by Contract Type</h2>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md">Murabaha</button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">Ijara</button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">Musharakah</button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">Mudarabah</button>
                        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300">Sukuk</button>
                    </div>
                    <div className="h-56 sm:h-64">
                        <ProfessionalChart
                            data={contractTypeData}
                            barColor="#3B82F6"
                        />
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm font-semibold text-blue-600">Murabaha Contracts</div>
                        <div className="text-2xl font-bold text-gray-900">₦50.2B</div>
                        <div className="text-xs text-gray-600 mt-1">Average ROI: 9.8% | 124 active contracts</div>
                    </div>
                </div>
            </div>

            {/* ROI vs Benchmark Performance */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">ROI Performance vs Industry Benchmark</h2>
                        <p className="text-xs sm:text-sm text-gray-600">12-month trend showing consistent outperformance</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">Portfolio ROI (%)</span>
                        </div>
                    </div>
                </div>
                <div className="h-64 sm:h-80">
                    <ProfessionalLineChart
                        data={roiData}
                        lineColor="#3B82F6"
                        areaFill={true}
                        showDots={true}
                        strokeWidth={3}
                        showGrid={true}
                        yAxisLabel="ROI (%)"
                        minValue={7}
                        maxValue={12}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">Current ROI</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">11.2%</div>
                        <div className="text-xs text-blue-600 mt-1">↑ +2.0% vs Jan 2025</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">Industry Benchmark</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">9.5%</div>
                        <div className="text-xs text-blue-600 mt-1">↑ +1.7% outperformance</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="text-xs sm:text-sm text-blue-600 font-medium">12-Month Avg</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">9.8%</div>
                        <div className="text-xs text-blue-600 mt-1">Consistently above target</div>
                    </div>
                </div>
            </div>

            {/* Investment Maturity Ladder */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Investment Maturity Ladder</h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Upcoming maturities and reinvestment schedule</p>
                <div className="space-y-3">
                    {/* 0-30 days */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">0-30 Days</span>
                            <span className="text-lg font-bold text-gray-900">₦12.3B</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-red-500 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: '18%' }}>
                                <span className="text-xs text-white font-semibold">18%</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">8 Sukuk maturing | Avg yield: 9.2%</div>
                    </div>

                    {/* 31-90 days */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">31-90 Days</span>
                            <span className="text-lg font-bold text-gray-900">₦18.7B</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-orange-500 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: '27%' }}>
                                <span className="text-xs text-white font-semibold">27%</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">12 Sukuk maturing | Avg yield: 9.8%</div>
                    </div>

                    {/* 91-180 days */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">91-180 Days</span>
                            <span className="text-lg font-bold text-gray-900">₦24.5B</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-yellow-500 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: '35%' }}>
                                <span className="text-xs text-white font-semibold">35%</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">15 Sukuk maturing | Avg yield: 10.3%</div>
                    </div>

                    {/* 181-365 days */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">181-365 Days</span>
                            <span className="text-lg font-bold text-gray-900">₦31.2B</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: '45%' }}>
                                <span className="text-xs text-white font-semibold">45%</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">18 Sukuk maturing | Avg yield: 10.8%</div>
                    </div>

                    {/* 1+ years */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">1+ Years</span>
                            <span className="text-lg font-bold text-gray-900">₦70.1B</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2" style={{ width: '100%' }}>
                                <span className="text-xs text-white font-semibold">100%</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">34 Sukuk (long-term) | Avg yield: 11.5%</div>
                    </div>
                </div>
            </div>

            {/* Portfolio Diversification Heatmap */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Diversification Heatmap</h2>
                <p className="text-sm text-gray-600 mb-4">Risk exposure across sectors and geographies</p>
                <div className="grid grid-cols-4 gap-3">
                    {/* Banking Sector */}
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300">
                        <div className="text-sm font-semibold text-blue-900">Banking</div>
                        <div className="text-2xl font-bold text-blue-900">28%</div>
                        <div className="text-xs text-blue-700 mt-1">₦43.9B</div>
                    </div>

                    {/* Real Estate */}
                    <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300">
                        <div className="text-sm font-semibold text-green-900">Real Estate</div>
                        <div className="text-2xl font-bold text-green-900">22%</div>
                        <div className="text-xs text-green-700 mt-1">₦34.5B</div>
                    </div>

                    {/* Infrastructure */}
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border-2 border-purple-300">
                        <div className="text-sm font-semibold text-purple-900">Infrastructure</div>
                        <div className="text-2xl font-bold text-purple-900">18%</div>
                        <div className="text-xs text-purple-700 mt-1">₦28.2B</div>
                    </div>

                    {/* Energy */}
                    <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg border-2 border-amber-300">
                        <div className="text-sm font-semibold text-amber-900">Energy</div>
                        <div className="text-2xl font-bold text-amber-900">15%</div>
                        <div className="text-xs text-amber-700 mt-1">₦23.5B</div>
                    </div>

                    {/* Manufacturing */}
                    <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg border-2 border-cyan-300">
                        <div className="text-sm font-semibold text-cyan-900">Manufacturing</div>
                        <div className="text-2xl font-bold text-cyan-900">12%</div>
                        <div className="text-xs text-cyan-700 mt-1">₦18.8B</div>
                    </div>

                    {/* Agriculture */}
                    <div className="p-4 bg-gradient-to-br from-lime-100 to-lime-200 rounded-lg border-2 border-lime-300">
                        <div className="text-sm font-semibold text-lime-900">Agriculture</div>
                        <div className="text-2xl font-bold text-lime-900">5%</div>
                        <div className="text-xs text-lime-700 mt-1">₦7.8B</div>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Diversification Score: 87/100 (Excellent)
                    </div>
                    <div className="text-xs text-gray-700 mt-1">
                        Well-balanced portfolio across multiple sectors. No single concentration risk above 30%.
                    </div>
                </div>
            </div>

            {/* Action Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio Action Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <h3 className="font-semibold text-amber-900">Upcoming Maturities</h3>
                        </div>
                        <p className="text-sm text-amber-800">₦12.3B maturing in 30 days. Prepare reinvestment strategy.</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-900">Rebalancing Opportunity</h3>
                        </div>
                        <p className="text-sm text-blue-800">Consider shifting 5% from Banking to Infrastructure for better yield.</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-green-900">Performance Review</h3>
                        </div>
                        <p className="text-sm text-green-800">Portfolio outperforming benchmark by 1.7%. Maintain current strategy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
