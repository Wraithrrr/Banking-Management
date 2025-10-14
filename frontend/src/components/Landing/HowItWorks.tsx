export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Connect Your Tools',
            description: 'Integrate your existing enterprise systems with our secure API connectors in minutes.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
            ),
        },
        {
            number: '02',
            title: 'Design Workflows',
            description: 'Use our intuitive drag-and-drop builder or AI assistant to create automation workflows.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
            ),
        },
        {
            number: '03',
            title: 'Deploy & Monitor',
            description: 'Launch your workflows and track performance in real-time with comprehensive analytics.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            number: '04',
            title: 'Scale Effortlessly',
            description: 'Grow your automation as your business expands with enterprise-grade infrastructure.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
    ]

    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                        Get Started in 4 Simple Steps
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        From integration to automation in under 30 minutes
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-900 to-primary-600 opacity-20 -translate-x-1/2 z-0"></div>
                            )}

                            <div className="relative z-10">
                                {/* Number Badge */}
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                        {step.number}
                                    </div>
                                </div>

                                {/* Icon */}
                                <div className="mb-4 text-primary-900">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <a
                        href="/register"
                        className="inline-flex items-center gap-2 bg-primary-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                        Start Your Free Trial
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    )
}
