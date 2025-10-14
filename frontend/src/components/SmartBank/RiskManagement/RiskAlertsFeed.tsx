'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CreditCard, ShieldX, MapPin, ChevronDown, Search, X, CheckCircle, User, Clock, FileText, ArrowUpDown, Calendar } from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'Fraud' | 'AML' | 'Credit' | 'Operational';
  summary: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'assigned' | 'resolved';
  assignedTo?: string;
  details?: string;
  impactAmount?: string;
  location: string;
}

export default function RiskAlertsFeed() {
  const [allAlerts, setAllAlerts] = useState<AlertItem[]>([
    { id: 'a-1001', type: 'Fraud', summary: 'Pattern: Rapid transfers across 3 accounts', time: '2m ago', severity: 'high', status: 'new', impactAmount: '₦2.3M', location: 'Lagos HQ', details: 'Detected unusual transfer pattern involving accounts #4521, #8832, and #9021. Transfers totaling ₦2.3M made within 15-minute window. Recommend immediate account freeze and customer contact.' },
    { id: 'a-1002', type: 'Credit', summary: 'PD spike for SME segment in Lagos region', time: '12m ago', severity: 'medium', status: 'acknowledged', location: 'Lagos', details: 'Probability of default increased by 0.8% for SME loans in Lagos area over past 30 days. Affects 47 active loans totaling ₦124M. Recommend portfolio review and enhanced monitoring.' },
    { id: 'a-1003', type: 'AML', summary: 'Possible structuring detected (SAR suggested)', time: '25m ago', severity: 'high', status: 'assigned', assignedTo: 'Compliance Team', impactAmount: '₦850K', location: 'Abuja Branch', details: 'Customer made 8 deposits just below ₦500K threshold over 3 days. Total: ₦850K. Pattern matches structuring behavior. SAR filing recommended for regulatory review.' },
    { id: 'a-1004', type: 'Operational', summary: 'System downtime affecting risk calculations', time: '45m ago', severity: 'high', status: 'new', location: 'IT Data Center', details: 'Risk calculation engine experienced 12-minute outage. VaR and credit scoring temporarily unavailable. All systems restored. Recommend batch recalculation of missed updates.' },
    { id: 'a-1005', type: 'Credit', summary: 'Corporate client credit rating downgrade', time: '1h ago', severity: 'medium', status: 'assigned', assignedTo: 'Risk Officer', impactAmount: '₦45M', location: 'Port Harcourt', details: 'External rating agency downgraded client from BBB to BB. Outstanding exposure: ₦45M. Covenant review required. Consider additional collateral or exposure reduction.' },
    { id: 'a-1006', type: 'Fraud', summary: 'Card cloning suspected - multiple locations', time: '2h ago', severity: 'high', status: 'resolved', location: 'Multiple', details: 'Debit card used in Lagos and Kano within 20 minutes. Card blocked. Customer confirmed unauthorized transaction. ₦87K recovered.' },
    { id: 'a-1007', type: 'AML', summary: 'High-risk country transaction flagged', time: '3h ago', severity: 'low', status: 'acknowledged', impactAmount: '$12K', location: 'Lagos HQ', details: 'Wire transfer to sanctioned jurisdiction flagged for review. Amount: $12,000. Enhanced due diligence in progress.' },
    { id: 'a-1008', type: 'Credit', summary: 'Retail loan early delinquency trend', time: '4h ago', severity: 'medium', status: 'new', location: 'Nationwide', details: '15% increase in 30-day delinquencies for retail auto loans. Regional concentration in South-East. Recommend collection strategy review.' },
  ]);

  const [filteredAlerts, setFilteredAlerts] = useState<AlertItem[]>(allAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'severity'>('time');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today');

  // Filter and sort alerts
  useEffect(() => {
    let filtered = [...allAlerts];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(a =>
        a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(a => a.severity === severityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Sort
    if (sortBy === 'severity') {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    }

    setFilteredAlerts(filtered);
  }, [searchTerm, severityFilter, typeFilter, statusFilter, sortBy, allAlerts, dateRange]);

  const acknowledgeAlert = (id: string) => {
    setAllAlerts(prev => prev.map(a =>
      a.id === id && a.status === 'new' ? { ...a, status: 'acknowledged' } : a
    ));
  };

  const assignAlert = (id: string, assignee: string) => {
    setAllAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'assigned', assignedTo: assignee } : a
    ));
  };

  const resolveAlert = (id: string) => {
    setAllAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'resolved' } : a
    ));
  };

  const dismissAlert = (id: string) => {
    setAllAlerts(prev => prev.filter(a => a.id !== id));
    if (selectedAlert?.id === id) setSelectedAlert(null);
  };

  const color = (sev: AlertItem['severity']) => sev === 'high' ? 'text-rose-700 bg-rose-50' : sev === 'medium' ? 'text-yellow-700 bg-yellow-50' : 'text-gray-700 bg-gray-50';

  const statusColor = (status: AlertItem['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-700';
      case 'assigned': return 'bg-purple-100 text-purple-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const badge = (sev: AlertItem['severity']) => sev === 'high'
    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">High</span>
    : sev === 'medium'
      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">Medium</span>
      : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">Low</span>;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Alerts</p>
          <p className="text-2xl font-bold text-gray-900">{allAlerts.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">High Priority</p>
          <p className="text-2xl font-bold text-rose-600">{allAlerts.filter(a => a.severity === 'high').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Unassigned</p>
          <p className="text-2xl font-bold text-blue-600">{allAlerts.filter(a => a.status === 'new').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Resolved Today</p>
          <p className="text-2xl font-bold text-green-600">{allAlerts.filter(a => a.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Severity Filter */}
          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="Fraud">Fraud</option>
              <option value="AML">AML</option>
              <option value="Credit">Credit</option>
              <option value="Operational">Operational</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 font-medium hover:bg-slate-100 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortBy(sortBy === 'time' ? 'severity' : 'time')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium hover:bg-slate-100 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortBy === 'time' ? 'Time' : 'Severity'}
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredAlerts.length}</span> of <span className="font-semibold">{allAlerts.length}</span> alerts
        </p>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No alerts match your filters</p>
          </div>
        ) : (
          filteredAlerts.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color(a.severity)} flex-shrink-0`}>
                  {a.type === 'Fraud' ? <CreditCard className="w-6 h-6" /> :
                    a.type === 'AML' ? <ShieldX className="w-6 h-6" /> :
                      a.type === 'Operational' ? <AlertTriangle className="w-6 h-6" /> :
                        <AlertTriangle className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-gray-900">{a.type} Alert</span>
                      {badge(a.severity)}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColor(a.status)}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {a.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{a.summary}</p>

                  <div className="flex items-center gap-3 mb-3 flex-wrap text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {a.location}
                    </span>
                    {a.impactAmount && (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                        Impact: {a.impactAmount}
                      </span>
                    )}
                    {a.assignedTo && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {a.assignedTo}
                      </span>
                    )}
                    <span className="text-gray-400">ID: {a.id}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedAlert(a)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      View Details
                    </button>

                    {a.status === 'new' && (
                      <button
                        onClick={() => acknowledgeAlert(a.id)}
                        className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {(a.status === 'new' || a.status === 'acknowledged') && (
                      <button
                        onClick={() => assignAlert(a.id, 'Risk Team')}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <User className="w-3 h-3" />
                        Assign
                      </button>
                    )}

                    {a.status !== 'resolved' && (
                      <button
                        onClick={() => resolveAlert(a.id)}
                        className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Resolve
                      </button>
                    )}

                    <button
                      onClick={() => dismissAlert(a.id)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )))}
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedAlert(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedAlert.type} Alert</h2>
                  {badge(selectedAlert.severity)}
                  <span className={`text-sm px-3 py-1 rounded-full font-semibold ${statusColor(selectedAlert.status)}`}>
                    {selectedAlert.status.charAt(0).toUpperCase() + selectedAlert.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Alert ID: {selectedAlert.id}</p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                <p className="text-gray-700">{selectedAlert.summary}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
                <p className="text-gray-700">{selectedAlert.details || 'No additional details available.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedAlert.location}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time</h3>
                  <p className="text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedAlert.time}
                  </p>
                </div>
                {selectedAlert.impactAmount && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Financial Impact</h3>
                    <p className="text-gray-700 font-bold text-rose-600">{selectedAlert.impactAmount}</p>
                  </div>
                )}
                {selectedAlert.assignedTo && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Assigned To</h3>
                    <p className="text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedAlert.assignedTo}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recommended Actions
                </h3>
                <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                  {selectedAlert.type === 'Fraud' && (
                    <>
                      <li>Freeze affected accounts immediately</li>
                      <li>Contact customer for verification</li>
                      <li>Review transaction patterns</li>
                      <li>File incident report</li>
                    </>
                  )}
                  {selectedAlert.type === 'AML' && (
                    <>
                      <li>Conduct enhanced due diligence</li>
                      <li>Prepare Suspicious Activity Report (SAR)</li>
                      <li>Review customer profile and history</li>
                      <li>Notify compliance officer</li>
                    </>
                  )}
                  {selectedAlert.type === 'Credit' && (
                    <>
                      <li>Review credit exposure and limits</li>
                      <li>Update risk rating</li>
                      <li>Consider additional collateral</li>
                      <li>Schedule portfolio review meeting</li>
                    </>
                  )}
                  {selectedAlert.type === 'Operational' && (
                    <>
                      <li>Assess system impact and recovery</li>
                      <li>Document incident details</li>
                      <li>Implement corrective measures</li>
                      <li>Update risk register</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex gap-3">
                {selectedAlert.status === 'new' && (
                  <button
                    onClick={() => { acknowledgeAlert(selectedAlert.id); setSelectedAlert(null); }}
                    className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    Acknowledge Alert
                  </button>
                )}
                {(selectedAlert.status === 'new' || selectedAlert.status === 'acknowledged') && (
                  <button
                    onClick={() => { assignAlert(selectedAlert.id, 'Risk Team'); setSelectedAlert(null); }}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Assign to Team
                  </button>
                )}
                {selectedAlert.status !== 'resolved' && (
                  <button
                    onClick={() => { resolveAlert(selectedAlert.id); setSelectedAlert(null); }}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
