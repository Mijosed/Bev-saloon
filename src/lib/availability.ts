import type { BusySlot, ExtraSlot } from './bookings'

/** Ouverture par défaut : samedi et dimanche, 8h–18h. */
export const OPEN_START = 8 * 60
export const OPEN_END = 18 * 60
/** Granularité des heures de début proposées. */
const STEP = 30

export type Interval = { start: number; end: number }

export function toMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}

export function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Parse "YYYY-MM-DD" en date locale (évite le décalage UTC de new Date(string)). */
export function parseDate(date: string): Date {
  const [y = 1970, m = 1, d = 1] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isWeekend(date: string): boolean {
  const day = parseDate(date).getDay()
  return day === 0 || day === 6
}

export function formatDateFR(date: string): string {
  return parseDate(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function mergeIntervals(list: Interval[]): Interval[] {
  const sorted = [...list].sort((a, b) => a.start - b.start)
  const merged: Interval[] = []
  for (const iv of sorted) {
    const last = merged[merged.length - 1]
    if (last && iv.start <= last.end) last.end = Math.max(last.end, iv.end)
    else merged.push({ ...iv })
  }
  return merged
}

/** Retire une plage fermée d'une liste de plages ouvertes. */
function subtract(windows: Interval[], cut: Interval): Interval[] {
  const result: Interval[] = []
  for (const w of windows) {
    if (cut.end <= w.start || cut.start >= w.end) {
      result.push(w)
      continue
    }
    if (cut.start > w.start) result.push({ start: w.start, end: cut.start })
    if (cut.end < w.end) result.push({ start: cut.end, end: w.end })
  }
  return result
}

/**
 * Plages ouvertes pour une date :
 * week-end par défaut + créneaux ouverts par l'admin, moins les créneaux qu'elle a fermés.
 */
export function openWindows(date: string, extra: ExtraSlot[]): Interval[] {
  const windows: Interval[] = []
  if (isWeekend(date)) windows.push({ start: OPEN_START, end: OPEN_END })
  for (const slot of extra) {
    if (slot.date === date && slot.kind === 'open') {
      windows.push({ start: toMinutes(slot.start_time), end: toMinutes(slot.end_time) })
    }
  }

  let merged = mergeIntervals(windows)
  for (const slot of extra) {
    if (slot.date === date && slot.kind === 'closed') {
      merged = subtract(merged, { start: toMinutes(slot.start_time), end: toMinutes(slot.end_time) })
    }
  }
  return merged
}

export function isDateOpen(date: string, extra: ExtraSlot[]): boolean {
  return openWindows(date, extra).length > 0
}

/**
 * Heures de début possibles pour une prestation d'une durée donnée.
 *
 * Toute la plage d'ouverture est proposée, quelle que soit la durée : une
 * prestation peut se terminer après l'heure de fermeture. La durée sert
 * uniquement à écarter les créneaux qui chevaucheraient un rendez-vous déjà pris.
 */
export function availableStarts(
  date: string,
  durationH: number,
  busy: BusySlot[],
  extra: ExtraSlot[],
): string[] {
  const need = durationH * 60
  const taken = busy
    .filter((b) => b.date === date)
    .map((b) => ({ start: toMinutes(b.time), end: toMinutes(b.time) + b.duration_h * 60 }))

  const starts: string[] = []
  for (const window of openWindows(date, extra)) {
    for (let start = window.start; start <= window.end; start += STEP) {
      const end = start + need
      const overlaps = taken.some((t) => start < t.end && end > t.start)
      if (!overlaps) starts.push(toHHMM(start))
    }
  }
  return starts
}
