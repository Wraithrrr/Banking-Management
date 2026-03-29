'use client';

import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Play, CheckCircle, Banknote, Loader2, AlertTriangle, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { authFetch } from '@/lib/auth-client';

const fmt = (v: string | number) => '₦' + Number(v).toLocaleString('en-NG', { minimumFractionDigits: 2 });

interface PayrollRun {
  id: number; bankId: number; period: string; status: 'draft' | 'approved' | 'paid';
  totalGross: string; totalDeductions: string; totalNet: string; employeeCount: number;
  entries: string; createdAt: string; approvedAt?: string; paidAt?: string;
}
interface PayrollEntry {
  userId: number; fullName: string; role: string;
  basicSalary: number; totalAllowances: number; totalDeductions: number; grossPay: number; netPay: number;
}
interface Salary {
  id: number; userId: number; basicSalary: string; housingAllowance: string;
  transportAllowance: string; otherAllowances: string; pension: string;
  incomeTax: string; otherDeductions: string;
  user?: { id: number; fullName: string; role: string };
}
interface Employee { id: number; fullName: string; role: string; email: string; }

const STATUS_STYLE = { draft: 'bg-amber-50 text-amber-700', approved: 'bg-blue-50 text-blue-700', paid: 'bg-teal-50 text-teal-700' };
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin', owner: 'Owner', compliance: 'Compliance', 'internal-control': 'Int. Control',
  'head-operations': 'Head Ops', 'head-credit': 'Head Credit', 'branch-manager': 'Branch Mgr',
  'credit-officer': 'Credit Officer', 'customer-service': 'Customer Service',
  'account-officer': 'Acct Officer', teller: 'Teller',
};

interface PayrollManagerProps {
  role: 'admin' | 'head-operations' | 'owner';
}

export default function PayrollManager({ role }: PayrollManagerProps) {
  const [tab, setTab] = useState<'runs' | 'salaries'>(role === 'head-operations' ? 'runs' : 'runs');
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRun, setExpandedRun] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Run payroll
  const [showRunModal, setShowRunModal] = useState(false);
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [running, setRunning] = useState(false);

  // Salary edit
  const [editingSalary, setEditingSalary] = useState<number | null>(null); // userId
  const [salaryForm, setSalaryForm] = useState({ basicSalary: '', housingAllowance: '', transportAllowance: '', otherAllowances: '', pension: '', incomeTax: '', otherDeductions: '' });
  const [savingSalary, setSavingSalary] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const promises: Promise<any>[] = [authFetch('/payroll/runs')];
      if (role === 'admin') {
        promises.push(authFetch('/payroll/salaries'));
        promises.push(authFetch('/admin/employees'));
      }
      const results = await Promise.all(promises);
      if (results[0].ok) setRuns(await results[0].json());
      if (results[1]?.ok) setSalaries(await results[1].json());
      if (results[2]?.ok) setEmployees(await results[2].json());
    } finally { setLoading(false); }
  }, [role]);

  useEffect(() => { load(); }, [load]);

  const handleRunPayroll = async () => {
    if (!period) return;
    setRunning(true); setResult(null);
    try {
      const res = await authFetch('/payroll/run', { method: 'POST', body: JSON.stringify({ period }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to generate payroll.');
      setResult({ success: true, message: `Payroll for ${period} generated. ${data.employeeCount} employees included.` });
      setShowRunModal(false);
      load();
    } catch (err: any) { setResult({ success: false, message: err.message }); }
    finally { setRunning(false); }
  };

  const handleApprove = async (runId: number) => {
    setActionLoading(runId); setResult(null);
    try {
      const res = await authFetch(`/payroll/runs/${runId}/approve`, { method: 'PATCH' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setResult({ success: true, message: 'Payroll approved successfully.' });
      load();
    } catch (err: any) { setResult({ success: false, message: err.message }); }
    finally { setActionLoading(null); }
  };

  const handleMarkPaid = async (runId: number) => {
    setActionLoading(runId); setResult(null);
    try {
      const res = await authFetch(`/payroll/runs/${runId}/mark-paid`, { method: 'PATCH' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setResult({ success: true, message: 'Payroll marked as paid.' });
      load();
    } catch (err: any) { setResult({ success: false, message: err.message }); }
    finally { setActionLoading(null); }
  };

  const openSalaryEdit = (emp: Employee) => {
    const existing = salaries.find(s => s.userId === emp.id);
    setSalaryForm({
      basicSalary: existing?.basicSalary ?? '',
      housingAllowance: existing?.housingAllowance ?? '',
      transportAllowance: existing?.transportAllowance ?? '',
      otherAllowances: existing?.otherAllowances ?? '',
      pension: existing?.pension ?? '',
      incomeTax: existing?.incomeTax ?? '',
      otherDeductions: existing?.otherDeductions ?? '',
    });
    setEditingSalary(emp.id);
  };

  const handleSaveSalary = async () => {
    if (!editingSalary) return;
    setSavingSalary(true);
    try {
      const body: any = {};
      Object.entries(salaryForm).forEach(([k, v]) => { body[k] = v ? Number(v) : 0; });
      const res = await authFetch(`/payroll/salaries/${editingSalary}`, { method: 'POST', body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      setEditingSalary(null);
      load();
    } catch (err: any) { alert(err.message); }
    finally { setSavingSalary(false); }
  };

  // All employees including those without salary records
  const allEmployeesWithSalary = employees.map(emp => {
    const s = salaries.find(sl => sl.userId === emp.id);
    return { ...emp, salary: s };
  });

  return (
    <div className="space-y-5">
      {result && (
        <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm ${result.success ? 'bg-teal-50 border border-teal-200 text-teal-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {result.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          <span>{result.message}</span>
          <button onClick={() => setResult(null)} className="ml-auto text-gray-400 hover:text-gray-600"><span className="text-xs">×</span></button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-1">
        {([
          { id: 'runs', label: 'Payroll Runs' },
          ...(role === 'admin' ? [{ id: 'salaries', label: 'Salary Setup' }] : []),
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${tab === t.id ? 'text-[#0A1F44] border-b-2 border-[#0A1F44]' : 'text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
        {role === 'admin' && (
          <div className="ml-auto">
            <button onClick={() => setShowRunModal(true)} className="flex items-center gap-1.5 bg-[#0A1F44] hover:bg-[#1E3A5F] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
              <Play className="w-3 h-3" />Generate Payroll
            </button>
          </div>
        )}
      </div>

      {/* Run modal */}
      {showRunModal && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" />Generate Monthly Payroll</h4>
          <div className="flex items-center gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Pay Period (YYYY-MM)</label>
              <input type="month" value={period} onChange={e => setPeriod(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleRunPayroll} disabled={running} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                {running ? 'Generating...' : 'Generate'}
              </button>
              <button onClick={() => setShowRunModal(false)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Runs */}
      {tab === 'runs' && (
        <div className="space-y-3">
          {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            : runs.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                No payroll runs yet.{role === 'admin' ? ' Click "Generate Payroll" to create the first one.' : ''}
              </div>
            ) : runs.map(run => {
              const entries: PayrollEntry[] = JSON.parse(run.entries || '[]');
              const isExpanded = expandedRun === run.id;
              return (
                <div key={run.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#0A1F44] text-sm">{run.period}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${STATUS_STYLE[run.status]}`}>{run.status}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" />{run.employeeCount} employees</span>
                      </div>
                      <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
                        <span>Gross: <strong>{fmt(run.totalGross)}</strong></span>
                        <span>Deductions: <strong>{fmt(run.totalDeductions)}</strong></span>
                        <span>Net: <strong className="text-teal-700">{fmt(run.totalNet)}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {role === 'head-operations' && run.status === 'draft' && (
                        <button onClick={() => handleApprove(run.id)} disabled={actionLoading === run.id} className="flex items-center gap-1 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                          {actionLoading === run.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}Approve
                        </button>
                      )}
                      {['admin', 'head-operations'].includes(role) && run.status === 'approved' && (
                        <button onClick={() => handleMarkPaid(run.id)} disabled={actionLoading === run.id} className="flex items-center gap-1 bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                          {actionLoading === run.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Banknote className="w-3 h-3" />}Mark Paid
                        </button>
                      )}
                      <button onClick={() => setExpandedRun(isExpanded ? null : run.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="bg-gray-50"><th className="text-left px-4 py-2 font-semibold text-gray-500">Employee</th><th className="text-left px-4 py-2 font-semibold text-gray-500">Role</th><th className="text-right px-4 py-2 font-semibold text-gray-500">Basic</th><th className="text-right px-4 py-2 font-semibold text-gray-500">Allowances</th><th className="text-right px-4 py-2 font-semibold text-gray-500">Deductions</th><th className="text-right px-4 py-2 font-semibold text-gray-500">Net Pay</th></tr></thead>
                        <tbody className="divide-y divide-gray-50">
                          {entries.map(e => (
                            <tr key={e.userId} className="hover:bg-gray-50/50">
                              <td className="px-4 py-2.5 font-medium text-[#0A1F44]">{e.fullName}</td>
                              <td className="px-4 py-2.5 text-gray-500">{ROLE_LABEL[e.role] ?? e.role}</td>
                              <td className="px-4 py-2.5 text-right">{fmt(e.basicSalary)}</td>
                              <td className="px-4 py-2.5 text-right text-green-600">+{fmt(e.totalAllowances)}</td>
                              <td className="px-4 py-2.5 text-right text-red-500">-{fmt(e.totalDeductions)}</td>
                              <td className="px-4 py-2.5 text-right font-bold text-teal-700">{fmt(e.netPay)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Salary Setup (Admin only) */}
      {tab === 'salaries' && role === 'admin' && (
        <div className="space-y-3">
          {loading ? <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
            : allEmployeesWithSalary.map(emp => {
              const isEditing = editingSalary === emp.id;
              const s = emp.salary;
              const gross = s ? (parseFloat(s.basicSalary) + parseFloat(s.housingAllowance) + parseFloat(s.transportAllowance) + parseFloat(s.otherAllowances)) : null;
              const net = s ? (gross! - parseFloat(s.pension) - parseFloat(s.incomeTax) - parseFloat(s.otherDeductions)) : null;
              return (
                <div key={emp.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 bg-[#0A1F44] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {emp.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0A1F44] text-sm">{emp.fullName}</p>
                      <p className="text-xs text-gray-400">{ROLE_LABEL[emp.role] ?? emp.role}</p>
                    </div>
                    <div className="text-right mr-2">
                      {net !== null ? (
                        <>
                          <p className="text-sm font-bold text-teal-700">{fmt(net)}/mo</p>
                          <p className="text-xs text-gray-400">Net pay</p>
                        </>
                      ) : <span className="text-xs text-amber-600 font-medium">No salary set</span>}
                    </div>
                    <button onClick={() => isEditing ? setEditingSalary(null) : openSalaryEdit(emp)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-700 transition-colors">
                      {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  {isEditing && (
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {[
                          { key: 'basicSalary', label: 'Basic Salary' },
                          { key: 'housingAllowance', label: 'Housing Allow.' },
                          { key: 'transportAllowance', label: 'Transport Allow.' },
                          { key: 'otherAllowances', label: 'Other Allowances' },
                          { key: 'pension', label: 'Pension (8%)' },
                          { key: 'incomeTax', label: 'Income Tax (PAYE)' },
                          { key: 'otherDeductions', label: 'Other Deductions' },
                        ].map(f => (
                          <div key={f.key}>
                            <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                            <input type="number" min="0" step="0.01" value={salaryForm[f.key as keyof typeof salaryForm]} onChange={e => setSalaryForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                              placeholder="0.00" className="w-full px-2.5 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300" />
                          </div>
                        ))}
                      </div>
                      <button onClick={handleSaveSalary} disabled={savingSalary} className="flex items-center gap-1.5 bg-[#0A1F44] hover:bg-[#1E3A5F] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                        {savingSalary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        Save Salary
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
