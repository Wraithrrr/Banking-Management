'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Users, UserPlus, Copy, CheckCircle, X,
  Building2, FileCheck, GitBranch, Clock, Shield,
  ClipboardCheck, TrendingUp, AlertTriangle, BookOpen,
  HeadphonesIcon, UserCheck, Wallet, Loader2, RefreshCw,
  Ban, RotateCcw, ChevronDown, Search, Filter,
  CheckSquare, Square, MapPin, Phone, Hash, FileClock,
  PlusCircle,
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import DocumentManager from '@/components/SmartBank/DocumentManager';
import PayrollManager from '@/components/SmartBank/PayrollManager';
import { authFetch } from '@/lib/auth-client';

// ─── Types ────────────────────────────────────────────────────────────────────

type EmployeeRole =
  | 'admin' | 'owner' | 'compliance' | 'internal-control'
  | 'head-operations' | 'head-credit' | 'branch-manager'
  | 'credit-officer' | 'customer-service' | 'account-officer' | 'teller';

interface Employee {
  id: number;
  fullName: string;
  email: string;
  role: EmployeeRole;
  isFirstLogin: boolean;
  isActive: boolean;
  branchId: number | null;
  createdAt: string;
}

interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  phone?: string;
  createdAt: string;
}

interface BranchStaff {
  id: number;
  fullName: string;
  email: string;
  role: EmployeeRole;
  isActive: boolean;
}

interface ToastItem {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface RoleOption {
  value: EmployeeRole;
  label: string;
  icon: any;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CRITICAL_ROLES: EmployeeRole[] = [
  'branch-manager', 'credit-officer', 'teller', 'customer-service', 'account-officer',
];

const ROLE_GROUPS: { level: string; levelLabel: string; roles: RoleOption[] }[] = [
  {
    level: 'executive', levelLabel: 'Executive',
    roles: [{ value: 'owner', label: 'MD / CEO', icon: Building2 }],
  },
  {
    level: 'management', levelLabel: 'Management',
    roles: [
      { value: 'compliance', label: 'Compliance Officer', icon: FileCheck },
      { value: 'internal-control', label: 'Internal Control', icon: ClipboardCheck },
      { value: 'head-operations', label: 'Head of Operations', icon: TrendingUp },
      { value: 'head-credit', label: 'Head of Credit', icon: AlertTriangle },
    ],
  },
  {
    level: 'branch', levelLabel: 'Branch',
    roles: [{ value: 'branch-manager', label: 'Branch Manager', icon: GitBranch }],
  },
  {
    level: 'operations', levelLabel: 'Operations',
    roles: [
      { value: 'credit-officer', label: 'Credit Officer', icon: BookOpen },
      { value: 'customer-service', label: 'Customer Service', icon: HeadphonesIcon },
      { value: 'account-officer', label: 'Account Officer', icon: UserCheck },
      { value: 'teller', label: 'Teller', icon: Wallet },
    ],
  },
];

const ROLE_LABELS: Record<EmployeeRole, string> = {
  admin: 'IT Administrator',
  owner: 'MD / CEO',
  compliance: 'Compliance Officer',
  'internal-control': 'Internal Control',
  'head-operations': 'Head of Operations',
  'head-credit': 'Head of Credit',
  'branch-manager': 'Branch Manager',
  'credit-officer': 'Credit Officer',
  'customer-service': 'Customer Service',
  'account-officer': 'Account Officer',
  teller: 'Teller',
};

const ROLE_COLORS: Record<EmployeeRole, string> = {
  admin: 'bg-gray-100 text-gray-700',
  owner: 'bg-blue-50 text-[#0A1F44]',
  compliance: 'bg-amber-50 text-amber-800',
  'internal-control': 'bg-purple-50 text-purple-800',
  'head-operations': 'bg-teal-50 text-teal-800',
  'head-credit': 'bg-yellow-50 text-yellow-800',
  'branch-manager': 'bg-green-50 text-green-800',
  'credit-officer': 'bg-sky-50 text-sky-800',
  'customer-service': 'bg-emerald-50 text-emerald-800',
  'account-officer': 'bg-indigo-50 text-indigo-800',
  teller: 'bg-cyan-50 text-cyan-800',
};

const ALL_FILTER_ROLES: { value: EmployeeRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  ...Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v as EmployeeRole, label: l })),
];

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function AdminDashboardInner() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'users';

  // ── Employee state ────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', role: '' as EmployeeRole | '' });
  const [formError, setFormError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdOTP, setCreatedOTP] = useState<{ name: string; otp: string } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ── Role change modal ─────────────────────────────────────────────────────
  const [roleChangeTarget, setRoleChangeTarget] = useState<Employee | null>(null);
  const [newRole, setNewRole] = useState<EmployeeRole | ''>('');
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [roleChangeError, setRoleChangeError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | 'all'>('all');

  // ── Branch state ──────────────────────────────────────────────────────────
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [branchError, setBranchError] = useState('');
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', code: '', address: '', phone: '' });
  const [branchFormError, setBranchFormError] = useState('');
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);

  // Assign staff
  const [assignBranch, setAssignBranch] = useState<Branch | null>(null);
  const [branchStaff, setBranchStaff] = useState<BranchStaff[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');

  // ── Toasts ────────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastItem['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Auto-open modal when ?tab=add
  useEffect(() => {
    if (activeTab === 'add') {
      setShowModal(true);
      setFormError('');
    }
  }, [activeTab]);

  // ── Filtered employees ────────────────────────────────────────────────────
  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (roleFilter !== 'all') list = list.filter(e => e.role === roleFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    }
    return list;
  }, [employees, searchQuery, roleFilter]);

  // ── Bank Setup Tracker ────────────────────────────────────────────────────
  const setupData = useMemo(() => {
    const activeEmployees = employees.filter(e => e.isActive);
    const filledCriticalRoles = CRITICAL_ROLES.filter(role => activeEmployees.some(e => e.role === role));
    const onboardedCount = employees.filter(e => !e.isFirstLogin && e.isActive).length;
    const inactiveCount = employees.filter(e => !e.isActive).length;
    const roleScore = employees.length === 0 ? 0 : (filledCriticalRoles.length / CRITICAL_ROLES.length) * 40;
    const onboardScore = employees.length === 0 ? 0 : (onboardedCount / employees.length) * 40;
    const inactiveScore = employees.length === 0 ? 0 : Math.max(0, 20 - (inactiveCount / Math.max(employees.length, 1)) * 20);
    return {
      score: Math.round(roleScore + onboardScore + inactiveScore),
      filledCriticalRoles,
      onboardedCount,
      inactiveCount,
    };
  }, [employees]);

  const scoreColor = setupData.score >= 80 ? 'bg-emerald-500' : setupData.score >= 50 ? 'bg-amber-400' : 'bg-red-500';
  const scoreBorder = setupData.score >= 80 ? 'border-emerald-200 bg-emerald-50' : setupData.score >= 50 ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50';
  const scoreText = setupData.score >= 80 ? 'text-emerald-700' : setupData.score >= 50 ? 'text-amber-700' : 'text-red-700';

  // ── Load employees ────────────────────────────────────────────────────────
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await authFetch('/admin/employees');
      if (!res.ok) throw new Error('Failed to load employees.');
      setEmployees(await res.json());
    } catch (err: any) {
      setFetchError(err.message || 'Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  // ── Load branches ─────────────────────────────────────────────────────────
  const loadBranches = useCallback(async () => {
    setBranchLoading(true);
    setBranchError('');
    try {
      const res = await authFetch('/admin/branches');
      if (!res.ok) throw new Error('Failed to load branches.');
      setBranches(await res.json());
    } catch (err: any) {
      setBranchError(err.message || 'Could not connect to server.');
    } finally {
      setBranchLoading(false);
    }
  }, []);

  // Always load branches on mount so the header stat is accurate
  useEffect(() => { loadBranches(); }, [loadBranches]);

  // Reload when switching to branches tab (to get fresh data)
  useEffect(() => {
    if (activeTab === 'branches') loadBranches();
  }, [activeTab, loadBranches]);

  // ── Create employee ───────────────────────────────────────────────────────
  const handleCreateEmployee = async () => {
    if (!newEmployee.fullName.trim()) { setFormError('Full name is required.'); return; }
    if (!newEmployee.email.trim() || !newEmployee.email.includes('@')) { setFormError('A valid email is required.'); return; }
    if (!newEmployee.role) { setFormError('Please select a role.'); return; }
    setIsCreating(true);
    setFormError('');
    try {
      const res = await authFetch('/admin/employees', {
        method: 'POST',
        body: JSON.stringify({ fullName: newEmployee.fullName.trim(), email: newEmployee.email.trim(), role: newEmployee.role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create employee.');
      setCreatedOTP({ name: newEmployee.fullName.trim(), otp: data.otp });
      setNewEmployee({ fullName: '', email: '', role: '' });
      setShowModal(false);
      loadEmployees();
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong.');
    } finally {
      setIsCreating(false);
    }
  };

  // ── Employee actions ──────────────────────────────────────────────────────
  const handleAction = async (employeeId: number, action: 'deactivate' | 'activate' | 'reset-otp') => {
    setActionLoading(employeeId);
    setOpenMenuId(null);
    try {
      const res = await authFetch(`/admin/employees/${employeeId}/${action}`, { method: 'PATCH' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed.');
      if (action === 'reset-otp' && data.otp) {
        const emp = employees.find(e => e.id === employeeId);
        setCreatedOTP({ name: emp?.fullName ?? 'Employee', otp: data.otp });
        addToast('success', `OTP reset for ${emp?.fullName ?? 'employee'}.`);
      } else if (action === 'activate') {
        addToast('success', 'Account reactivated successfully.');
      } else if (action === 'deactivate') {
        addToast('success', 'Account deactivated.');
      }
      loadEmployees();
    } catch (err: any) {
      addToast('error', err.message || 'Action failed. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Change employee role ──────────────────────────────────────────────────
  const handleRoleChange = async () => {
    if (!roleChangeTarget || !newRole) return;
    setIsChangingRole(true);
    setRoleChangeError('');
    try {
      const res = await authFetch(`/admin/employees/${roleChangeTarget.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change role.');
      addToast('success', `Role updated to ${ROLE_LABELS[newRole]}.`);
      setRoleChangeTarget(null);
      setNewRole('');
      loadEmployees();
    } catch (err: any) {
      setRoleChangeError(err.message || 'Something went wrong.');
    } finally {
      setIsChangingRole(false);
    }
  };

  // ── Create branch ─────────────────────────────────────────────────────────
  const handleCreateBranch = async () => {
    if (!newBranch.name.trim()) { setBranchFormError('Branch name is required.'); return; }
    if (!newBranch.code.trim()) { setBranchFormError('Branch code is required.'); return; }
    if (!newBranch.address.trim()) { setBranchFormError('Address is required.'); return; }
    setIsCreatingBranch(true);
    setBranchFormError('');
    try {
      const body: any = { name: newBranch.name.trim(), code: newBranch.code.trim().toUpperCase(), address: newBranch.address.trim() };
      if (newBranch.phone.trim()) body.phone = newBranch.phone.trim();
      const res = await authFetch('/admin/branches', { method: 'POST', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create branch.');
      setNewBranch({ name: '', code: '', address: '', phone: '' });
      setShowBranchModal(false);
      addToast('success', `Branch "${data.name}" created successfully.`);
      loadBranches();
    } catch (err: any) {
      setBranchFormError(err.message || 'Something went wrong.');
    } finally {
      setIsCreatingBranch(false);
    }
  };

  // ── Load branch staff ─────────────────────────────────────────────────────
  const openAssignModal = async (branch: Branch) => {
    setAssignBranch(branch);
    setSelectedUserId('');
    setAssignError('');
    setStaffLoading(true);
    try {
      const res = await authFetch(`/admin/branches/${branch.id}/staff`);
      if (!res.ok) throw new Error('Failed to load staff.');
      setBranchStaff(await res.json());
    } catch {
      setBranchStaff([]);
    } finally {
      setStaffLoading(false);
    }
  };

  // ── Assign staff to branch ────────────────────────────────────────────────
  const handleAssignStaff = async () => {
    if (!selectedUserId || !assignBranch) return;
    setIsAssigning(true);
    setAssignError('');
    try {
      const res = await authFetch(`/admin/branches/${assignBranch.id}/assign-staff`, {
        method: 'POST',
        body: JSON.stringify({ userId: Number(selectedUserId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to assign staff.');
      addToast('success', 'Staff member assigned to branch.');
      setSelectedUserId('');
      // Reload staff list
      const staffRes = await authFetch(`/admin/branches/${assignBranch.id}/staff`);
      if (staffRes.ok) setBranchStaff(await staffRes.json());
      loadEmployees(); // refresh to update branchId
    } catch (err: any) {
      setAssignError(err.message || 'Failed to assign staff.');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleCopyOtp = (otp: string, key: string) => {
    navigator.clipboard.writeText(otp);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCount = employees.filter(e => e.isActive && !e.isFirstLogin).length;
  const pendingCount = employees.filter(e => e.isFirstLogin).length;
  const inactiveCount = employees.filter(e => !e.isActive).length;

  // Unassigned employees (no branch) eligible for branch assignment
  const unassignedEmployees = employees.filter(e => e.isActive && e.branchId === null && e.role !== 'owner');

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="admin" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-[#0A1F44] rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">IT Administrator Panel</h1>
              <p className="text-blue-300 text-sm">Manage your bank's users, branches, roles, and access control</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Total Users', value: employees.length, color: 'text-white' },
                { label: 'Active', value: activeCount, color: 'text-emerald-400' },
                { label: 'Pending OTP', value: pendingCount, color: 'text-amber-400' },
                { label: 'Inactive', value: inactiveCount, color: 'text-red-400' },
                { label: 'Branches', value: branches.length, color: 'text-sky-400' },
              ].map(stat => (
                <div key={stat.label} className="text-center bg-white/10 rounded-xl px-5 py-3 min-w-[72px]">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bank Setup Tracker */}
        <div className={`rounded-2xl p-6 border ${scoreBorder}`}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Shield className={`w-5 h-5 ${scoreText}`} />
                <h3 className={`font-bold ${scoreText}`}>Bank Setup Progress</h3>
                <span className={`text-2xl font-black ${scoreText}`}>{setupData.score}%</span>
              </div>
              <div className="h-3 bg-white/60 rounded-full overflow-hidden mb-3 max-w-sm">
                <div className={`h-full ${scoreColor} rounded-full transition-all duration-500`} style={{ width: `${setupData.score}%` }} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={scoreText}>{setupData.onboardedCount} of {employees.length} employees fully onboarded</span>
                {setupData.inactiveCount > 0 && (
                  <span className="text-red-600">• {setupData.inactiveCount} inactive account{setupData.inactiveCount > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            <div className="lg:w-72 grid grid-cols-2 gap-1.5">
              {CRITICAL_ROLES.map(role => {
                const filled = setupData.filledCriticalRoles.includes(role);
                return (
                  <div key={role} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${filled ? 'bg-white/70 text-emerald-700' : 'bg-white/40 text-gray-500'}`}>
                    {filled ? <CheckSquare className="w-3 h-3 text-emerald-500 flex-shrink-0" /> : <Square className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                    {ROLE_LABELS[role]}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* OTP Banner */}
        {createdOTP && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0A1F44]">OTP generated for {createdOTP.name}</p>
                  <p className="text-[#64748B] text-sm mt-1">Share this OTP securely with the employee so they can set their password.</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-3xl font-bold text-[#0A1F44] tracking-[0.3em] font-mono">{createdOTP.otp}</span>
                    <button
                      onClick={() => handleCopyOtp(createdOTP.otp, 'banner')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#F97316] hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      {copiedId === 'banner' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === 'banner' ? 'Copied!' : 'Copy OTP'}
                    </button>
                  </div>
                  <p className="text-xs text-[#64748B] mt-2">
                    Login URL: <span className="font-medium text-[#0A1F44]">banking.smartes.com.ng/first-login</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setCreatedOTP(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: User Management ── */}
        {(activeTab === 'users' || activeTab === 'add') && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#0A1F44]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#0A1F44]">Bank Employees</h2>
                  <p className="text-[#64748B] text-xs">
                    {searchQuery || roleFilter !== 'all'
                      ? `Showing ${filteredEmployees.length} of ${employees.length} users`
                      : `${employees.length} users registered`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={loadEmployees} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => { setShowModal(true); setFormError(''); }}
                  className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Employee
                </button>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100 bg-[#F8FAFC]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value as EmployeeRole | 'all')}
                  className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all appearance-none"
                >
                  {ALL_FILTER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {fetchError && (
              <div className="flex items-center gap-2 m-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {fetchError} — <button onClick={loadEmployees} className="underline font-medium">Retry</button>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-[#64748B]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading employees...</span>
              </div>
            ) : filteredEmployees.length === 0 && !fetchError ? (
              <div className="text-center py-16 text-[#64748B]">
                <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                <p className="font-medium">{employees.length === 0 ? 'No employees yet' : 'No results match your search'}</p>
                <p className="text-sm mt-1">
                  {employees.length === 0 ? 'Click "Add Employee" to create the first account.' : 'Try a different name, email, or clear the filter.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F8FAFC]">
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Employee</th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Role</th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Branch</th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Added</th>
                      <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className={`border-b border-gray-50 hover:bg-[#F8FAFC] transition-colors ${!emp.isActive ? 'opacity-60' : ''}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 ${emp.isActive ? 'bg-[#0A1F44]' : 'bg-gray-400'} rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                              {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-[#0A1F44] text-sm">{emp.fullName}</div>
                              <div className="text-[#64748B] text-xs">{emp.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[emp.role] ?? 'bg-gray-50 text-gray-600'}`}>
                            {ROLE_LABELS[emp.role] ?? emp.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {!emp.isActive ? (
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-xs font-semibold text-red-500">Inactive</span></div>
                          ) : emp.isFirstLogin ? (
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-xs font-semibold text-amber-600">Awaiting Login</span></div>
                          ) : (
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-xs font-semibold text-emerald-600">Active</span></div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {emp.branchId ? (
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              {branches.find(b => b.id === emp.branchId)?.name ?? `Branch #${emp.branchId}`}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                            <Clock className="w-3 h-3" />
                            {new Date(emp.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {actionLoading === emp.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#64748B]" />
                          ) : (
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}
                                className="flex items-center gap-1 text-xs font-medium text-[#64748B] hover:text-[#0A1F44] px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                Actions <ChevronDown className="w-3 h-3" />
                              </button>
                              {openMenuId === emp.id && (
                                <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                  <button
                                    onClick={() => handleAction(emp.id, 'reset-otp')}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5 text-[#F97316]" />
                                    Reset OTP
                                  </button>
                                  {emp.role !== 'admin' && (
                                    <button
                                      onClick={() => { setRoleChangeTarget(emp); setNewRole(emp.role); setRoleChangeError(''); setOpenMenuId(null); }}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 border-t border-gray-100 transition-colors"
                                    >
                                      <Shield className="w-3.5 h-3.5" />
                                      Change Role
                                    </button>
                                  )}
                                  {emp.isActive ? (
                                    <button
                                      onClick={() => handleAction(emp.id, 'deactivate')}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
                                    >
                                      <Ban className="w-3.5 h-3.5" />
                                      Deactivate
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleAction(emp.id, 'activate')}
                                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 border-t border-gray-100 transition-colors"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      Reactivate
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: Branch Management ── */}
        {activeTab === 'branches' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0A1F44]">Branch Network</h2>
                    <p className="text-[#64748B] text-xs">{branches.length} branch{branches.length !== 1 ? 'es' : ''} registered</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={loadBranches} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Refresh">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => { setShowBranchModal(true); setBranchFormError(''); }}
                    className="flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Branch
                  </button>
                </div>
              </div>

              {branchError && (
                <div className="flex items-center gap-2 m-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {branchError} — <button onClick={loadBranches} className="underline font-medium">Retry</button>
                </div>
              )}

              {branchLoading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-[#64748B]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading branches...</span>
                </div>
              ) : branches.length === 0 && !branchError ? (
                <div className="text-center py-16 text-[#64748B]">
                  <GitBranch className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="font-medium">No branches yet</p>
                  <p className="text-sm mt-1">Click "New Branch" to register your first branch.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                  {branches.map(branch => {
                    const staffCount = employees.filter(e => e.branchId === branch.id).length;
                    return (
                      <div key={branch.id} className="border border-gray-200 rounded-xl p-5 hover:border-[#F97316]/40 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-[#0A1F44]">{branch.name}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Hash className="w-3 h-3 text-gray-400" />
                              <span className="text-xs font-mono text-gray-500">{branch.code}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">Active</span>
                        </div>

                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>
                          {branch.phone && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span>{branch.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{staffCount} staff assigned</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openAssignModal(branch)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-[#0A1F44] hover:bg-gray-50 transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Manage Staff
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Audit Logs ── */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 p-6 border-b border-gray-100">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileClock className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <h2 className="font-bold text-[#0A1F44]">Audit Logs</h2>
                <p className="text-[#64748B] text-xs">System activity and access records</p>
              </div>
            </div>

            {/* Employee activity derived from available data */}
            <div className="p-6 space-y-3">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-4">Recent Employee Actions</p>
              {employees.length === 0 ? (
                <div className="text-center py-12 text-[#64748B]">
                  <FileClock className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="font-medium">No activity yet</p>
                </div>
              ) : (
                [...employees]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(emp => (
                    <div key={emp.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${emp.isActive ? 'bg-[#0A1F44]' : 'bg-gray-400'}`}>
                        {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1F44] truncate">{emp.fullName}</p>
                        <p className="text-xs text-gray-500">
                          Account created · {ROLE_LABELS[emp.role] ?? emp.role}
                          {!emp.isActive ? ' · Deactivated' : emp.isFirstLogin ? ' · Awaiting first login' : ' · Active'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(emp.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB: Payroll ── */}
        {activeTab === 'payroll' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-700" />
              </div>
              <div>
                <h2 className="font-bold text-[#0A1F44]">Payroll Management</h2>
                <p className="text-[#64748B] text-xs">Set employee salaries, generate monthly payroll, and track payment runs</p>
              </div>
            </div>
            <PayrollManager role="admin" />
          </div>
        )}

        {/* ── TAB: HR Documents ── */}
        {activeTab === 'documents' && (
          <DocumentManager
            defaultCategory="hr"
            allowedCategories={['hr', 'operational', 'general']}
            title="HR & Staff Documents"
            description="Employment contracts, NIN slips, guarantor forms, offer letters, policies, and circulars"
          />
        )}

        {/* Onboarding guide (only on user management tab) */}
        {(activeTab === 'users' || activeTab === 'add') && (
          <div className="bg-[#1E3A5F] rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-3">How employee onboarding works</h4>
                <ol className="text-sm text-blue-200 space-y-2 list-decimal list-inside">
                  <li>Create an employee account — enter their name, email, and role</li>
                  <li>A 6-digit OTP is generated by the server — copy and share it with the employee</li>
                  <li>Employee visits <strong className="text-white">banking.smartes.com.ng/first-login</strong>, enters their email and OTP, then sets their own password</li>
                  <li>Their status changes to <strong className="text-emerald-400">Active</strong> and they go directly to their role dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Employee Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">Add New Employee</h3>
              <button onClick={() => { setShowModal(false); setFormError(''); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Fatima Bello"
                  value={newEmployee.fullName}
                  onChange={e => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="employee@yourbank.com"
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-3">Role <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  {ROLE_GROUPS.map(group => (
                    <div key={group.level}>
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">{group.levelLabel}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {group.roles.map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setNewEmployee({ ...newEmployee, role: opt.value })}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                              newEmployee.role === opt.value
                                ? 'border-[#F97316] bg-orange-50 text-[#0A1F44]'
                                : 'border-gray-200 text-[#64748B] hover:border-gray-300'
                            }`}
                          >
                            <opt.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="text-xs">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
              <button
                onClick={() => { setShowModal(false); setFormError(''); }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEmployee}
                disabled={isCreating}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Account & Generate OTP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Branch Modal ── */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">Register New Branch</h3>
              <button onClick={() => { setShowBranchModal(false); setBranchFormError(''); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {branchFormError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{branchFormError}</div>}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Branch Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Kano Main Branch"
                  value={newBranch.name}
                  onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Branch Code <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. KNO001"
                  value={newBranch.code}
                  onChange={e => setNewBranch({ ...newBranch, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 14 Ibrahim Taiwo Road, Kano"
                  value={newBranch.address}
                  onChange={e => setNewBranch({ ...newBranch, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="tel"
                  placeholder="e.g. 0802 000 0000"
                  value={newBranch.phone}
                  onChange={e => setNewBranch({ ...newBranch, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 border-t border-gray-100 pt-4">
              <button
                onClick={() => { setShowBranchModal(false); setBranchFormError(''); }}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBranch}
                disabled={isCreatingBranch}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                {isCreatingBranch ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Branch'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Staff Modal ── */}
      {assignBranch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F44]">{assignBranch.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Branch Staff Management</p>
              </div>
              <button onClick={() => setAssignBranch(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Assign new staff */}
              <div>
                <p className="text-sm font-semibold text-[#0A1F44] mb-3">Assign Employee to Branch</p>
                {assignError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-3">{assignError}</div>}
                <div className="flex gap-2">
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  >
                    <option value="">Select an unassigned employee…</option>
                    {unassignedEmployees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.fullName} — {ROLE_LABELS[emp.role] ?? emp.role}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignStaff}
                    disabled={!selectedUserId || isAssigning}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#F97316] hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Assign
                  </button>
                </div>
                {unassignedEmployees.length === 0 && (
                  <p className="text-xs text-gray-400 mt-2">All active employees have been assigned to branches.</p>
                )}
              </div>

              {/* Current staff */}
              <div>
                <p className="text-sm font-semibold text-[#0A1F44] mb-3">Current Branch Staff</p>
                {staffLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading staff...</span>
                  </div>
                ) : branchStaff.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm">No staff assigned yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {branchStaff.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="w-8 h-8 bg-[#0A1F44] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0A1F44] truncate">{s.fullName}</p>
                          <p className="text-xs text-gray-500">{s.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[s.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {ROLE_LABELS[s.role] ?? s.role}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdown on outside click */}
      {openMenuId !== null && <div className="fixed inset-0 z-0" onClick={() => setOpenMenuId(null)} />}

      {/* ── Change Role Modal ── */}
      {roleChangeTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F44]">Change Role</h3>
                <p className="text-xs text-gray-500 mt-0.5">{roleChangeTarget.fullName}</p>
              </div>
              <button onClick={() => setRoleChangeTarget(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {roleChangeError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{roleChangeError}</div>}
              <div className="space-y-3">
                {ROLE_GROUPS.map(group => (
                  <div key={group.level}>
                    <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">{group.levelLabel}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.roles.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setNewRole(opt.value)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                            newRole === opt.value
                              ? 'border-indigo-500 bg-indigo-50 text-[#0A1F44]'
                              : 'border-gray-200 text-[#64748B] hover:border-gray-300'
                          }`}
                        >
                          <opt.icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
              <button
                onClick={() => setRoleChangeTarget(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-[#64748B] font-semibold hover:bg-gray-50 transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                disabled={isChangingRole || !newRole || newRole === roleChangeTarget.role}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                {isChangingRole ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Role'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto transition-all
              ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Export wrapped in Suspense (required for useSearchParams) ────────────────

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="lg:flex min-h-screen bg-[#F8FAFC] items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#0A1F44]" />
      </div>
    }>
      <AdminDashboardInner />
    </Suspense>
  );
}
