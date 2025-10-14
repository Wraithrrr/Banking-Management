'use client'
import { useState } from 'react'

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    const plans = [
        {
            name: 'Starter',
            description: 'Perfect for small teams getting started',
            monthlyPrice: 99,
            annualPrice: 950,
            features: [
                'Up to 10 workflows',
                '1,000 tasks/month',
                'Basic integrations',
                'Email support',
                '7-day data retention',
                '2 team members',
            ],
            cta: 'Start Free Trial',
            popular: false,
        },
        {
            name: 'Professional',
            description: 'For growing teams with advanced needs',
            monthlyPrice: 299,
            annualPrice: 2870,
            features: [
                'Unlimited workflows',
                '10,000 tasks/month',
                'All integrations',
                'Priority support',
                '30-day data retention',
                '10 team members',
                'Advanced analytics',
                'Custom branding',
            ],
            cta: 'Start Free Trial',
            popular: true,
        },
        {
            name: 'Enterprise',
            description: 'For large organizations at scale',
            monthlyPrice: null,
            annualPrice: null,
            features: [
                'Unlimited everything',
                'Unlimited tasks',
                'Custom integrations',
                'Dedicated support',
                'Unlimited data retention',
                'Unlimited team members',
                'Advanced security (SSO, SAML)',
                'SLA guarantee',
                'Custom contracts',
                'On-premise deployment',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ]

    return (
        <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-background to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Pricing</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Choose the plan that fits your needs. All plans include a 14-day free trial.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-md">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${billingCycle === 'monthly'
                                    ? 'bg-primary-900 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-6 py-2 rounded-full font-medium transition-all relative ${billingCycle === 'annual'
                                    ? 'bg-primary-900 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Annual
                            <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs px-2 py-0.5 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-8 ${plan.popular
                                    ? 'bg-gradient-to-br from-primary-900 to-primary-600 text-white shadow-2xl scale-105 border-4 border-accent-500'
                                    : 'bg-white border-2 border-gray-200 hover:border-primary-500 transition-all'
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-6">
                                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                    {plan.name}
                                </h3>
                                <p className={`${plan.popular ? 'text-gray-100' : 'text-gray-600'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                {plan.monthlyPrice ? (
                                    <>
                                        <div className="flex items-baseline">
                                            <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                                ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)}
                                            </span>
                                            <span className={`ml-2 ${plan.popular ? 'text-gray-200' : 'text-gray-600'}`}>
                                                /month
                                            </span>
                                        </div>
                                        {billingCycle === 'annual' && (
                                            <p className={`text-sm mt-1 ${plan.popular ? 'text-gray-200' : 'text-gray-600'}`}>
                                                Billed annually at ${plan.annualPrice}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                        Custom
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <a
                                href={plan.monthlyPrice ? '/register' : '#contact'}
                                className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all mb-6 ${plan.popular
                                        ? 'bg-white text-primary-900 hover:bg-gray-100'
                                        : 'bg-primary-900 text-white hover:bg-primary-600'
                                    }`}
                            >
                                {plan.cta}
                            </a>

                            {/* Features */}
                            <ul className="space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <svg
                                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-accent-500' : 'text-accent-500'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className={`${plan.popular ? 'text-gray-100' : 'text-gray-600'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* FAQ Link */}
                <p className="text-center mt-12 text-gray-600">
                    Have questions?{' '}
                    <a href="#faq" className="text-primary-900 hover:underline font-semibold">
                        Check our FAQ
                    </a>{' '}
                    or{' '}
                    <a href="#contact" className="text-primary-900 hover:underline font-semibold">
                        contact sales
                    </a>
                </p>
            </div>
        </section>
    )
}
