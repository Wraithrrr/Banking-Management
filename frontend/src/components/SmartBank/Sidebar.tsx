'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  TrendingUp,
  Users,
  Activity,
  LayoutDashboard,
  FileText,
  Calculator,
  UserPlus,
  MapPin,
  CreditCard,
  Shield,
  Eye,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Lightbulb,
  FileCheck,
  Scale,
  PieChart,
  Network,
  DollarSign,
  Droplets,
  AlertTriangle,
  Brain
} from 'lucide-react';

interface SidebarProps {
  role: 'treasury' | 'business-development' | 'risk-management' | 'compliance' | 'owner' | 'it-security';
  userName?: string;
  userEmail?: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

export default function Sidebar({ role, userName = 'Demo User', userEmail = 'demo@smartbank.ng' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // Start closed on mobile, will be managed by CSS for desktop
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: Record<string, MenuItem[]> = {
    owner: [
      { label: 'Executive Overview', href: '/banking/smart-bank/owner', icon: LayoutDashboard },
      { label: 'Treasury & Investments', href: '/banking/smart-bank/owner?tab=treasury', icon: TrendingUp },
      { label: 'Risk & Compliance', href: '/banking/smart-bank/owner?tab=risk-compliance', icon: Shield },
      { label: 'AI Intelligence Hub', href: '/banking/smart-bank/owner?tab=ai-intelligence', icon: Brain, badge: 'AI' },
      { label: 'Strategic Governance', href: '/banking/smart-bank/owner?tab=governance', icon: Users },
      { label: 'Department Overview', href: '/banking/smart-bank', icon: Building2 },
    ],
    treasury: [
      { label: 'Dashboard Overview', href: '/banking/smart-bank/treasury', icon: LayoutDashboard },
      { label: 'Liquidity & Cashflow', href: '/banking/smart-bank/treasury?tab=liquidity', icon: Droplets },
      { label: 'Investments & Sukuk', href: '/banking/smart-bank/treasury?tab=investments', icon: TrendingUp },
      { label: 'FX & Market Position', href: '/banking/smart-bank/treasury?tab=forex', icon: DollarSign },
      { label: 'AI Forecast & Strategy', href: '/banking/smart-bank/treasury?tab=ai-forecast', icon: Brain, badge: 'AI' },
    ],
    'risk-management': [
      { label: 'Dashboard Overview', href: '/banking/smart-bank/risk-management', icon: LayoutDashboard },
      { label: 'Credit & Financing Risk', href: '/banking/smart-bank/risk-management?tab=credit', icon: DollarSign },
      { label: 'Market & Liquidity Risk', href: '/banking/smart-bank/risk-management?tab=liquidity', icon: Droplets },
      { label: 'Shariah Compliance Risk', href: '/banking/smart-bank/risk-management?tab=shariah', icon: Shield },
      { label: 'AI Risk Intelligence', href: '/banking/smart-bank/risk-management?tab=ai-intelligence', icon: Brain, badge: 'AI' },
    ],
    'compliance': [
      { label: 'Dashboard', href: '/banking/smart-bank/compliance', icon: Shield },
      { label: 'Shariah Audit & Review', href: '/banking/smart-bank/compliance?tab=audit', icon: FileCheck },
      { label: 'KYC/AML & Regulatory', href: '/banking/smart-bank/compliance?tab=kyc', icon: Activity },
      { label: 'Zakat & Social Responsibility', href: '/banking/smart-bank/compliance?tab=zakat', icon: Scale },
      { label: 'Workflows', href: '/banking/smart-bank/compliance?tab=workflows', icon: LayoutDashboard },
      { label: 'Reports', href: '/banking/smart-bank/compliance?tab=reports', icon: FileText },
    ],
    'it-security': [
      { label: 'IT Operations Dashboard', href: '/banking/smart-bank/it-security', icon: LayoutDashboard },
      { label: 'System Health', href: '/banking/smart-bank/it-security?tab=health', icon: Activity, badge: 'Live' },
      { label: 'Security Monitoring', href: '/banking/smart-bank/it-security?tab=security', icon: Shield },
      { label: 'Incident Management', href: '/banking/smart-bank/it-security?tab=incidents', icon: FileText },
      { label: 'Performance Analytics', href: '/banking/smart-bank/it-security?tab=analytics', icon: TrendingUp },
      { label: 'AI Insights', href: '/banking/smart-bank/it-security?tab=ai-insights', icon: Lightbulb },
    ],
  };

  const roleConfig = {
    owner: {
      title: 'CEO / Owner',
      subtitle: 'Executive Leadership',
      color: 'from-blue-700 to-black',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
    treasury: {
      title: 'Treasury',
      subtitle: 'Asset Management',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
    'business-development': {
      title: 'Business Development',
      subtitle: 'Growth & Inclusion',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
    'risk-management': {
      title: 'Risk Management',
      subtitle: 'Fraud & Credit Risk',
      color: 'from-blue-600 to-blue-800',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
    'compliance': {
      title: 'Compliance',
      subtitle: 'Regulatory & Shariah',
      color: 'from-amber-600 to-yellow-800',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      hoverColor: 'hover:bg-amber-50',
      activeColor: 'bg-amber-100',
    },
    'it-security': {
      title: 'IT Security',
      subtitle: 'Cybersecurity & Operations',
      color: 'from-blue-700 to-black',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-50',
      activeColor: 'bg-blue-100',
    },
  };

  const config = roleConfig[role];
  const items = menuItems[role];

  const isActive = (href: string) => {
    if (href.includes('?tab=')) {
      const tab = href.split('?tab=')[1];
      return pathname.includes(href.split('?')[0]) && (
        typeof window !== 'undefined' && window.location.search.includes(`tab=${tab}`)
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
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:h-auto lg:min-h-screen
          w-64 lg:w-64 overflow-hidden`}
      >
        <div className="flex flex-col h-full lg:min-h-screen">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/banking/smart-bank" className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center flex-shrink-0 w-10 h-10`}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Smart Bank</h1>
                <p className="text-xs text-gray-500">Enterprise Portal</p>
              </div>
            </Link>
          </div>

          {/* Department Badge */}
          <div className={`mx-4 mt-4 p-3 ${config.bgColor} rounded-lg border border-gray-200`}>
            <p className="text-xs font-medium text-gray-600 mb-1">Department</p>
            <p className={`text-sm font-bold ${config.textColor}`}>{config.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{config.subtitle}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active
                    ? `${config.activeColor} ${config.textColor}`
                    : `text-gray-700 ${config.hoverColor}`
                    }`}
                  onClick={() => {
                    // Close mobile sidebar when navigation item is clicked
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? config.textColor : 'text-gray-500'}`} />
                  <span className="flex-1 font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.badge === 'Live'
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  <Link
                    href="/banking/smart-bank"
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    All Departments
                  </Link>
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-red-600 border-t border-gray-100"
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}
