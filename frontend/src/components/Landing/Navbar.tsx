'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Building2, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1F44] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              SmartES <span className="text-[#F97316]">Banking</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-blue-200 hover:text-white text-sm font-medium transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-blue-200 hover:text-white text-sm font-medium transition-colors">How It Works</Link>
            <Link href="#faq" className="text-blue-200 hover:text-white text-sm font-medium transition-colors">FAQ</Link>
            <Link href="/login" className="text-blue-200 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
            <Link
              href="/register"
              className="bg-[#F97316] hover:bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Register Your Bank
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-1">
            <Link href="#features" className="block text-blue-200 hover:text-white text-sm font-medium py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="block text-blue-200 hover:text-white text-sm font-medium py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
            <Link href="#faq" className="block text-blue-200 hover:text-white text-sm font-medium py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
            <Link href="/login" className="block text-blue-200 hover:text-white text-sm font-medium py-2.5 px-2 rounded-lg hover:bg-white/5 transition-colors">Sign In</Link>
            <div className="pt-2">
              <Link
                href="/register"
                className="block w-full text-center bg-[#F97316] hover:bg-orange-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Register Your Bank
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
