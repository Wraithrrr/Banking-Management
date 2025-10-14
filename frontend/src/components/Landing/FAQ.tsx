'use client'
import { useState } from 'react'

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: 'What is FlowForge?',
            answer: 'FlowForge is an enterprise-grade workflow automation platform that helps large organizations streamline operations, reduce costs, and scale efficiently. It uses AI-powered automation to connect your existing tools and create intelligent workflows.',
        },
        {
            question: 'How long does implementation take?',
            answer: 'Most customers are up and running within 30 minutes to a few hours. Our intuitive interface and pre-built templates make it easy to start automating immediately. For complex enterprise deployments, our dedicated team provides white-glove onboarding support.',
        },
        {
            question: 'What integrations do you support?',
            answer: 'FlowForge integrates with 100+ enterprise tools including Salesforce, SAP, Microsoft 365, Slack, Jira, ServiceNow, and more. We also support custom API integrations and webhooks for any system.',
        },
        {
            question: 'Is my data secure?',
            answer: 'Absolutely. FlowForge is SOC 2 Type II certified with end-to-end encryption, SSO/SAML support, and role-based access control. We comply with GDPR, HIPAA, and other major data protection regulations. Enterprise customers can opt for on-premise deployment.',
        },
        {
            question: 'What kind of support do you offer?',
            answer: 'All plans include email support. Professional plans get priority support with faster response times. Enterprise customers receive dedicated account managers, 24/7 phone support, and a 99.9% SLA guarantee.',
        },
        {
            question: 'Can I try before I buy?',
            answer: 'Yes! All plans come with a 14-day free trial. No credit card required. You get full access to all features during the trial period so you can explore everything FlowForge has to offer.',
        },
        {
            question: 'How does pricing work?',
            answer: 'Pricing is based on your team size and usage. We offer transparent monthly and annual billing (save 20% with annual). Enterprise customers get custom pricing based on their specific needs. All plans include unlimited workflows.',
        },
        {
            question: 'Can I cancel anytime?',
            answer: 'Yes, you can cancel your subscription at any time. No long-term contracts required for Starter and Professional plans. Enterprise customers have flexible contract terms negotiated during sales.',
        },
        {
            question: 'Do you offer training?',
            answer: 'Yes! We provide comprehensive documentation, video tutorials, and webinars. Professional and Enterprise customers get personalized training sessions and ongoing education for their teams.',
        },
        {
            question: 'What happens to my data if I cancel?',
            answer: "You can export all your data before canceling. We retain your data for 30 days after cancellation to allow for reactivation. After that, data is permanently deleted per our data retention policy.",
        },
    ]

    return (
        <section id="faq" className="py-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about FlowForge
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-500 transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-900 pr-8">
                                    {faq.question}
                                </span>
                                <svg
                                    className={`w-6 h-6 text-primary-900 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 text-center p-8 bg-gradient-to-r from-primary-900 to-primary-600 rounded-2xl text-white">
                    <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                    <p className="mb-6 text-gray-100">
                        Our team is here to help. Get in touch with us.
                    </p>
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Contact Support
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}
