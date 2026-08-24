import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-only client (API routes, server components) — uses the service role
// key, which bypasses RLS. Never import this from client components and never
// expose SUPABASE_SERVICE_ROLE_KEY with a NEXT_PUBLIC_ prefix.
export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.'
    );
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    // Next.js patches global fetch to cache GET requests by default — without
    // this, reads through this client can silently return stale data cached
    // from an earlier request instead of hitting Supabase.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}
