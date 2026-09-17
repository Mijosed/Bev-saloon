import { supabase, adminEmail } from './supabase'
import type { ServiceType } from '@/data/services'

export type Booking = {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  type: ServiceType
  service_id: string
  service: string
  date: string
  time: string
  duration_h: number
  price: number
  deposit: number
  paid: boolean
  status: 'confirmed' | 'cancelled'
  notes: string
}

export type NewBooking = Omit<Booking, 'id' | 'created_at' | 'status'>

/** Vue publique : uniquement les créneaux occupés, sans aucune donnée personnelle. */
export type BusySlot = { date: string; time: string; duration_h: number }

export type SlotKind = 'open' | 'closed'

export type ExtraSlot = {
  id: string
  date: string
  start_time: string
  end_time: string
  kind: SlotKind
}

type BusySlotRow = { slot_date: string; slot_time: string; slot_duration_h: number }

export async function fetchBusySlots(from: string, to: string): Promise<BusySlot[]> {
  const { data, error } = await supabase.rpc('busy_slots', { from_date: from, to_date: to })
  if (error) throw error
  return ((data ?? []) as BusySlotRow[]).map((row) => ({
    date: row.slot_date,
    time: row.slot_time,
    duration_h: Number(row.slot_duration_h),
  }))
}

export async function fetchExtraSlots(): Promise<ExtraSlot[]> {
  const { data, error } = await supabase
    .from('extra_slots')
    .select('id, date, start_time, end_time, kind')
    .order('date')
  if (error) throw error
  return data ?? []
}

export async function createBooking(booking: NewBooking): Promise<void> {
  const { error } = await supabase.from('bookings').insert(booking)
  if (error) throw error
}

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date')
    .order('time')
  if (error) throw error
  return data ?? []
}

export async function cancelBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
  if (error) throw error
}

export async function restoreBooking(id: string): Promise<void> {
  const { error } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', id)
  if (error) throw error
}

export async function addExtraSlot(
  date: string,
  start: string,
  end: string,
  kind: SlotKind,
): Promise<void> {
  const { error } = await supabase
    .from('extra_slots')
    .insert({ date, start_time: start, end_time: end, kind })
  if (error) throw error
}

export async function deleteExtraSlot(id: string): Promise<void> {
  const { error } = await supabase.from('extra_slots').delete().eq('id', id)
  if (error) throw error
}

export async function signInAdmin(password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password })
  if (error) throw error
}

export async function signOutAdmin() {
  await supabase.auth.signOut()
}

export async function currentSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
