'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, Eye, EyeOff, Loader2, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react'

type Stage = 'otp' | 'set-password' | 'done'

export default function FirstLoginPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('otp')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userToken, setUserToken] = useState('')

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpString = otp.join('')
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (otpString.length < 6) { setError('Please enter the full 6-digit OTP.'); return }
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Invalid OTP. Please check and try again.')
      setUserToken(data.token)
      setStage('set-password')
    } catch (e: any) {
      setError(e.message || 'Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPassword = async () => {
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to set password. Please try again.')
      setStage('done')
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-[#F97316] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span className="text-[#0A1F44]">SmartES</span>
              <span className="text-[#F97316]"> Banking</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Stage: Enter OTP */}
          {stage === 'otp' && (
            <div className="p-8">
              <div className="w-11 h-11 bg-[#0A1F44] rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#0A1F44] mb-2">First-Time Login</h1>
              <p className="text-[#64748B] text-sm mb-7 leading-relaxed">
                Enter your email address and the 6-digit OTP your IT Administrator shared with you to activate your account.
              </p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your.email@bank.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-3">One-Time Password (OTP)</label>
                  <div className="flex gap-2.5 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpRefs.current[index] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-13 h-[3.25rem] text-center text-xl font-bold border-2 border-gray-200 rounded-xl text-[#0A1F44] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#64748B] text-center mt-3">Ask your IT Administrator for your OTP</p>
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="mt-7 w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <>Verify OTP <ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-center text-sm text-[#64748B] mt-5">
                Already have a password?{' '}
                <Link href="/login" className="text-[#F97316] font-semibold hover:underline">Sign in here</Link>
              </p>
            </div>
          )}

          {/* Stage: Set Password */}
          {stage === 'set-password' && (
            <div className="p-8">
              <div className="w-11 h-11 bg-[#0D9488] rounded-xl flex items-center justify-center mb-5">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#0A1F44] mb-2">OTP Verified</h1>
              <p className="text-[#64748B] text-sm mb-7 leading-relaxed">
                Create a strong password for your account. You'll use this for all future logins.
              </p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0A1F44] mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/30 focus:border-[#F97316] transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSetPassword}
                disabled={isLoading}
                className="mt-7 w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Setting Password...</> : <>Activate My Account <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* Stage: Done */}
          {stage === 'done' && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#0D9488]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#0D9488]" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">Account Activated!</h2>
              <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
                Your SmartES Banking account is ready. Sign in with your email and new password.
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
      </div>
    </div>
  )
}
