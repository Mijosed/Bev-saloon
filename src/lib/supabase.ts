import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

/** Pseudo PayPal.Me (sans l'URL), utilisé pour le règlement de l'acompte. */
export const paypalMe = import.meta.env.VITE_PAYPAL_ME

export const supabase = createClient(url, anonKey)
