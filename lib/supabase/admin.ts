import { createClient } from '@supabase/supabase-js'
import { getSupabaseServiceKey, getSupabaseUrl } from './env'

export function createAdminClient() {
  const url = getSupabaseUrl()
  const key = getSupabaseServiceKey()
  if (!url || !key) {
    throw new Error('Supabase admin credentials not configured')
  }
  return createClient(url, key)
}
