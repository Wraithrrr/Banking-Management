const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface SessionUser {
  id: number
  fullName: string
  email: string
  role: string
  bankId: number
  branchId: number | null
  token: string
}

const STORAGE_KEY = 'smartes_session'

// ─── Role → dashboard path map ──────────────────────────────────────────────
export const ROLE_PATHS: Record<string, string> = {
  owner: '/banking/smart-bank/owner',
  compliance: '/banking/smart-bank/compliance',
  'internal-control': '/banking/smart-bank/internal-control',
  'head-operations': '/banking/smart-bank/head-operations',
  'head-credit': '/banking/smart-bank/head-credit',
  'branch-manager': '/banking/smart-bank/branch-manager',
  'credit-officer': '/banking/smart-bank/credit-officer',
  'customer-service': '/banking/smart-bank/customer-service',
  'account-officer': '/banking/smart-bank/account-officer',
  teller: '/banking/smart-bank/teller',
  admin: '/banking/smart-bank/admin',
}

// ─── Login ───────────────────────────────────────────────────────────────────
export async function loginWithCredentials(email: string, password: string): Promise<SessionUser> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Invalid email or password.')
  }

  const data = await res.json()
  const session: SessionUser = { ...data.user, token: data.access_token }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }
  return session
}

// ─── Get stored session ───────────────────────────────────────────────────────
export function getStoredUser(): SessionUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

// ─── Get token for API calls ──────────────────────────────────────────────────
export function getToken(): string | null {
  return getStoredUser()?.token ?? null
}

// ─── Authenticated fetch helper ───────────────────────────────────────────────
export async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken()
  const isFormData = options.body instanceof FormData
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
}

// ─── Logout ───────────────────────────────────────────────────────────────────
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
    window.location.href = '/login'
  }
}
