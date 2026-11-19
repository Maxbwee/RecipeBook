import type { NextRequest } from 'next/server'
import { updateSession } from './app/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Run on every page except:
     * - _next/static, _next/image (build output and image optimisation)
     * - favicon.ico, manifest.webmanifest, sw.js (PWA and browser files)
     * - image files from public/ (e.g. the app icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
