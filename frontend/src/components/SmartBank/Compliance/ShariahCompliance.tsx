'use client';

import { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, FileText, Eye, Download } from 'lucide-react';

interface ComplianceCheck {
	id: string;
	transactionId: string;
	checkType: string;
	result: 'passed' | 'failed' | 'review';
	timestamp: string;
	details: string;
	amount: number;
	flaggedReason?: string;
}

export default function ShariahCompliance() {
	const [checks] = useState<ComplianceCheck[]>([
		{
			id: 'CHK001',
			transactionId: 'TXN001234567',
			checkType: 'Interest-Free Verification',
			result: 'passed',
			timestamp: '2025-10-02 14:23:50',
			details: 'Transaction structure verified as profit-sharing compliant',
			amount: 250000,
		},
		{
			id: 'CHK002',
			transactionId: 'TXN001234568',
			checkType: 'Halal Business Verification',
			result: 'passed',
			timestamp: '2025-10-02 14:22:25',
			details: 'Merchant verified against Shariah-compliant business registry',
			amount: 45600,
		},
		{
			id: 'CHK003',
			transactionId: 'TXN001234569',
			checkType: 'Riba (Usury) Check',
			result: 'passed',
			timestamp: '2025-10-02 14:21:10',
			details: 'No interest-based components detected',
			amount: 1500000,
		},
		{
			id: 'CHK004',
			transactionId: 'TXN001234570',
			checkType: 'Gharar (Uncertainty) Assessment',
			result: 'review',
			timestamp: '2025-10-02 14:19:50',
			details: 'Transaction terms require manual review for clarity',
			amount: 50000,
			flaggedReason: 'Ambiguous contract terms detected',
		},
		{
			id: 'CHK005',
			transactionId: 'TXN001234571',
			checkType: 'Asset-Backed Verification',
			result: 'passed',
			timestamp: '2025-10-02 14:18:35',
			details: 'Transaction backed by tangible asset ownership',
			amount: 500000,
		},
		{
			id: 'CHK006',
			transactionId: 'TXN001234572',
			checkType: 'Prohibited Activity Screening',
			result: 'failed',
			timestamp: '2025-10-02 14:17:05',
			details: 'Merchant flagged in non-compliant business category',
			amount: 890000,
			flaggedReason: 'Merchant involved in alcohol distribution',
		},
	]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const getResultIcon = (result: string) => {
		switch (result) {
			case 'passed':
				return <CheckCircle className="w-6 h-6 text-green-600" />;
			case 'failed':
				return <XCircle className="w-6 h-6 text-red-600" />;
			case 'review':
				return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
			default:
				return null;
		}
	};

	const getResultColor = (result: string) => {
		switch (result) {
			case 'passed':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'failed':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'review':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const passedCount = checks.filter(c => c.result === 'passed').length;
	const failedCount = checks.filter(c => c.result === 'failed').length;
	const reviewCount = checks.filter(c => c.result === 'review').length;
	const complianceRate = ((passedCount / checks.length) * 100).toFixed(1);

	return (
		<div className="space-y-8">
			<div className="flex items-center gap-3 mb-2">
				<Shield className="w-7 h-7 text-blue-700" />
				<h2 className="text-2xl font-bold text-gray-900">Shariah Audit & Review</h2>
			</div>
			<p className="text-gray-700 mb-6 max-w-2xl">This section covers product screening, transaction monitoring, and audit results for Shariah compliance, in line with CBN and AAOIFI standards.</p>

			{/* Product Audit Table (Demo) */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
				<div className="flex items-center gap-2 mb-4">
					<FileText className="w-5 h-5 text-blue-700" />
					<h3 className="text-lg font-bold text-gray-900">Product Screening & Audit Results</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="bg-blue-50 text-blue-900">
								<th className="px-4 py-2 text-left font-semibold">Product</th>
								<th className="px-4 py-2 text-left font-semibold">Type</th>
								<th className="px-4 py-2 text-left font-semibold">Last Audit</th>
								<th className="px-4 py-2 text-left font-semibold">Status</th>
								<th className="px-4 py-2 text-left font-semibold">Notes</th>
							</tr>
						</thead>
						<tbody>
							{/* Demo data */}
							<tr className="border-b border-gray-100">
								<td className="px-4 py-2 font-medium text-gray-900">Murabaha Financing</td>
								<td className="px-4 py-2 text-gray-700">Asset-based</td>
								<td className="px-4 py-2 text-gray-700">2025-09-10</td>
								<td className="px-4 py-2 text-green-700 font-semibold">Compliant</td>
								<td className="px-4 py-2 text-gray-700">No issues</td>
							</tr>
							<tr className="border-b border-gray-100">
								<td className="px-4 py-2 font-medium text-gray-900">Ijara Lease</td>
								<td className="px-4 py-2 text-gray-700">Leasing</td>
								<td className="px-4 py-2 text-gray-700">2025-06-15</td>
								<td className="px-4 py-2 text-green-700 font-semibold">Compliant</td>
								<td className="px-4 py-2 text-gray-700">Reviewed contract terms</td>
							</tr>
							<tr className="border-b border-gray-100">
								<td className="px-4 py-2 font-medium text-gray-900">Mudarabah Investment</td>
								<td className="px-4 py-2 text-gray-700">Profit-sharing</td>
								<td className="px-4 py-2 text-gray-700">2025-03-05</td>
								<td className="px-4 py-2 text-yellow-700 font-semibold">Review</td>
								<td className="px-4 py-2 text-gray-700">Pending board approval</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Transaction Monitoring & Compliance Checks */}
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="p-6 border-b border-gray-200">
					<h3 className="text-xl font-bold text-gray-900">Recent Transaction Compliance Checks</h3>
				</div>
				<div className="divide-y divide-gray-200">
					{checks.map((check) => (
						<div key={check.id} className="p-6 hover:bg-gray-50 transition-colors">
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-start gap-4">
									<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${check.result === 'passed' ? 'bg-green-100' :
										check.result === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
										}`}>
										{getResultIcon(check.result)}
									</div>
									<div>
										<h4 className="text-lg font-bold text-gray-900">{check.checkType}</h4>
										<div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
											<span className="flex items-center gap-1">
												<FileText className="w-4 h-4" />
												{check.transactionId}
											</span>
											<span>•</span>
											<span>{check.timestamp}</span>
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="text-lg font-bold text-gray-900">{formatCurrency(check.amount)}</p>
									<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 border ${getResultColor(check.result)}`}>
										{check.result.toUpperCase()}
									</span>
								</div>
							</div>

							<div className="ml-16">
								<p className="text-sm text-gray-700 mb-2">{check.details}</p>
								{check.flaggedReason && (
									<div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
										<AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
										<div>
											<p className="text-xs font-semibold text-red-800">Flagged Reason:</p>
											<p className="text-xs text-red-700">{check.flaggedReason}</p>
										</div>
									</div>
								)}
								<div className="flex gap-2 mt-3">
									<button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100 transition-colors flex items-center gap-1">
										<Eye className="w-3 h-3" />
										View Full Report
									</button>
									{check.result === 'review' && (
										<button className="px-3 py-1.5 bg-green-50 text-green-600 rounded text-sm hover:bg-green-100 transition-colors">
											Approve
										</button>
									)}
									{check.result === 'failed' && (
										<button className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors">
											Block Transaction
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
