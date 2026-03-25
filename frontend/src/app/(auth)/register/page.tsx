'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, ChevronRight, ChevronLeft, CheckCircle, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

type BankType = 'commercial' | 'microfinance' | 'islamic'

interface BankDetails {
  bankName: string
  bankType: BankType | ''
  cbnLicense: string
  rcNumber: string
}

interface AdminDetails {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const BANK_TYPES = [
  { value: 'commercial', label: 'Commercial Bank' },
  { value: 'microfinance', label: 'Microfinance Bank' },
  { value: 'islamic', label: 'Islamic / Non-Interest Bank' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    bankType: '',
    cbnLicense: '',
    rcNumber: '',
  })

  const [adminDetails, setAdminDetails] = useState<AdminDetails>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const validateStep1 = () => {
    if (!bankDetails.bankName.trim()) return 'Bank name is required.'
    if (!bankDetails.bankType) return 'Please select a bank type.'
    if (!bankDetails.cbnLicense.trim()) return 'CBN License Number is required.'
    if (!bankDetails.rcNumber.trim()) return 'RC Number is required.'
    return ''
  }

  const validateStep2 = () => {
    if (!adminDetails.fullName.trim()) return 'Full name is required.'
    if (!adminDetails.email.trim() || !adminDetails.email.includes('@')) return 'A valid email is required.'
    if (!adminDetails.phone.trim()) return 'Phone number is required.'
    if (adminDetails.password.length < 8) return 'Password must be at least 8 characters.'
    if (adminDetails.password !== adminDetails.confirmPassword) return 'Passwords do not match.'
    return ''
  }

  const handleStep1Next = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async () => {
    const err = validateStep2()
    if (err) { setError(err); return }
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banks/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: bankDetails.bankName,
          bankType: bankDetails.bankType,
          cbnLicenseNumber: bankDetails.cbnLicense,
          rcNumber: bankDetails.rcNumber,
          adminFullName: adminDetails.fullName,
          adminEmail: adminDetails.email,
          adminPhone: adminDetails.phone,
          adminPassword: adminDetails.password,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Registration failed. Please try again.')
      }

      setStep(3)
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-[#F97316] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-[#0A1F44]">SmartES</span>
              <span className="text-[#F97316]"> Banking</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-[#0A1F44]">Register Your Bank</h1>
          <p className="text-[#64748B] mt-2">Set up your bank on SmartES Banking in under 5 minutes</p>
        </div>

        {/* Step indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s
                    ? 'bg-[#0D9488] text-white'
                    : step === s
                    ? 'bg-[#0A1F44] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm font-medium ${step === s ? 'text-[#0A1F44]' : 'text-gray-400'}`}>
                  {s === 1 ? 'Bank Details' : 'IT Administrator'}
                </span>
                {s < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Step 1 */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-[#0A1F44] mb-1">Bank Information</h2>
              <p className="text-[#64748B] text-sm mb-7">Enter your bank's official registration details</p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Bank Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Kano State Cooperative Bank"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Bank Type <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BANK_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setBankDetails({ ...bankDetails, bankType: type.value as BankType })}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                          bankDetails.bankType === type.value
                            ? 'border-[#F97316] bg-orange-50 text-[#0A1F44]'
                            : 'border-gray-200 text-[#64748B] hover:border-gray-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-2">CBN License Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. CBN/LICN/2024/001"
                      value={bankDetails.cbnLicense}
                      onChange={(e) => setBankDetails({ ...bankDetails, cbnLicense: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-2">RC Number (CAC) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. RC 123456"
                      value={bankDetails.rcNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, rcNumber: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleStep1Next}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Continue to IT Admin Setup
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-[#0A1F44] mb-1">IT Administrator Account</h2>
              <p className="text-[#64748B] text-sm mb-7">This person will manage users and access for your bank</p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Chukwuemeka Nwosu"
                    value={adminDetails.fullName}
                    onChange={(e) => setAdminDetails({ ...adminDetails, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      placeholder="admin@yourbank.com"
                      value={adminDetails.email}
                      onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      placeholder="e.g. 0801 234 5678"
                      value={adminDetails.phone}
                      onChange={(e) => setAdminDetails({ ...adminDetails, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        value={adminDetails.password}
                        onChange={(e) => setAdminDetails({ ...adminDetails, password: e.target.value })}
                        className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat password"
                        value={adminDetails.confirmPassword}
                        onChange={(e) => setAdminDetails({ ...adminDetails, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => { setStep(1); setError('') }}
                  className="flex items-center gap-2 px-6 py-3.5 border border-gray-200 rounded-xl text-[#64748B] font-semibold hover:bg-gray-50 transition-all text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all"
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering Bank...</>
                    : 'Complete Registration'
                  }
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#0D9488]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">Registration Successful!</h2>
              <p className="text-[#64748B] mb-2 leading-relaxed">
                Welcome to SmartES Banking. Your bank <strong className="text-[#0A1F44]">{bankDetails.bankName}</strong> is now registered.
              </p>
              <p className="text-[#64748B] text-sm mb-8">
                Sign in with your IT Admin email and password to start adding your team.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Go to Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {step < 3 && (
          <p className="text-center text-sm text-[#64748B] mt-6">
            Already registered?{' '}
            <Link href="/login" className="text-[#F97316] font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
