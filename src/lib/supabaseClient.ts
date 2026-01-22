import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase public env vars are missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

export function getSupabaseClient() {
  return supabase
}

// import { createClient, SupabaseClient } from '@supabase/supabase-js';

// let supabaseClient: SupabaseClient | null = null;

// export function getSupabaseClient(): SupabaseClient {
//   if (supabaseClient) return supabaseClient;

//   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//   if (!url || !anonKey) {
//     throw new Error('Supabase public env vars are missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
//   }

//   supabaseClient = createClient(url, anonKey, {
//     auth: {
//       persistSession: true,
//       autoRefreshToken: true,
//     },
//   });

//   return supabaseClient;
// }


// Alias for backward compatibility
export function getSupabaseClient() {
  return supabase;
}

// Server-side admin client (for API routes)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase server environment variables');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
