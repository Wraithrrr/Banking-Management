'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-900 to-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">F</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">FlowForge</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-gray-600 hover:text-primary-900 transition-colors">
                            Features
                        </Link>
                        <Link href="#pricing" className="text-gray-600 hover:text-primary-900 transition-colors">
                            Pricing
                        </Link>
                        <Link href="#testimonials" className="text-gray-600 hover:text-primary-900 transition-colors">
                            Testimonials
                        </Link>
                        <Link href="#faq" className="text-gray-600 hover:text-primary-900 transition-colors">
                            FAQ
                        </Link>
                        <Link href="/login" className="text-gray-600 hover:text-primary-900 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register">
                            <Button variant="default" size="default">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 space-y-4">
                        <Link
                            href="#features"
                            className="block text-gray-600 hover:text-primary-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="#pricing"
                            className="block text-gray-600 hover:text-primary-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="#testimonials"
                            className="block text-gray-600 hover:text-primary-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Testimonials
                        </Link>
                        <Link
                            href="#faq"
                            className="block text-gray-600 hover:text-primary-900 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link href="/login" className="block text-gray-600 hover:text-primary-900 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/register">
                            <Button variant="default" size="default" className="w-full">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}
