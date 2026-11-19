import { createBrowserClient } from '@supabase/ssr'

// Supabase client for Client Components ('use client') running in the browser.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
)
