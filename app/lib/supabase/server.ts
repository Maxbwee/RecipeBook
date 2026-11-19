import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

// Supabase client for Server Components, Server Functions and Route Handlers.
// Create a new one for every request; never share it between requests.
//
// With cacheComponents on, anything rendered using this client must sit inside
// a <Suspense> boundary (or under a loading.tsx).
export async function createClient() {
  // Supabase auth checks token expiry with Date.now(), which Next.js won't
  // allow while prerendering. connection() makes the rest wait for a real request.
  await connection()
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components can't set cookies. That's fine: proxy.ts
            // refreshes the session cookies on every request.
          }
        },
      },
    }
  )
}
