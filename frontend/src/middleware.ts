import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect all /banking/** routes — redirect to /login if no session token
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/banking')) {
    // Token is stored in localStorage (client-side only), so we use a cookie
    // set by the login page as a lightweight presence check in middleware.
    const sessionCookie = request.cookies.get('smartes_auth')
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/banking/:path*'],
}
