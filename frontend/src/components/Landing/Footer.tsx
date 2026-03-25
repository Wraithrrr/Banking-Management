import Link from 'next/link'
import { Building2, Mail, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0A1F44] text-blue-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                SmartES <span className="text-[#F97316]">Banking</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 max-w-xs text-blue-300">
              The complete banking management platform for Nigerian banks. Built for CBN compliance, Shariah banking, and enterprise RBAC.
            </p>
            <div className="space-y-2">
              <a href="mailto:support@smartes.com.ng" className="flex items-center gap-2 text-sm text-blue-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                support@smartes.com.ng
              </a>
              <a href="https://www.smartes.com.ng" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
                www.smartes.com.ng
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="#features" className="text-sm text-blue-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-blue-400 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="#faq" className="text-sm text-blue-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/banking/smart-bank" className="text-sm text-blue-400 hover:text-white transition-colors">Live Demo</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Account</h4>
            <ul className="space-y-2.5">
              <li><Link href="/register" className="text-sm text-blue-400 hover:text-white transition-colors">Register Your Bank</Link></li>
              <li><Link href="/login" className="text-sm text-blue-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><a href="mailto:support@smartes.com.ng" className="text-sm text-blue-400 hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blue-500">
            &copy; {new Date().getFullYear()} SmartES Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-blue-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-blue-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
