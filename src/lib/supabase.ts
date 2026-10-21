import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

export const supabase = createClient(url, anonKey)
