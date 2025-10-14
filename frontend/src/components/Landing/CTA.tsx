'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function CTA() {
    const [email, setEmail] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle email submission
        window.location.href = `/register?email=${encodeURIComponent(email)}`
    }

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-primary-900 via-primary-600 to-primary-500 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Workflows?
                </h2>
                <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
                    Join 500+ enterprise teams automating their operations with FlowForge.
                    Start your free 14-day trial today—no credit card required.
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
                    <Input
                        type="email"
                        placeholder="Enter your work email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 h-14 text-lg"
                    />
                    <Button type="submit" variant="secondary" size="lg" className="px-8 h-14 text-lg whitespace-nowrap">
                        Start Free Trial
                    </Button>
                </form>

                {/* Trust Indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-200">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Free 14-day trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Cancel anytime</span>
                    </div>
                </div>

                {/* Additional CTA */}
                <p className="mt-8 text-gray-200">
                    Need enterprise pricing?{' '}
                    <a href="#contact" className="text-white font-semibold hover:underline">
                        Contact our sales team
                    </a>
                </p>
            </div>
        </section>
    )
}
