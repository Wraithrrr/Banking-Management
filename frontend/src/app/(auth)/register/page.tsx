'use client'
import { signIn } from 'next-auth/react'
import AuthForm from '@/components/AuthForm'
import Link from 'next/link'
import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const company = formData.get('company') as string
    
    const result = await signIn('credentials', {
      email,
      password,
      company,
      action: 'register',
      redirect: false,
    })
    
    if (result?.ok) {
      router.push('/dashboard')
    } else {
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your FlowForge account
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-500">
            Start automating your enterprise workflows today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <AuthForm type="register" />
          <div className="text-center">
            <Link
              href="/login"
              className="text-primary-900 hover:underline font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
