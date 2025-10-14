'use client';

import { useState } from 'react';
import { Calculator, Percent, DollarSign, TrendingUp, Info } from 'lucide-react';

export default function ProfitSharingCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState<string>('1000000');
  const [investmentPeriod, setInvestmentPeriod] = useState<string>('12');
  const [profitRatio, setProfitRatio] = useState<string>('60');
  const [expectedReturn, setExpectedReturn] = useState<string>('8.5');

  const calculate = () => {
    const principal = parseFloat(investmentAmount) || 0;
    const months = parseFloat(investmentPeriod) || 0;
    const ratio = parseFloat(profitRatio) || 0;
    const returnRate = parseFloat(expectedReturn) || 0;

    const totalProfit = (principal * returnRate * months) / (100 * 12);
    const customerShare = (totalProfit * ratio) / 100;
    const bankShare = totalProfit - customerShare;
    const finalAmount = principal + customerShare;
    const effectiveRate = months > 0 ? (customerShare / principal) * (12 / months) * 100 : 0;

    return {
      totalProfit,
      customerShare,
      bankShare,
      finalAmount,
      effectiveRate,
    };
  };

  const results = calculate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Profit-Sharing Calculator</h2>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-900">
              <strong>Shariah-Compliant Profit Sharing:</strong> Unlike conventional interest-based banking,
              Smart Bank uses a profit-and-loss sharing model where returns are based on actual business
              performance, not predetermined interest rates.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Investment Parameters</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount (NGN)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Period (Months)
            </label>
            <div className="relative">
              <input
                type="number"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter period"
                min="1"
                max="120"
              />
            </div>
            <input
              type="range"
              min="1"
              max="120"
              value={investmentPeriod}
              onChange={(e) => setInvestmentPeriod(e.target.value)}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Profit Ratio (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={profitRatio}
                onChange={(e) => setProfitRatio(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter ratio"
                min="0"
                max="100"
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={profitRatio}
              onChange={(e) => setProfitRatio(e.target.value)}
              className="w-full mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bank Share: {100 - parseFloat(profitRatio || '0')}%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Annual Return Rate (%)
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter expected return"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2 opacity-90">Final Amount</h3>
            <p className="text-4xl font-bold mb-1">{formatCurrency(results.finalAmount)}</p>
            <p className="text-blue-100 text-sm">Total value at maturity</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profit Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Profit Generated</p>
                  <p className="text-2xl font-bold text-blue-700">{formatCurrency(results.totalProfit)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-700" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div>
                  <p className="text-sm text-gray-600">Your Share ({profitRatio}%)</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.customerShare)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Bank Share ({100 - parseFloat(profitRatio || '0')}%)</p>
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(results.bankShare)}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Percent className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Effective Rate</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-blue-700">{results.effectiveRate.toFixed(2)}%</p>
              <p className="text-sm text-gray-600">per annum</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is your effective annual return based on the profit-sharing ratio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
