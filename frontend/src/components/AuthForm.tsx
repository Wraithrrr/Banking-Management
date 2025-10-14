'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface AuthFormProps {
  type: 'login' | 'register'
}

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Input
          name="email"
          type="email"
          placeholder="Email address"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        />
      </div>
      {type === 'register' && (
        <div>
          <Input
            name="company"
            type="text"
            placeholder="Company Name"
            required
          />
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        variant={type === 'login' ? 'default' : 'secondary'}
      >
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </div>
  )
}
