'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Shield,
    AlertTriangle,
    Monitor,
    Server,
    Lock,
    Wifi,
    Database,
    Eye,
    Activity,
    TrendingUp,
    TrendingDown,
    ArrowUp,
    ArrowDown,
    CheckCircle,
    XCircle,
    Clock,
    Users,
    Globe,
    Zap,
    ChevronDown,
    Calendar,
    Building2,
    Smartphone,
    CreditCard,
    FileText,
    Download,
    Bell,
    Settings,
    Cpu,
    HardDrive,
    Network,
    Bug,
    Lightbulb,
    Brain,
    Award
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import ProfessionalChart from '@/components/ui/ProfessionalChart';
import ProfessionalPieChart from '@/components/ui/ProfessionalPieChart';

interface ITKpiMetric {
    title: string;
    value: string;
    icon: string;
    status: 'good' | 'warning' | 'critical';
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

export default function ITSecurityPage() {
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'overview';

    // Filter states
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [branchRegion, setBranchRegion] = useState('All');
    const [systemType, setSystemType] = useState('Core Banking');
    const [period, setPeriod] = useState('Daily');
    const [uptimeSystem, setUptimeSystem] = useState('Core Banking');
    const [usageView, setUsageView] = useState('Transaction Volume');
    const [incidentView, setIncidentView] = useState('View by Severity');
    const [resolutionView, setResolutionView] = useState('Department');
    const [transactionChannel, setTransactionChannel] = useState('ATM');
    const [responseSystem, setResponseSystem] = useState('API');

    // Individual date range states for each graph section
    const [uptimeDateRange, setUptimeDateRange] = useState('Last 7 Days');
    const [usageDateRange, setUsageDateRange] = useState('Last 30 Days');
    const [incidentDateRange, setIncidentDateRange] = useState('Last 30 Days');
    const [resolutionDateRange, setResolutionDateRange] = useState('Last 30 Days');
    const [transactionDateRange, setTransactionDateRange] = useState('Last 30 Days');
    const [responseTimeDateRange, setResponseTimeDateRange] = useState('Last 24 Hours');

    // KPI Metrics
    const [kpiMetrics] = useState<ITKpiMetric[]>([
        {
            title: 'System Uptime',
            value: '99.93%',
            icon: '🟢',
            status: 'good'
        },
        {
            title: 'Avg Resolution Time',
            value: '42 mins',
            icon: '⏱',
            status: 'good'
        },
        {
            title: 'Critical Incidents',
            value: '2',
            icon: '⚠️',
            status: 'warning'
        },
        {
            title: 'IT Compliance Score',
            value: '97%',
            icon: '✅',
            status: 'good'
        }
    ]);

    // Data generation functions based on date range
    const generateUptimeData = (dateRange: string, system: string) => {
        const baseUptime = system === 'Core Banking' ? 99.90 : system === 'Mobile' ? 99.85 : 99.80;

        if (dateRange === 'Last 7 Days') {
            return Array.from({ length: 7 }, (_, i) => ({
                name: `Day ${i + 1}`,
                value: baseUptime + (Math.random() * 0.2 - 0.1)
            }));
        } else if (dateRange === 'Last 30 Days') {
            return Array.from({ length: 30 }, (_, i) => ({
                name: `Day ${i + 1}`,
                value: baseUptime + (Math.random() * 0.3 - 0.15)
            }));
        } else { // Last 90 Days
            return Array.from({ length: 12 }, (_, i) => ({
                name: `Week ${i + 1}`,
                value: baseUptime + (Math.random() * 0.4 - 0.2)
            }));
        }
    };

    const generateUsageData = (dateRange: string, view: string) => {
        const baseData = view === 'Transaction Volume'
            ? [
                { name: 'Mobile Banking', value: 45, percentage: 45, color: '#3B82F6' },
                { name: 'ATM Network', value: 30, percentage: 30, color: '#1E40AF' },
                { name: 'Internet Banking', value: 25, percentage: 25, color: '#1E3A8A' }
            ]
            : [
                { name: 'Core System', value: 40, percentage: 40, color: '#3B82F6' },
                { name: 'Mobile Services', value: 35, percentage: 35, color: '#1E40AF' },
                { name: 'Web Services', value: 25, percentage: 25, color: '#1E3A8A' }
            ];

        // Add some variance based on date range
        const variance = dateRange === 'Last 7 Days' ? 0.1 : dateRange === 'Last 30 Days' ? 0.15 : 0.2;
        return baseData.map(item => ({
            ...item,
            value: Math.max(10, item.value + (Math.random() * variance * 100 - variance * 50)),
            percentage: Math.max(10, item.percentage + (Math.random() * variance * 100 - variance * 50))
        }));
    };

    const generateIncidentData = (dateRange: string, view: string) => {
        const baseData = view === 'View by Severity'
            ? [
                { name: 'Critical', value: 2 },
                { name: 'High', value: 8 },
                { name: 'Medium', value: 15 },
                { name: 'Low', value: 23 }
            ]
            : [
                { name: 'Security', value: 12 },
                { name: 'Network', value: 18 },
                { name: 'Application', value: 10 },
                { name: 'Hardware', value: 8 }
            ];

        const multiplier = dateRange === 'Last 7 Days' ? 0.3 : dateRange === 'Last 30 Days' ? 1 : 3.2;
        return baseData.map(item => ({
            ...item,
            value: Math.max(1, Math.round(item.value * multiplier + (Math.random() * 5 - 2.5)))
        }));
    };

    const generateResolutionData = (dateRange: string, view: string) => {
        const baseData = view === 'Department'
            ? [
                { name: 'Network Team', value: 38 },
                { name: 'Database Team', value: 45 },
                { name: 'Application Team', value: 52 },
                { name: 'Security Team', value: 28 }
            ]
            : [
                { name: 'Hardware Issues', value: 42 },
                { name: 'Software Bugs', value: 55 },
                { name: 'Network Problems', value: 35 },
                { name: 'User Access', value: 25 }
            ];

        const variance = dateRange === 'Last 7 Days' ? 5 : dateRange === 'Last 30 Days' ? 10 : 15;
        return baseData.map(item => ({
            ...item,
            value: Math.max(15, item.value + (Math.random() * variance * 2 - variance))
        }));
    };

    const generateTransactionData = (dateRange: string, channel: string) => {
        const baseSuccess = channel === 'ATM' ? 98.2 : channel === 'Mobile' ? 98.5 : 98.8;

        if (dateRange === 'Last 7 Days') {
            return Array.from({ length: 7 }, (_, i) => ({
                name: `Day ${i + 1}`,
                value: baseSuccess + (Math.random() * 1.5 - 0.75)
            }));
        } else if (dateRange === 'Last 30 Days') {
            return Array.from({ length: 4 }, (_, i) => ({
                name: `Week ${i + 1}`,
                value: baseSuccess + (Math.random() * 2 - 1)
            }));
        } else { // Last 90 Days
            return Array.from({ length: 3 }, (_, i) => ({
                name: `Month ${i + 1}`,
                value: baseSuccess + (Math.random() * 2.5 - 1.25)
            }));
        }
    };

    const generateResponseTimeData = (dateRange: string, system: string) => {
        const baseResponseTime = system === 'API' ? 120 : system === 'Database' ? 200 : 150;

        if (dateRange === 'Last 24 Hours') {
            return Array.from({ length: 24 }, (_, i) => ({
                name: `${i.toString().padStart(2, '0')}:00`,
                value: baseResponseTime + (Math.random() * 100 - 50)
            }));
        } else if (dateRange === 'Last 7 Days') {
            return Array.from({ length: 7 }, (_, i) => ({
                name: `Day ${i + 1}`,
                value: baseResponseTime + (Math.random() * 80 - 40)
            }));
        } else { // Last 30 Days
            return Array.from({ length: 4 }, (_, i) => ({
                name: `Week ${i + 1}`,
                value: baseResponseTime + (Math.random() * 60 - 30)
            }));
        }
    };

    // Dynamic data based on current selections
    const systemUptimeData = generateUptimeData(uptimeDateRange, uptimeSystem);
    const systemUsageData = generateUsageData(usageDateRange, usageView);
    const incidentVolumeData = generateIncidentData(incidentDateRange, incidentView);
    const resolutionTimeData = generateResolutionData(resolutionDateRange, resolutionView);
    const transactionSuccessData = generateTransactionData(transactionDateRange, transactionChannel);
    const responseTimeData = generateResponseTimeData(responseTimeDateRange, responseSystem);

    // Main dashboard content (default overview tab)
    const renderOverviewTab = () => (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-blue-700 to-black rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
                                    <Monitor className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold text-white">
                                        💻 IT Operations Dashboard
                                    </h1>
                                    <p className="text-blue-100 font-medium mt-1">Islamic Banking Technology Center</p>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-green-100">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Overview */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-900 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Key Performance Indicators</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpiMetrics.map((metric, index) => (
                            <div key={index} className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-8 translate-x-8"></div>
                                <div className="relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                            <span className="text-2xl">{metric.icon}</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${metric.status === 'good' ? 'bg-green-500 text-white' :
                                            metric.status === 'warning' ? 'bg-yellow-500 text-white' :
                                                'bg-red-500 text-white'
                                            }`}>
                                            {metric.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">{metric.title}</h3>
                                    <div className="flex items-end gap-2">
                                        <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                                        <div className="pb-1">
                                            <div className={`w-2 h-2 rounded-full ${metric.status === 'good' ? 'bg-green-500' :
                                                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Real-time Status</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Health Monitoring */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-900 rounded-lg">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">System Health Monitoring</h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Database className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">System Usage Distribution</h3>
                                    <p className="text-sm text-gray-600">Current view: <span className="font-medium text-blue-600">{usageView}</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                    value={usageDateRange}
                                    onChange={(e) => setUsageDateRange(e.target.value)}
                                >
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                </select>
                                <select
                                    className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                    value={usageView}
                                    onChange={(e) => setUsageView(e.target.value)}
                                >
                                    <option>Transaction Volume</option>
                                    <option>Uptime Contribution</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Total Volume: <strong className="text-blue-600">{systemUsageData.reduce((sum, item) => sum + item.value, 0).toFixed(0)}M transactions</strong></span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-600 font-medium">Optimal Distribution</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <ProfessionalPieChart
                                data={systemUsageData}
                                showLegend={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Incident Management Analytics */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-900 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Incident Management Analytics</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Incident Volume Analysis</h3>
                                        <p className="text-sm text-gray-600">View by: <span className="font-medium text-red-600">{incidentView}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                        value={incidentDateRange}
                                        onChange={(e) => setIncidentDateRange(e.target.value)}
                                    >
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>Last 90 Days</option>
                                    </select>
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                        value={incidentView}
                                        onChange={(e) => setIncidentView(e.target.value)}
                                    >
                                        <option>View by Severity</option>
                                        <option>View by Category</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Incidents: <strong className="text-red-600">{incidentVolumeData.reduce((sum, item) => sum + item.value, 0)}</strong></span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <span className="text-red-600 font-medium">Critical: {incidentVolumeData.find(item => item.name === 'Critical')?.value || 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <ProfessionalChart
                                    data={incidentVolumeData}
                                    barColor="#3b82f6"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Resolution Time Analysis</h3>
                                        <p className="text-sm text-gray-600">Grouped by: <span className="font-medium text-orange-600">{resolutionView}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                        value={resolutionDateRange}
                                        onChange={(e) => setResolutionDateRange(e.target.value)}
                                    >
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>Last 90 Days</option>
                                    </select>
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                        value={resolutionView}
                                        onChange={(e) => setResolutionView(e.target.value)}
                                    >
                                        <option>Department</option>
                                        <option>Issue Type</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Average Time: <strong className="text-orange-600">{(resolutionTimeData.reduce((sum, item) => sum + item.value, 0) / resolutionTimeData.length).toFixed(0)} min</strong></span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-green-600 font-medium">Target: ≤ 45 min</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <ProfessionalChart
                                    data={resolutionTimeData}
                                    barColor="#60a5fa"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gray-900 rounded-lg">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Transaction Success Rate</h3>
                                        <p className="text-sm text-gray-600">Channel: <span className="font-medium text-green-600">{transactionChannel}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                        value={transactionDateRange}
                                        onChange={(e) => setTransactionDateRange(e.target.value)}
                                    >
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                        <option>Last 90 Days</option>
                                    </select>
                                    <select
                                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm"
                                        value={transactionChannel}
                                        onChange={(e) => setTransactionChannel(e.target.value)}
                                    >
                                        <option>ATM</option>
                                        <option>Mobile</option>
                                        <option>Web</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>Current Rate: <strong className="text-green-600">{(transactionSuccessData.reduce((sum, item) => sum + item.value, 0) / transactionSuccessData.length).toFixed(2)}%</strong></span>
                                    <span>Target: <strong className="text-blue-600">≥ 98.5%</strong></span>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <ProfessionalChart
                                    data={transactionSuccessData}
                                    barColor="#2563eb"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* AI Insight & Action Center */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            🧠 AI INSIGHT & ACTION CENTER
                        </h3>
                        <div className="flex items-center gap-3">
                            <Download className="w-5 h-5 text-indigo-600" />
                            <select className="text-sm border border-indigo-300 rounded-lg px-3 py-2 bg-white shadow-sm">
                                <option>Export Summary</option>
                                <option>PDF Report</option>
                                <option>Excel Spreadsheet</option>
                                <option>CSV Data</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-400">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Brain className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 mb-3 text-lg">Critical Infrastructure Alert</h4>
                                    <p className="text-blue-800 text-sm leading-relaxed mb-4">
                                        Core banking servers at 85% CPU utilization during peak hours. Immediate hardware scaling
                                        recommended to prevent service disruption. ROI projection: 340% in 6 months.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-blue-700 mb-2">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span className="font-semibold">Critical Priority</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-700">
                                        <Clock className="w-3 h-3" />
                                        <span>Updated 2 minutes ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-400">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-900 mb-3 text-lg">Security Enhancement</h4>
                                    <p className="text-green-800 text-sm leading-relaxed mb-4">
                                        Zero Trust Network Architecture deployment will reduce security breach risk by 89%.
                                        12 endpoint vulnerabilities identified and prioritized for immediate patching.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-green-700 mb-2">
                                        <Eye className="w-3 h-3" />
                                        <span className="font-semibold">High Priority</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-green-700">
                                        <Clock className="w-3 h-3" />
                                        <span>6-8 weeks implementation</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border-l-4 border-purple-400">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-purple-900 mb-3 text-lg">Performance Optimization</h4>
                                    <p className="text-purple-800 text-sm leading-relaxed mb-4">
                                        API response times can be improved by 67% through GraphQL federation and database
                                        optimization. Focus on Murabaha and Ijara contract processing optimization.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-purple-700 mb-2">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="font-semibold">High Impact</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-purple-700">
                                        <Clock className="w-3 h-3" />
                                        <span>4 weeks implementation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Automation Insights */}
                    <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            🤖 Automation Opportunities
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Automated Incident Response</p>
                                    <p className="text-sm text-gray-600">AI-powered classification and routing system</p>
                                    <p className="text-xs text-green-600 mt-1">Time savings: 4.5 hours/day</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Sharia Compliance Monitoring</p>
                                    <p className="text-sm text-gray-600">Automated Islamic banking transaction validation</p>
                                    <p className="text-xs text-blue-600 mt-1">Compliance accuracy: 95%</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Investment Insight Card - Stand Out Design */}
                        <div className="mt-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 opacity-10 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 border-2 border-yellow-400 shadow-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                                        <Brain className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <h4 className="text-xl font-black text-gray-900">🤖 AI Investment Insight</h4>
                                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full animate-pulse">
                                                LIVE
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-300 shadow-lg">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">Projected Annual Savings</p>
                                                <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    ₦89M
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs text-green-600 font-bold">+127% YoY</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-300 shadow-lg">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">Return on Investment</p>
                                                <p className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                                    340%
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Zap className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs text-orange-600 font-bold">Exceptional ROI</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-300 shadow-lg">
                                                <p className="text-xs text-gray-600 font-semibold mb-1">Break-Even Period</p>
                                                <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                                    8.5mo
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-bold">Fast Recovery</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-4 text-white">
                                            <div className="flex items-center justify-between flex-wrap gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                    <span className="text-sm font-bold">Timeline Projection:</span>
                                                </div>
                                                <div className="flex items-center gap-6 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                        <span className="font-semibold">Break-even: <span className="text-green-400">8.5 months</span></span>
                                                    </div>
                                                    <div className="w-px h-4 bg-white/30"></div>
                                                    <div className="flex items-center gap-2">
                                                        <Award className="w-4 h-4 text-yellow-400" />
                                                        <span className="font-semibold">Full ROI: <span className="text-yellow-400">18 months</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                                            <span className="italic">AI-powered analysis based on historical data, market trends, and implementation complexity</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Other tab render functions
    const renderHealthTab = () => (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-blue-700 to-black rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
                                    <Activity className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold text-white">System Health Monitoring</h1>
                                    <p className="text-blue-100 font-medium mt-1">Real-time Performance & Availability Dashboard</p>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-green-100">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Server className="w-6 h-6 text-gray-900" />
                        Core Systems Status
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-green-100">
                                    <Server className="w-7 h-7 text-green-600" />
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ONLINE</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Core Banking System</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">99.97%</p>
                            <p className="text-sm text-gray-600">Uptime (Last 30 days)</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Response Time:</span>
                                    <span className="font-semibold text-green-600">47ms</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-blue-100">
                                    <Smartphone className="w-7 h-7 text-blue-600" />
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ACTIVE</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Mobile Banking App</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">99.92%</p>
                            <p className="text-sm text-gray-600">Uptime (Last 30 days)</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Active Users:</span>
                                    <span className="font-semibold text-blue-600">45,203</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-purple-100">
                                    <CreditCard className="w-7 h-7 text-purple-600" />
                                </div>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">OPERATIONAL</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">ATM Network</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">99.85%</p>
                            <p className="text-sm text-gray-600">Uptime (Last 30 days)</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">ATMs Online:</span>
                                    <span className="font-semibold text-purple-600">348/350</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-amber-100">
                                    <Database className="w-7 h-7 text-amber-600" />
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">MAINTENANCE</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Database Cluster</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">99.88%</p>
                            <p className="text-sm text-gray-600">Uptime (Last 30 days)</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Next Maintenance:</span>
                                    <span className="font-semibold text-amber-600">Oct 15</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Server Resources */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-gray-900" />
                        Server Resource Utilization
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">CPU Usage</h3>
                                <span className="text-blue-600 text-2xl font-bold">73%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full" style={{ width: '73%' }}></div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Production Server 1:</span>
                                    <span className="font-semibold text-gray-900">68%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Production Server 2:</span>
                                    <span className="font-semibold text-gray-900">78%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Backup Server:</span>
                                    <span className="font-semibold text-gray-900">45%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Memory Usage</h3>
                                <span className="text-purple-600 text-2xl font-bold">68%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Capacity:</span>
                                    <span className="font-semibold text-gray-900">512 GB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Used:</span>
                                    <span className="font-semibold text-gray-900">348 GB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Available:</span>
                                    <span className="font-semibold text-green-600">164 GB</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Disk Usage</h3>
                                <span className="text-green-600 text-2xl font-bold">54%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" style={{ width: '54%' }}></div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Storage:</span>
                                    <span className="font-semibold text-gray-900">50 TB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Used:</span>
                                    <span className="font-semibold text-gray-900">27 TB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Free:</span>
                                    <span className="font-semibold text-green-600">23 TB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Performance */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Network className="w-6 h-6 text-gray-900" />
                        Network Performance
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Bandwidth Utilization</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Inbound Traffic</span>
                                        <span className="text-sm font-semibold text-blue-600">2.4 GB/s</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Outbound Traffic</span>
                                        <span className="text-sm font-semibold text-green-600">1.8 GB/s</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Peak Capacity:</span>
                                        <span className="font-semibold text-gray-900">10 GB/s</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Connection Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">Primary Data Center</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">ACTIVE</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">DR Site Connection</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">SYNCED</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">Branch Network</span>
                                    </div>
                                    <span className="text-xs font-semibold text-blue-600">85/85 ONLINE</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm font-medium text-gray-900">Cloud Services</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">CONNECTED</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Health Events */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Health Events
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">Scheduled maintenance completed successfully</p>
                                <p className="text-xs text-gray-600 mt-1">Database backup cluster - Oct 12, 2025 at 2:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">System performance optimization applied</p>
                                <p className="text-xs text-gray-600 mt-1">Core banking servers - Oct 11, 2025 at 11:45 PM</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">CPU spike detected and resolved automatically</p>
                                <p className="text-xs text-gray-600 mt-1">Production server 2 - Oct 11, 2025 at 3:30 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-blue-700 to-black rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold text-white">Security Monitoring</h1>
                                    <p className="text-blue-100 font-medium mt-1">Cybersecurity Threat Detection & Prevention</p>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-green-100">Security Status: Protected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Overview */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Posture Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-green-100">
                                    <Shield className="w-7 h-7 text-green-600" />
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIVE</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Firewall Status</h3>
                            <p className="text-3xl font-bold text-green-600 mb-1">Protected</p>
                            <p className="text-sm text-gray-600">All ports secured</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Rules Active:</span>
                                    <span className="font-semibold text-gray-900">1,247</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-red-100">
                                    <AlertTriangle className="w-7 h-7 text-red-600" />
                                </div>
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">TODAY</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Threats Blocked</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">23</p>
                            <p className="text-sm text-gray-600">Last 24 hours</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">This Month:</span>
                                    <span className="font-semibold text-red-600">684</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-blue-100">
                                    <Lock className="w-7 h-7 text-blue-600" />
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">SECURE</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Encryption Level</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">AES-256</p>
                            <p className="text-sm text-gray-600">Military-grade</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">All Data:</span>
                                    <span className="font-semibold text-blue-600">Encrypted</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-purple-100">
                                    <Eye className="w-7 h-7 text-purple-600" />
                                </div>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">MONITORING</span>
                            </div>
                            <h3 className="text-gray-700 text-base font-semibold mb-2">Active Scans</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">5</p>
                            <p className="text-sm text-gray-600">Running now</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Last Scan:</span>
                                    <span className="font-semibold text-gray-900">2 min ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Threat Intelligence */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Threat Intelligence Feed</h2>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                                <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-red-900">Critical: SQL Injection Attempt Blocked</h4>
                                        <span className="text-xs text-red-600 font-semibold">2 min ago</span>
                                    </div>
                                    <p className="text-sm text-red-800 mb-2">Multiple SQL injection attempts detected from IP 192.168.45.127. Source blocked automatically.</p>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">Attack Vector: SQL</span>
                                        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">Action: Blocked</span>
                                        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">Source: External</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                                <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-amber-900">High: Suspicious Login Activity Detected</h4>
                                        <span className="text-xs text-amber-600 font-semibold">15 min ago</span>
                                    </div>
                                    <p className="text-sm text-amber-800 mb-2">Failed login attempts from unusual location. Account temporarily locked for verification.</p>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded">Attack Vector: Brute Force</span>
                                        <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded">Action: Account Locked</span>
                                        <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded">User Notified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                <Eye className="w-6 h-6 text-blue-600 mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-blue-900">Medium: Port Scan Detected</h4>
                                        <span className="text-xs text-blue-600 font-semibold">1 hour ago</span>
                                    </div>
                                    <p className="text-sm text-blue-800 mb-2">Systematic port scanning activity detected. Source IP added to watchlist.</p>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">Attack Vector: Reconnaissance</span>
                                        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">Action: Monitored</span>
                                        <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">No Breach</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-green-900">Info: Security Patch Applied Successfully</h4>
                                        <span className="text-xs text-green-600 font-semibold">3 hours ago</span>
                                    </div>
                                    <p className="text-sm text-green-800 mb-2">Critical security updates installed on all production servers. Systems remain secure.</p>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">Type: Maintenance</span>
                                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">Status: Completed</span>
                                        <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded">Zero Downtime</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Compliance */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Compliance Status</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Compliance Standards</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-gray-900">PCI DSS 3.2.1</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">COMPLIANT</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-gray-900">ISO 27001:2013</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">CERTIFIED</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-gray-900">NDPR (Nigeria)</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">COMPLIANT</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium text-gray-900">AAOIFI Shariah Standards</span>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600">COMPLIANT</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Vulnerability Assessment</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Critical Vulnerabilities</span>
                                        <span className="text-sm font-semibold text-green-600">0</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">High Vulnerabilities</span>
                                        <span className="text-sm font-semibold text-amber-600">2</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Medium Vulnerabilities</span>
                                        <span className="text-sm font-semibold text-blue-600">8</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Low Vulnerabilities</span>
                                        <span className="text-sm font-semibold text-gray-600">15</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Next Scan:</span>
                                        <span className="font-semibold text-gray-900">Oct 13, 2025 - 2:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Access Control */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Access Control & Authentication</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">1,247</p>
                            <p className="text-sm text-gray-600">Active Users</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                            <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">98.3%</p>
                            <p className="text-sm text-gray-600">2FA Adoption</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-xl">
                            <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">24/7</p>
                            <p className="text-sm text-gray-600">SOC Monitoring</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderIncidentsTab = () => (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-blue-700 to-black rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
                                    <Bug className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-4xl font-bold text-white">Incident Management</h1>
                                    <p className="text-blue-100 font-medium mt-1">Track, Manage & Resolve IT Incidents</p>
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                                + New Incident
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-red-100">
                                    <AlertTriangle className="w-7 h-7 text-red-600" />
                                </div>
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">CRITICAL</span>
                            </div>
                            <h3 className="text-gray-600 text-base font-semibold mb-2">Critical Incidents</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">2</p>
                            <p className="text-sm text-gray-600">Active now</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>Requires immediate attention</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-amber-100">
                                    <Clock className="w-7 h-7 text-amber-600" />
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">OPEN</span>
                            </div>
                            <h3 className="text-gray-600 text-base font-semibold mb-2">Open Tickets</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">18</p>
                            <p className="text-sm text-gray-600">Awaiting resolution</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Clock className="w-3 h-3" />
                                    <span>Avg age: 2.5 hours</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-green-100">
                                    <CheckCircle className="w-7 h-7 text-green-600" />
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">RESOLVED</span>
                            </div>
                            <h3 className="text-gray-600 text-base font-semibold mb-2">Resolved Today</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">45</p>
                            <p className="text-sm text-gray-600">Tickets closed</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12% vs yesterday</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-blue-100">
                                    <Activity className="w-7 h-7 text-blue-600" />
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">METRIC</span>
                            </div>
                            <h3 className="text-gray-600 text-base font-semibold mb-2">Avg Resolution Time</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">42min</p>
                            <p className="text-sm text-gray-600">Response time</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <TrendingDown className="w-3 h-3" />
                                    <span>-8% improvement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Incidents Table */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Active Incidents</h2>
                            <div className="flex gap-2">
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white">
                                    <option>All Priorities</option>
                                    <option>Critical</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white">
                                    <option>All Categories</option>
                                    <option>Hardware</option>
                                    <option>Software</option>
                                    <option>Network</option>
                                    <option>Security</option>
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Title</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Priority</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Assigned To</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Age</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-blue-600">#INC-2847</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Database server high memory usage</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">CRITICAL</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">Infrastructure</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Database Team</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">In Progress</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">45 min</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-blue-600">#INC-2846</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">ATM network connectivity issues in Lagos branch</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">CRITICAL</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">Network</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Network Team</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">In Progress</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">1.2 hrs</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-blue-600">#INC-2845</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Mobile app login timeout errors</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">HIGH</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">Application</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">App Dev Team</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Investigating</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">2.5 hrs</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-blue-600">#INC-2844</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Printer offline in Abuja head office</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">MEDIUM</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">Hardware</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">IT Support</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Assigned</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">35 min</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-blue-600">#INC-2843</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Email server slow response times</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">HIGH</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">Infrastructure</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">System Admin</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">In Progress</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">1.8 hrs</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm font-medium text-blue-600">#INC-2842</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">User account access request - new employee</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">LOW</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">Access Control</td>
                                        <td className="py-4 px-4 text-sm text-gray-900">Security Team</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">Pending</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">20 min</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Incident Categories & Resolution Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Incidents by Category (This Month)</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Network Issues</span>
                                    <span className="text-sm font-semibold text-gray-900">45 incidents</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Application Errors</span>
                                    <span className="text-sm font-semibold text-gray-900">32 incidents</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Hardware Failures</span>
                                    <span className="text-sm font-semibold text-gray-900">28 incidents</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Security Alerts</span>
                                    <span className="text-sm font-semibold text-gray-900">18 incidents</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">User Support</span>
                                    <span className="text-sm font-semibold text-gray-900">67 incidents</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Average Resolution Time by Priority</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Critical</p>
                                    <p className="text-xs text-gray-600">P1 - Immediate Response</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-red-600">28 min</p>
                                    <p className="text-xs text-gray-600">SLA: 30 min</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">High</p>
                                    <p className="text-xs text-gray-600">P2 - Urgent Response</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-orange-600">1.2 hrs</p>
                                    <p className="text-xs text-gray-600">SLA: 2 hrs</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Medium</p>
                                    <p className="text-xs text-gray-600">P3 - Standard Response</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-yellow-600">4.5 hrs</p>
                                    <p className="text-xs text-gray-600">SLA: 8 hrs</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Low</p>
                                    <p className="text-xs text-gray-600">P4 - Planned Response</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-blue-600">12 hrs</p>
                                    <p className="text-xs text-gray-600">SLA: 24 hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalyticsTab = () => (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                    <p className="text-gray-600">Comprehensive system performance metrics and analysis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Cpu className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-blue-600 text-sm font-medium">OPTIMAL</span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">CPU Performance</h3>
                    <p className="text-2xl font-bold text-gray-900">73%</p>
                    <p className="text-xs text-gray-500">Average utilization</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-green-100">
                            <HardDrive className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-green-600 text-sm font-medium">HEALTHY</span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Storage I/O</h3>
                    <p className="text-2xl font-bold text-gray-900">1.2GB/s</p>
                    <p className="text-xs text-gray-500">Throughput</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <Network className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-purple-600 text-sm font-medium">STABLE</span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">Network Traffic</h3>
                    <p className="text-2xl font-bold text-gray-900">4.8GB/hr</p>
                    <p className="text-xs text-gray-500">Current load</p>
                </div>
            </div>
        </div>
    );

    const renderAIInsightsTab = () => (
        <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">AI Insights & Strategic IT Recommendations</h1>
                    <p className="text-gray-600">Advanced analytics and actionable recommendations for IT operations enhancement</p>
                </div>
            </div>

            {/* Priority Recommendations */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🎯 Priority Recommendations
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border-l-4 border-red-400">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-900 mb-2">Critical Infrastructure Upgrade</h4>
                                <p className="text-red-800 text-sm mb-3">
                                    Core banking servers showing 85% CPU utilization during peak hours. Recommend immediate
                                    hardware scaling to prevent potential downtime. Estimated cost: ₦45M, ROI: 340% in 6 months.
                                </p>
                                <div className="flex gap-2 mb-3">
                                    <span className="inline-block px-3 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                                        Critical Priority
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                                        2-3 weeks implementation
                                    </span>
                                </div>
                                <p className="text-xs text-red-700">
                                    ⚡ Immediate action required: Schedule vendor meeting this week
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border-l-4 border-orange-400">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Shield className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-900 mb-2">Security Architecture Enhancement</h4>
                                <p className="text-orange-800 text-sm mb-3">
                                    Deploy Zero Trust Network Architecture across all Islamic banking systems.
                                    Current security gaps detected in 12 endpoints. Implementation will reduce breach risk by 89%.
                                </p>
                                <div className="flex gap-2 mb-3">
                                    <span className="inline-block px-3 py-1 bg-orange-200 text-orange-800 text-xs rounded-full">
                                        High Priority
                                    </span>
                                    <span className="inline-block px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                                        6-8 weeks rollout
                                    </span>
                                </div>
                                <p className="text-xs text-orange-700">
                                    🔒 Compliance requirement: PCI DSS & Islamic banking standards
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Optimization */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    ⚡ Performance Optimization
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-400">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 mb-2">Database Optimization</h4>
                                <p className="text-blue-800 text-sm mb-3">
                                    Query performance can be improved by 67% through strategic indexing and partitioning of
                                    transaction tables. Focus on Murabaha and Ijara contract processing.
                                </p>
                                <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                                    Medium Impact
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-400">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-green-900 mb-2">API Response Enhancement</h4>
                                <p className="text-green-800 text-sm mb-3">
                                    Implement GraphQL federation for mobile banking APIs. Current REST endpoints
                                    can be optimized to reduce payload size by 45% and improve mobile app performance.
                                </p>
                                <span className="inline-block px-3 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                                    High Impact - Customer Experience
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border-l-4 border-purple-400">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Globe className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-purple-900 mb-2">CDN Implementation</h4>
                                <p className="text-purple-800 text-sm mb-3">
                                    Deploy Content Delivery Network for internet banking portal. Will reduce page
                                    load times from 3.2s to 0.8s across Nigeria's major cities.
                                </p>
                                <span className="inline-block px-3 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">
                                    Quick Win - 2 weeks
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Automation Opportunities */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🤖 Automation Opportunities
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Recommended Automation Tasks</h4>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Automated Incident Response</p>
                                        <p className="text-sm text-gray-600">Deploy AI-powered incident classification and routing system</p>
                                        <p className="text-xs text-green-600 mt-1">Estimated time savings: 4.5 hours/day</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Sharia Compliance Monitoring</p>
                                        <p className="text-sm text-gray-600">Automated validation of Islamic banking transactions</p>
                                        <p className="text-xs text-blue-600 mt-1">Risk reduction: 95% compliance accuracy</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                    <div>
                                        <p className="font-medium text-gray-900">Predictive Maintenance</p>
                                        <p className="text-sm text-gray-600">ATM and core system health monitoring with ML algorithms</p>
                                        <p className="text-xs text-purple-600 mt-1">Downtime prevention: Up to 78% reduction</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Implementation Roadmap</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                    <div>
                                        <p className="font-medium text-blue-900">Phase 1: Infrastructure Assessment</p>
                                        <p className="text-sm text-blue-700">Complete current system audit - 2 weeks</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                    <div>
                                        <p className="font-medium text-orange-900">Phase 2: Security Hardening</p>
                                        <p className="text-sm text-orange-700">Deploy Zero Trust architecture - 6 weeks</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                    <div>
                                        <p className="font-medium text-green-900">Phase 3: Performance Optimization</p>
                                        <p className="text-sm text-green-700">Database and API improvements - 4 weeks</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                                    <div>
                                        <p className="font-medium text-purple-900">Phase 4: Automation Deployment</p>
                                        <p className="text-sm text-purple-700">AI-powered monitoring systems - 8 weeks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cost-Benefit Analysis */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-gray-400">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    💰 Investment & ROI Analysis
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-2">Total Investment Required</h4>
                        <p className="text-2xl font-bold text-blue-600">₦127M</p>
                        <p className="text-sm text-gray-600">Over 6 months implementation</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-2">Expected Annual Savings</h4>
                        <p className="text-2xl font-bold text-green-600">₦89M</p>
                        <p className="text-sm text-gray-600">Operational cost reduction</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-2">Break-even Period</h4>
                        <p className="text-2xl font-bold text-purple-600">8.5 months</p>
                        <p className="text-sm text-gray-600">Full ROI in 18 months</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Render content based on current tab
    const renderContent = () => {
        switch (currentTab) {
            case 'health':
                return renderHealthTab();
            case 'security':
                return renderSecurityTab();
            case 'incidents':
                return renderIncidentsTab();
            case 'analytics':
                return renderAnalyticsTab();
            case 'ai-insights':
                return renderAIInsightsTab();
            default:
                return renderOverviewTab();
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar role="it-security" />

            <div className="flex-1 overflow-auto">
                {renderContent()}
            </div>
        </div>
    );
}
