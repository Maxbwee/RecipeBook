import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Pages anyone can visit without logging in.
const PUBLIC_PATHS = ['/login']

// Refreshes the Supabase session cookies and redirects based on login state.
// Called from proxy.ts in the project root.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          // Pass refreshed cookies to the page being rendered...
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          // ...and back to the browser.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value)
          )
        },
      },
    }
  )

  // getClaims() verifies the token, unlike getSession() which just reads the
  // cookie. Don't put other code between createServerClient and this call.
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims

  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (!isLoggedIn && !isPublic) {
    return redirectTo(request, response, '/login')
  }
  if (isLoggedIn && pathname === '/login') {
    return redirectTo(request, response, '/')
  }

  return response
}

// Redirect while keeping any refreshed session cookies.
function redirectTo(request: NextRequest, response: NextResponse, path: string) {
  const redirect = NextResponse.redirect(new URL(path, request.url))
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  return redirect
}
