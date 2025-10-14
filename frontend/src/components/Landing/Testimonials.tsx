export default function Testimonials() {
    const testimonials = [
        {
            quote: "FlowForge transformed our operations. We've automated 80% of our manual processes and saved over $2M annually.",
            author: 'Sarah Chen',
            role: 'CTO',
            company: 'TechCorp Global',
            avatar: 'SC',
            rating: 5,
        },
        {
            quote: "The best workflow automation platform we've used. Implementation was seamless and ROI was immediate.",
            author: 'Michael Rodriguez',
            role: 'VP of Operations',
            company: 'Enterprise Solutions Inc.',
            avatar: 'MR',
            rating: 5,
        },
        {
            quote: "Incredible support team and powerful features. FlowForge scales with our enterprise needs perfectly.",
            author: 'Emily Watson',
            role: 'Head of Digital Transformation',
            company: 'Fortune 500 Co.',
            avatar: 'EW',
            rating: 5,
        },
        {
            quote: "We reduced operational costs by 60% in the first year. The analytics dashboard is a game-changer.",
            author: 'David Kim',
            role: 'Chief Operating Officer',
            company: 'Global Industries Ltd.',
            avatar: 'DK',
            rating: 5,
        },
        {
            quote: "FlowForge's AI-powered automation adapts to our changing business needs. Truly innovative platform.",
            author: 'Lisa Thompson',
            role: 'Director of IT',
            company: 'Mega Corp',
            avatar: 'LT',
            rating: 5,
        },
        {
            quote: "Security and compliance are top-notch. Perfect for regulated industries. Highly recommended!",
            author: 'James Anderson',
            role: 'CISO',
            company: 'FinTech Innovations',
            avatar: 'JA',
            rating: 5,
        },
    ]

    return (
        <section id="testimonials" className="py-20 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        See what our enterprise clients say about FlowForge
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-primary-500 hover:shadow-xl transition-all duration-300"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-gray-700 mb-6 leading-relaxed">
                                "{testimonial.quote}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center text-white font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    <div className="text-sm text-primary-900 font-medium">{testimonial.company}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-16 pt-16 border-t border-gray-200">
                    <p className="text-center text-gray-600 mb-8 font-semibold">Trusted by 500+ Enterprise Companies</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                        {/* Placeholder for company logos */}
                        {['Microsoft', 'Google', 'Amazon', 'IBM', 'Oracle', 'Salesforce'].map((company) => (
                            <div key={company} className="text-2xl font-bold text-gray-400">
                                {company}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
