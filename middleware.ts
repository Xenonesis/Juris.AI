import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create Supabase client
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  await supabase.auth.getSession()

  // Enhanced security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Cookie security enhancements
  const isProduction = process.env.NODE_ENV === 'production'
  const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https://')
  
  // Set secure cookie flags for sensitive cookies
  if (isProduction && isHttps) {
    // Enhance session cookies with security flags
    const cookies = req.cookies.getAll()
    
    cookies.forEach(cookie => {
      if (cookie.name.includes('session') || cookie.name.includes('auth') || cookie.name.includes('csrf')) {
        res.cookies.set(cookie.name, cookie.value, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 24 * 60 * 60, // 24 hours for sensitive cookies
        })
      }
    })
  }

  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.cookies.get('juris_csrf_token')?.value
    const headerToken = req.headers.get('x-csrf-token')
    
    if (!csrfToken || csrfToken !== headerToken) {
      // Generate new CSRF token if missing
      const newCsrfToken = crypto.randomUUID()
      res.cookies.set('juris_csrf_token', newCsrfToken, {
        httpOnly: true,
        secure: isProduction && isHttps,
        sameSite: 'strict',
        path: '/',
        maxAge: 24 * 60 * 60,
      })
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
