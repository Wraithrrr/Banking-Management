'use client';

import Link from 'next/link';
import { Building2, Shield, FileCheck, ArrowRight } from 'lucide-react';

export default function SmartBankHome() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[#0A1F44] rounded-2xl flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F44]">Banking Management Portal</h1>
          <p className="text-[#64748B] text-sm mt-2">Please sign in to access your dashboard</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/banking/smart-bank/compliance">
            <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-300 hover:shadow-md transition-all group text-left">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-4 h-4 text-amber-700" />
              </div>
              <p className="font-semibold text-[#0A1F44] text-sm">Compliance</p>
              <div className="flex items-center gap-1 text-amber-700 text-xs mt-1 font-medium">
                Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
          <Link href="/banking/smart-bank/internal-control">
            <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition-all group text-left">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <FileCheck className="w-4 h-4 text-purple-700" />
              </div>
              <p className="font-semibold text-[#0A1F44] text-sm">Internal Control</p>
              <div className="flex items-center gap-1 text-purple-700 text-xs mt-1 font-medium">
                Open <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-[#F97316] font-semibold hover:underline">
          Back to Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
