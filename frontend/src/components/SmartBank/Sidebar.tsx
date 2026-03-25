'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getStoredUser, logout as authLogout } from '@/lib/auth-client';
import {
  Building2, LayoutDashboard, LogOut, Menu, X, ChevronDown,
  Brain, Users, FileCheck, Scale, Activity, DollarSign,
  GitBranch, UserPlus, FileClock, ClipboardCheck, BarChart2,
  TrendingUp, AlertTriangle, FileText, Wallet, UserCheck,
  HeadphonesIcon, BookOpen, Landmark, CreditCard, Bell,
} from 'lucide-react';
import { authFetch } from '@/lib/auth-client';

type Role =
  | 'owner'
  | 'compliance'
  | 'branch-manager'
  | 'admin'
  | 'internal-control'
  | 'head-operations'
  | 'head-credit'
  | 'credit-officer'
  | 'customer-service'
  | 'account-officer'
  | 'teller';

interface SidebarProps {
  role: Role;
  userName?: string;
  userEmail?: string;
  bankName?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

export default function Sidebar({
  role,
  userName = 'Demo User',
  userEmail = 'demo@smartesbanking.ng',
  bankName = 'SmartES Banking',
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [displayName, setDisplayName] = useState(userName);
  const [displayEmail, setDisplayEmail] = useState(userEmail);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const session = getStoredUser();
    if (session) {
      setDisplayName(session.fullName);
      setDisplayEmail(session.email);
    }
  }, []);

  // Poll unread notification count every 30s
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await authFetch('/notifications/unread-count');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(typeof data === 'number' ? data : 0);
        }
      } catch { /* silently ignore */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: Record<Role, MenuItem[]> = {
    owner: [
      { label: 'Executive Overview', href: '/banking/smart-bank/owner', icon: LayoutDashboard },
      { label: 'AI Intelligence Hub', href: '/banking/smart-bank/owner?tab=ai-intelligence', icon: Brain, badge: 'AI' },
      { label: 'Department Overview', href: '/banking/smart-bank/owner?tab=department', icon: Building2 },
      { label: 'Branch Network', href: '/banking/smart-bank/owner?tab=branches', icon: GitBranch },
    ],
    admin: [
      { label: 'User Management', href: '/banking/smart-bank/admin', icon: Users },
      { label: 'Add Employee', href: '/banking/smart-bank/admin?tab=add', icon: UserPlus },
      { label: 'Branch Management', href: '/banking/smart-bank/admin?tab=branches', icon: GitBranch },
      { label: 'Audit Logs', href: '/banking/smart-bank/admin?tab=audit', icon: FileClock },
    ],
    compliance: [
      { label: 'Compliance Dashboard', href: '/banking/smart-bank/compliance', icon: LayoutDashboard },
      { label: 'KYC / AML Reviews', href: '/banking/smart-bank/compliance?tab=kyc', icon: UserCheck },
      { label: 'Shariah Audit', href: '/banking/smart-bank/compliance?tab=audit', icon: FileCheck },
      { label: 'Regulatory Reports', href: '/banking/smart-bank/compliance?tab=reports', icon: FileText },
      { label: 'Zakat & Social', href: '/banking/smart-bank/compliance?tab=zakat', icon: Scale },
    ],
    'internal-control': [
      { label: 'Audit Dashboard', href: '/banking/smart-bank/internal-control', icon: LayoutDashboard },
      { label: 'Audit Logs', href: '/banking/smart-bank/internal-control?tab=logs', icon: FileClock },
      { label: 'Exception Reports', href: '/banking/smart-bank/internal-control?tab=exceptions', icon: AlertTriangle },
      { label: 'User Activity', href: '/banking/smart-bank/internal-control?tab=activity', icon: Activity },
      { label: 'Audit Reports', href: '/banking/smart-bank/internal-control?tab=reports', icon: ClipboardCheck },
    ],
    'head-operations': [
      { label: 'Operations Overview', href: '/banking/smart-bank/head-operations', icon: LayoutDashboard },
      { label: 'Transaction Approvals', href: '/banking/smart-bank/head-operations?tab=approvals', icon: CheckSquareIcon },
      { label: 'Branch Performance', href: '/banking/smart-bank/head-operations?tab=branches', icon: GitBranch },
      { label: 'Escalations', href: '/banking/smart-bank/head-operations?tab=escalations', icon: AlertTriangle },
      { label: 'Reports', href: '/banking/smart-bank/head-operations?tab=reports', icon: BarChart2 },
    ],
    'head-credit': [
      { label: 'Credit Dashboard', href: '/banking/smart-bank/head-credit', icon: LayoutDashboard },
      { label: 'Loan Approvals', href: '/banking/smart-bank/head-credit?tab=approvals', icon: CheckSquareIcon },
      { label: 'Loan Portfolio', href: '/banking/smart-bank/head-credit?tab=portfolio', icon: Landmark },
      { label: 'Credit Products', href: '/banking/smart-bank/head-credit?tab=products', icon: DollarSign },
      { label: 'PAR & Reports', href: '/banking/smart-bank/head-credit?tab=reports', icon: TrendingUp },
    ],
    'branch-manager': [
      { label: 'Branch Overview', href: '/banking/smart-bank/branch-manager', icon: LayoutDashboard },
      { label: 'Transactions', href: '/banking/smart-bank/branch-manager?tab=transactions', icon: Activity },
      { label: 'Staff & Schedule', href: '/banking/smart-bank/branch-manager?tab=staff', icon: Users },
      { label: 'Loan Recommendations', href: '/banking/smart-bank/branch-manager?tab=loans', icon: Landmark },
      { label: 'Branch Reports', href: '/banking/smart-bank/branch-manager?tab=reports', icon: FileText },
    ],
    'credit-officer': [
      { label: 'My Dashboard', href: '/banking/smart-bank/credit-officer', icon: LayoutDashboard },
      { label: 'Loan Applications', href: '/banking/smart-bank/credit-officer?tab=applications', icon: BookOpen },
      { label: 'Credit Assessment', href: '/banking/smart-bank/credit-officer?tab=assessment', icon: ClipboardCheck },
      { label: 'My Portfolio', href: '/banking/smart-bank/credit-officer?tab=portfolio', icon: Landmark },
      { label: 'Collections', href: '/banking/smart-bank/credit-officer?tab=collections', icon: DollarSign },
    ],
    'customer-service': [
      { label: 'My Dashboard', href: '/banking/smart-bank/customer-service', icon: LayoutDashboard },
      { label: 'Complaint Tickets', href: '/banking/smart-bank/customer-service?tab=tickets', icon: HeadphonesIcon },
      { label: 'Customer Profiles', href: '/banking/smart-bank/customer-service?tab=customers', icon: Users },
      { label: 'Escalations', href: '/banking/smart-bank/customer-service?tab=escalations', icon: AlertTriangle },
    ],
    'account-officer': [
      { label: 'My Dashboard', href: '/banking/smart-bank/account-officer', icon: LayoutDashboard },
      { label: 'Account Opening', href: '/banking/smart-bank/account-officer?tab=open', icon: UserPlus },
      { label: 'KYC Capture', href: '/banking/smart-bank/account-officer?tab=kyc', icon: UserCheck },
      { label: 'Customer Accounts', href: '/banking/smart-bank/account-officer?tab=accounts', icon: Users },
    ],
    teller: [
      { label: 'My Dashboard', href: '/banking/smart-bank/teller', icon: LayoutDashboard },
      { label: 'New Transaction', href: '/banking/smart-bank/teller?tab=transact', icon: CreditCard },
      { label: 'Transaction History', href: '/banking/smart-bank/teller?tab=history', icon: Activity },
      { label: 'Till Balancing', href: '/banking/smart-bank/teller?tab=till', icon: Wallet },
    ],
  };

  const roleConfig: Record<Role, {
    title: string;
    subtitle: string;
    color: string;
    bgColor: string;
    textColor: string;
    hoverColor: string;
    activeColor: string;
  }> = {
    owner: {
      title: 'MD / CEO',
      subtitle: 'Executive Leadership',
      color: 'from-[#0A1F44] to-[#1E3A5F]',
      bgColor: 'bg-blue-50',
      textColor: 'text-[#0A1F44]',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
    admin: {
      title: 'IT Administrator',
      subtitle: 'User & Access Management',
      color: 'from-slate-700 to-slate-600',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      hoverColor: 'hover:bg-slate-50',
      activeColor: 'bg-slate-100',
    },
    compliance: {
      title: 'Compliance Officer',
      subtitle: 'Regulatory & Shariah',
      color: 'from-amber-700 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      hoverColor: 'hover:bg-amber-50',
      activeColor: 'bg-amber-100',
    },
    'internal-control': {
      title: 'Internal Control',
      subtitle: 'Audit & Oversight',
      color: 'from-purple-800 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      hoverColor: 'hover:bg-purple-50',
      activeColor: 'bg-purple-100',
    },
    'head-operations': {
      title: 'Head of Operations',
      subtitle: 'Bank-wide Operations',
      color: 'from-teal-700 to-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      hoverColor: 'hover:bg-teal-50',
      activeColor: 'bg-teal-100',
    },
    'head-credit': {
      title: 'Head of Credit',
      subtitle: 'Lending Operations',
      color: 'from-yellow-700 to-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      hoverColor: 'hover:bg-yellow-50',
      activeColor: 'bg-yellow-100',
    },
    'branch-manager': {
      title: 'Branch Manager',
      subtitle: 'Branch Operations',
      color: 'from-green-700 to-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      hoverColor: 'hover:bg-green-50',
      activeColor: 'bg-green-100',
    },
    'credit-officer': {
      title: 'Credit Officer',
      subtitle: 'Loan Origination',
      color: 'from-blue-700 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
    'customer-service': {
      title: 'Customer Service',
      subtitle: 'Customer Support',
      color: 'from-emerald-700 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      hoverColor: 'hover:bg-emerald-50',
      activeColor: 'bg-emerald-100',
    },
    'account-officer': {
      title: 'Account Officer',
      subtitle: 'Account Opening & KYC',
      color: 'from-indigo-700 to-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      hoverColor: 'hover:bg-indigo-50',
      activeColor: 'bg-indigo-100',
    },
    teller: {
      title: 'Teller',
      subtitle: 'Cash Transactions',
      color: 'from-cyan-700 to-cyan-500',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
      hoverColor: 'hover:bg-cyan-50',
      activeColor: 'bg-cyan-100',
    },
  };

  const config = roleConfig[role];
  const items = menuItems[role];

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const tab = href.split('?tab=')[1];
      return (
        pathname.includes(href.split('?')[0]) &&
        typeof window !== 'undefined' &&
        window.location.search.includes(`tab=${tab}`)
      );
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-auto lg:min-h-screen w-64 overflow-hidden`}
      >
        <div className="flex flex-col h-full lg:min-h-screen">

          {/* Logo */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <Link href="/banking/smart-bank" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[#0A1F44] font-bold text-base">SmartES</span>
                <span className="text-[#F97316] font-bold text-base"> Banking</span>
                <p className="text-xs text-gray-400 truncate leading-none mt-0.5">{bankName}</p>
              </div>
            </Link>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#F97316] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Role Badge */}
          <div className={`mx-4 mt-4 p-3 ${config.bgColor} rounded-xl border border-gray-100`}>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Role</p>
            <p className={`text-sm font-bold ${config.textColor}`}>{config.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{config.subtitle}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 mt-2">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    active
                      ? `${config.activeColor} ${config.textColor}`
                      : `text-gray-600 ${config.hoverColor}`
                  }`}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsOpen(false);
                  }}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? config.textColor : 'text-gray-400'}`} />
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-[#F97316]/10 text-[#F97316]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-100">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                  <Link
                    href="/banking/smart-bank"
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    All Departments
                  </Link>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-red-600 border-t border-gray-100"
                    onClick={() => { setIsProfileOpen(false); authLogout(); }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Inline icon component to avoid extra import
function CheckSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
