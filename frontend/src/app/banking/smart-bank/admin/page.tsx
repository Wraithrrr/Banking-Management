'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Copy, CheckCircle, X,
  Building2, FileCheck, GitBranch, Clock, Eye, EyeOff, Shield,
  ClipboardCheck, TrendingUp, AlertTriangle, BookOpen,
  HeadphonesIcon, UserCheck, Wallet, Loader2, RefreshCw,
  Ban, RotateCcw, ChevronDown,
} from 'lucide-react';
import Sidebar from '@/components/SmartBank/Sidebar';
import { authFetch } from '@/lib/auth-client';

type EmployeeRole =
  | 'owner' | 'compliance' | 'internal-control'
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

interface RoleOption {
  value: EmployeeRole;
  label: string;
  icon: any;
  level: string;
}

const ROLE_GROUPS: { level: string; levelLabel: string; roles: RoleOption[] }[] = [
  {
    level: 'executive', levelLabel: 'Executive',
    roles: [{ value: 'owner', label: 'MD / CEO', icon: Building2, level: 'Executive' }],
  },
  {
    level: 'management', levelLabel: 'Management',
    roles: [
      { value: 'compliance', label: 'Compliance Officer', icon: FileCheck, level: 'Management' },
      { value: 'internal-control', label: 'Internal Control', icon: ClipboardCheck, level: 'Management' },
      { value: 'head-operations', label: 'Head of Operations', icon: TrendingUp, level: 'Management' },
      { value: 'head-credit', label: 'Head of Credit', icon: AlertTriangle, level: 'Management' },
    ],
  },
  {
    level: 'branch', levelLabel: 'Branch',
    roles: [{ value: 'branch-manager', label: 'Branch Manager', icon: GitBranch, level: 'Branch' }],
  },
  {
    level: 'operations', levelLabel: 'Operations',
    roles: [
      { value: 'credit-officer', label: 'Credit Officer', icon: BookOpen, level: 'Operations' },
      { value: 'customer-service', label: 'Customer Service', icon: HeadphonesIcon, level: 'Operations' },
      { value: 'account-officer', label: 'Account Officer', icon: UserCheck, level: 'Operations' },
      { value: 'teller', label: 'Teller', icon: Wallet, level: 'Operations' },
    ],
  },
];

const ROLE_LABELS: Record<EmployeeRole, string> = {
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

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Create employee modal
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ fullName: '', email: '', role: '' as EmployeeRole | '' });
  const [formError, setFormError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createdOTP, setCreatedOTP] = useState<{ name: string; otp: string } | null>(null);

  // UI helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // ── Load employees ────────────────────────────────────────────────────────
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const res = await authFetch('/admin/employees');
      if (!res.ok) throw new Error('Failed to load employees.');
      const data = await res.json();
      setEmployees(data);
    } catch (err: any) {
      setFetchError(err.message || 'Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

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
      loadEmployees(); // refresh list
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
      }
      loadEmployees();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
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

  return (
    <div className="lg:flex min-h-screen bg-[#F8FAFC]">
      <Sidebar role="admin" />

      <div className="flex-1 p-4 lg:p-8 space-y-6">

        {/* Header */}
        <div className="bg-[#0A1F44] rounded-2xl p-7 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1">IT Administrator Panel</h1>
              <p className="text-blue-300 text-sm">Manage your bank's users, roles, and access control</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'Total Users', value: employees.length, color: 'text-white' },
                { label: 'Active', value: activeCount, color: 'text-[#0D9488]' },
                { label: 'Pending OTP', value: pendingCount, color: 'text-[#F97316]' },
                { label: 'Inactive', value: inactiveCount, color: 'text-red-400' },
              ].map(stat => (
                <div key={stat.label} className="text-center bg-white/10 rounded-xl px-5 py-3 min-w-[72px]">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-blue-300 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OTP Success Banner */}
        {createdOTP && (
          <div className="bg-[#0D9488]/10 border border-[#0D9488]/30 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0D9488] flex-shrink-0 mt-0.5" />
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

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-[#0A1F44]" />
              </div>
              <div>
                <h2 className="font-bold text-[#0A1F44]">Bank Employees</h2>
                <p className="text-[#64748B] text-xs">{employees.length} users registered</p>
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

          {/* Error state */}
          {fetchError && (
            <div className="flex items-center gap-2 m-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {fetchError} — <button onClick={loadEmployees} className="underline font-medium">Retry</button>
            </div>
          )}

          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-[#64748B]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading employees...</span>
            </div>
          ) : employees.length === 0 && !fetchError ? (
            <div className="text-center py-16 text-[#64748B]">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">No employees yet</p>
              <p className="text-sm mt-1">Click "Add Employee" to create the first account.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F8FAFC]">
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Employee</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Role</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Status</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Added</th>
                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#64748B] uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
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
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="text-xs font-semibold text-red-500">Inactive</span>
                          </div>
                        ) : emp.isFirstLogin ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                            <span className="text-xs font-semibold text-[#F97316]">Awaiting Login</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#0D9488]" />
                            <span className="text-xs font-semibold text-[#0D9488]">Active</span>
                          </div>
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
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                                <button
                                  onClick={() => handleAction(emp.id, 'reset-otp')}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-[#F97316]" />
                                  Reset OTP
                                </button>
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
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0D9488] hover:bg-teal-50 border-t border-gray-100 transition-colors"
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

        {/* Onboarding guide */}
        <div className="bg-[#1E3A5F] rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-3">How employee onboarding works</h4>
              <ol className="text-sm text-blue-200 space-y-2 list-decimal list-inside">
                <li>Create an employee account — enter their name, email, and role</li>
                <li>A 6-digit OTP is generated by the server — copy and share it with the employee</li>
                <li>Employee visits <strong className="text-white">banking.smartes.com.ng/first-login</strong>, enters their email and OTP, then sets their own password</li>
                <li>Their status changes to <strong className="text-[#0D9488]">Active</strong> and they go directly to their role dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpenMenuId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0A1F44]">Add New Employee</h3>
              <button onClick={() => { setShowModal(false); setFormError(''); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Fatima Bello"
                  value={newEmployee.fullName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="employee@yourbank.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-3">Role <span className="text-red-500">*</span></label>
                <div className="space-y-3">
                  {ROLE_GROUPS.map((group) => (
                    <div key={group.level}>
                      <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mb-2">{group.levelLabel}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {group.roles.map((opt) => (
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

      {/* Close dropdown on outside click */}
      {openMenuId !== null && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenMenuId(null)} />
      )}
    </div>
  );
}
