'use client';

import { useState } from 'react';
import { FileText, TrendingUp, Calendar, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface Sukuk {
  id: string;
  name: string;
  issuer: string;
  maturityDate: string;
  faceValue: number;
  currentValue: number;
  profitRate: number;
  status: 'active' | 'maturing' | 'matured';
  rating: string;
  sectorType: string;
}

export default function SukukManagement() {
  const [sukukPortfolio] = useState<Sukuk[]>([
    {
      id: 'SUK001',
      name: 'Nigerian Sovereign Sukuk 2025',
      issuer: 'Federal Government of Nigeria',
      maturityDate: '2025-12-31',
      faceValue: 5000000000,
      currentValue: 5125000000,
      profitRate: 7.5,
      status: 'active',
      rating: 'AA-',
      sectorType: 'Government',
    },
    {
      id: 'SUK002',
      name: 'Dangote Cement Sukuk',
      issuer: 'Dangote Cement Plc',
      maturityDate: '2026-06-30',
      faceValue: 3500000000,
      currentValue: 3612000000,
      profitRate: 8.2,
      status: 'active',
      rating: 'A+',
      sectorType: 'Manufacturing',
    },
    {
      id: 'SUK003',
      name: 'Infrastructure Development Sukuk',
      issuer: 'Lagos State Government',
      maturityDate: '2025-10-15',
      faceValue: 2800000000,
      currentValue: 2856000000,
      profitRate: 7.8,
      status: 'maturing',
      rating: 'A',
      sectorType: 'Infrastructure',
    },
    {
      id: 'SUK004',
      name: 'BUA Foods Islamic Bond',
      issuer: 'BUA Foods Plc',
      maturityDate: '2027-03-20',
      faceValue: 4200000000,
      currentValue: 4326000000,
      profitRate: 8.5,
      status: 'active',
      rating: 'A+',
      sectorType: 'Agriculture',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maturing':
        return 'bg-yellow-100 text-yellow-800';
      case 'matured':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalInvestment = sukukPortfolio.reduce((sum, sukuk) => sum + sukuk.faceValue, 0);
  const totalCurrentValue = sukukPortfolio.reduce((sum, sukuk) => sum + sukuk.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvestment;
  const gainPercentage = ((totalGain / totalInvestment) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sukuk Portfolio Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Sukuk
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <span className="text-sm font-medium text-gray-500">Total Investment</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvestment)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-blue-700" />
            <span className="text-sm font-medium text-gray-500">Current Value</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCurrentValue)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-black">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-black" />
            <span className="text-sm font-medium text-gray-500">Total Gain</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            {formatCurrency(totalGain)} ({gainPercentage}%)
          </p>
        </div>
      </div>

      {/* Sukuk List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Active Sukuk Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sukuk Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issuer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maturity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sukukPortfolio.map((sukuk) => (
                <tr key={sukuk.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sukuk.name}</div>
                        <div className="text-xs text-gray-500">{sukuk.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sukuk.issuer}</div>
                    <div className="text-xs text-gray-500">{sukuk.sectorType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(sukuk.faceValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(sukuk.currentValue)}
                    </div>
                    <div className="text-xs text-green-500">
                      +{(((sukuk.currentValue - sukuk.faceValue) / sukuk.faceValue) * 100).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sukuk.profitRate}%</div>
                    <div className="text-xs text-gray-500">Rating: {sukuk.rating}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {new Date(sukuk.maturityDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sukuk.status)}`}>
                      {sukuk.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
