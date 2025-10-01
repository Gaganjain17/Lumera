import { getSupabaseClient } from '@/lib/supabaseClient';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return getSupabaseClient();
}

export async function createAdminClient() {
  return getSupabaseAdmin();
}
