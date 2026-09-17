<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Lock, Loader2, LogOut, CalendarDays, BarChart3, Plus, Trash2,
  X, RotateCcw, AlertCircle, Mail, Phone,
} from 'lucide-vue-next'
import {
  fetchBookings, cancelBooking, restoreBooking, fetchExtraSlots,
  addExtraSlot, deleteExtraSlot, signInAdmin, signOutAdmin, currentSession,
} from '@/lib/bookings'
import type { Booking, ExtraSlot } from '@/lib/bookings'
import { formatDateFR, toISODate, toMinutes, toHHMM } from '@/lib/availability'

const authed = ref(false)
const password = ref('')
const loginError = ref('')
const loggingIn = ref(false)

const tab = ref<'agenda' | 'recap' | 'creneaux'>('agenda')
const bookings = ref<Booking[]>([])
const extraSlots = ref<ExtraSlot[]>([])
const loading = ref(false)
const error = ref('')
const showCancelled = ref(false)

const newSlot = ref({ date: '', start: '09:00', end: '18:00' })
const slotError = ref('')

const today = toISODate(new Date())

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [list, slots] = await Promise.all([fetchBookings(), fetchExtraSlots()])
    bookings.value = list
    extraSlots.value = slots
  } catch {
    error.value = 'Impossible de charger les données.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (await currentSession()) {
    authed.value = true
    await load()
  }
})

async function login() {
  loggingIn.value = true
  loginError.value = ''
  try {
    await signInAdmin(password.value)
    authed.value = true
    password.value = ''
    await load()
  } catch {
    loginError.value = 'Mot de passe incorrect.'
  } finally {
    loggingIn.value = false
  }
}

async function logout() {
  await signOutAdmin()
  authed.value = false
  bookings.value = []
}

async function onCancel(booking: Booking) {
  if (!confirm(`Annuler le rendez-vous de ${booking.name} le ${formatDateFR(booking.date)} à ${booking.time} ?\n\nLe créneau redeviendra disponible à la réservation.`)) return
  await cancelBooking(booking.id)
  await load()
}

async function onRestore(booking: Booking) {
  await restoreBooking(booking.id)
  await load()
}

async function onAddSlot() {
  slotError.value = ''
  if (!newSlot.value.date) { slotError.value = 'Choisissez une date.'; return }
  if (newSlot.value.end <= newSlot.value.start) { slotError.value = "L'heure de fin doit être après l'heure de début."; return }
  await addExtraSlot(newSlot.value.date, newSlot.value.start, newSlot.value.end)
  newSlot.value.date = ''
  await load()
}

async function onRemoveSlot(id: string) {
  await deleteExtraSlot(id)
  await load()
}

const confirmed = computed(() => bookings.value.filter((b) => b.status === 'confirmed'))
const cancelled = computed(() => bookings.value.filter((b) => b.status === 'cancelled'))
const upcoming = computed(() => confirmed.value.filter((b) => b.date >= today))
const past = computed(() => confirmed.value.filter((b) => b.date < today))

const visible = computed(() => (showCancelled.value ? cancelled.value : upcoming.value))

/** Rendez-vous groupés par jour pour l'agenda. */
const grouped = computed(() => {
  const map = new Map<string, Booking[]>()
  for (const b of visible.value) {
    if (!map.has(b.date)) map.set(b.date, [])
    map.get(b.date)!.push(b)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
})

const stats = computed(() => ({
  upcoming: upcoming.value.length,
  revenue: upcoming.value.reduce((sum, b) => sum + Number(b.price), 0),
  deposits: confirmed.value.filter((b) => b.paid).reduce((sum, b) => sum + Number(b.deposit), 0),
  hair: upcoming.value.filter((b) => b.type === 'coiffure').length,
  nails: upcoming.value.filter((b) => b.type === 'ongles').length,
  done: past.value.length,
  cancelled: cancelled.value.length,
}))

const endTime = (b: Booking) => toHHMM(toMinutes(b.time) + Number(b.duration_h) * 60)
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<template>
  <div class="min-h-screen px-4 py-10" style="background: #0d0502">
    <div class="max-w-4xl mx-auto">

      <!-- ===== Connexion ===== -->
      <div v-if="!authed" class="max-w-sm mx-auto pt-16">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-full mb-5"
            style="background: rgba(240,216,23,0.15)">
            <Lock class="w-6 h-6" style="color: #f0d817" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-1" style="font-family: Montserrat, sans-serif">
            Espace admin
          </h1>
          <p class="text-white/40 text-sm">Accès réservé</p>
        </div>

        <form
          class="rounded-3xl p-6 space-y-4"
          style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)"
          @submit.prevent="login"
        >
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-white/50">
              Mot de passe
            </label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              class="w-full min-w-0 px-4 py-3 rounded-xl text-sm outline-none bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-[#f0d817]/50"
            />
          </div>

          <p v-if="loginError" class="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle class="w-4 h-4 shrink-0" />
            {{ loginError }}
          </p>

          <button
            type="submit"
            :disabled="loggingIn"
            class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            style="background: #f0d817; color: #0d0502"
          >
            <Loader2 v-if="loggingIn" class="w-4 h-4 animate-spin" />
            Se connecter
          </button>
        </form>
      </div>

      <!-- ===== Tableau de bord ===== -->
      <template v-else>
        <div class="flex items-center justify-between mb-8 gap-4">
          <h1 class="text-2xl font-bold text-white" style="font-family: Montserrat, sans-serif">
            Mon espace
          </h1>
          <button
            class="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            @click="logout"
          >
            <LogOut class="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        <!-- Onglets -->
        <div class="flex gap-1 rounded-2xl p-1 mb-8" style="background: rgba(255,255,255,0.06)">
          <button
            v-for="t in [
              { id: 'agenda', label: 'Agenda', icon: CalendarDays },
              { id: 'recap', label: 'Récap', icon: BarChart3 },
              { id: 'creneaux', label: 'Créneaux', icon: Plus },
            ]"
            :key="t.id"
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
            :style="tab === t.id
              ? 'background: #f0d817; color: #0d0502'
              : 'background: transparent; color: rgba(255,255,255,0.5)'"
            @click="tab = t.id as typeof tab"
          >
            <component :is="t.icon" class="w-4 h-4" />
            {{ t.label }}
          </button>
        </div>

        <p v-if="loading" class="text-white/40 text-sm">Chargement…</p>
        <p v-else-if="error" class="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle class="w-4 h-4" /> {{ error }}
        </p>

        <!-- ===== Agenda ===== -->
        <div v-else-if="tab === 'agenda'">
          <div class="flex gap-2 mb-5">
            <button
              class="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              :style="!showCancelled
                ? 'background: #f0d817; color: #0d0502'
                : 'background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6)'"
              @click="showCancelled = false"
            >
              À venir ({{ upcoming.length }})
            </button>
            <button
              class="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              :style="showCancelled
                ? 'background: #f0d817; color: #0d0502'
                : 'background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6)'"
              @click="showCancelled = true"
            >
              Annulés ({{ cancelled.length }})
            </button>
          </div>

          <p v-if="!grouped.length" class="text-white/40 text-sm py-10 text-center">
            {{ showCancelled ? 'Aucun rendez-vous annulé.' : 'Aucun rendez-vous à venir.' }}
          </p>

          <div v-for="[date, items] in grouped" :key="date" class="mb-8">
            <h2 class="font-semibold text-xs uppercase tracking-widest mb-3" style="color: #f0d817">
              {{ capitalize(formatDateFR(date)) }}
            </h2>

            <div class="space-y-3">
              <div
                v-for="b in items"
                :key="b.id"
                class="rounded-2xl p-5"
                style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08)"
              >
                <div class="flex items-start justify-between gap-4 mb-3">
                  <div class="min-w-0">
                    <p class="font-bold text-white">{{ b.time.slice(0, 5) }} – {{ endTime(b) }}</p>
                    <p class="text-sm mt-0.5" :style="b.type === 'coiffure' ? 'color: #f0d817' : 'color: #ec4899'">
                      {{ b.service }}
                    </p>
                  </div>
                  <button
                    v-if="b.status === 'confirmed'"
                    class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-300 transition-colors hover:text-red-200"
                    style="background: rgba(248,113,113,0.12)"
                    @click="onCancel(b)"
                  >
                    <X class="w-3.5 h-3.5" />
                    Annuler
                  </button>
                  <button
                    v-else
                    class="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                    style="background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7)"
                    @click="onRestore(b)"
                  >
                    <RotateCcw class="w-3.5 h-3.5" />
                    Rétablir
                  </button>
                </div>

                <p class="text-white font-semibold text-sm">{{ b.name }}</p>
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-white/50">
                  <a :href="`tel:${b.phone}`" class="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Phone class="w-3.5 h-3.5" /> {{ b.phone }}
                  </a>
                  <a :href="`mailto:${b.email}`" class="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Mail class="w-3.5 h-3.5" /> {{ b.email }}
                  </a>
                </div>

                <p v-if="b.notes" class="text-xs text-white/50 mt-3 italic">« {{ b.notes }} »</p>

                <div class="flex items-center gap-3 mt-3 pt-3 text-xs" style="border-top: 1px solid rgba(255,255,255,0.06)">
                  <span class="text-white/50">{{ b.price }}€</span>
                  <span
                    class="px-2 py-0.5 rounded-full font-semibold"
                    :style="b.paid
                      ? 'background: rgba(62,179,8,0.15); color: #6ee06e'
                      : 'background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5)'"
                  >
                    Acompte {{ b.deposit }}€ {{ b.paid ? 'réglé' : 'en attente' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== Récap ===== -->
        <div v-else-if="tab === 'recap'" class="grid grid-cols-2 gap-3">
          <div v-for="card in [
            { label: 'RDV à venir', value: stats.upcoming },
            { label: 'Chiffre d\'affaires prévu', value: `${stats.revenue}€` },
            { label: 'Acomptes encaissés', value: `${stats.deposits}€` },
            { label: 'RDV passés', value: stats.done },
            { label: 'Coiffure à venir', value: stats.hair },
            { label: 'Ongles à venir', value: stats.nails },
            { label: 'Annulations', value: stats.cancelled },
          ]" :key="card.label"
            class="rounded-2xl p-5"
            style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08)"
          >
            <p class="text-xs uppercase tracking-wide text-white/40 mb-2">{{ card.label }}</p>
            <p class="text-2xl font-extrabold" style="color: #f0d817">{{ card.value }}</p>
          </div>
        </div>

        <!-- ===== Créneaux ===== -->
        <div v-else>
          <p class="text-white/50 text-sm mb-6">
            Les samedis et dimanches de 8h à 18h sont ouverts automatiquement.
            Ajoutez ici des créneaux supplémentaires (un autre jour, ou des horaires élargis).
          </p>

          <div class="rounded-2xl p-5 mb-8" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08)">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div class="min-w-0">
                <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-white/50">Date</label>
                <input
                  v-model="newSlot.date"
                  type="date"
                  :min="today"
                  class="block w-full min-w-0 appearance-none px-3 py-3 rounded-xl text-sm outline-none bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-[#f0d817]/50 [color-scheme:dark]"
                />
              </div>
              <div class="min-w-0">
                <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-white/50">Début</label>
                <input
                  v-model="newSlot.start"
                  type="time"
                  step="1800"
                  class="block w-full min-w-0 appearance-none px-3 py-3 rounded-xl text-sm outline-none bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-[#f0d817]/50 [color-scheme:dark]"
                />
              </div>
              <div class="min-w-0">
                <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-white/50">Fin</label>
                <input
                  v-model="newSlot.end"
                  type="time"
                  step="1800"
                  class="block w-full min-w-0 appearance-none px-3 py-3 rounded-xl text-sm outline-none bg-white/10 text-white border border-white/10 focus:ring-2 focus:ring-[#f0d817]/50 [color-scheme:dark]"
                />
              </div>
            </div>

            <p v-if="slotError" class="flex items-center gap-2 text-red-400 text-sm mb-3">
              <AlertCircle class="w-4 h-4 shrink-0" /> {{ slotError }}
            </p>

            <button
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style="background: #f0d817; color: #0d0502"
              @click="onAddSlot"
            >
              <Plus class="w-4 h-4" />
              Ouvrir ce créneau
            </button>
          </div>

          <h2 class="font-semibold text-xs uppercase tracking-widest mb-3" style="color: #f0d817">
            Créneaux ajoutés
          </h2>
          <p v-if="!extraSlots.length" class="text-white/40 text-sm">Aucun créneau supplémentaire.</p>
          <ul v-else class="space-y-2">
            <li
              v-for="slot in extraSlots"
              :key="slot.id"
              class="flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm"
              style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08)"
            >
              <span class="text-white/70 min-w-0">
                {{ capitalize(formatDateFR(slot.date)) }}
                <span class="text-white/40"> · {{ slot.start_time.slice(0, 5) }} – {{ slot.end_time.slice(0, 5) }}</span>
              </span>
              <button class="shrink-0 text-white/30 hover:text-red-400 transition-colors" @click="onRemoveSlot(slot.id)">
                <Trash2 class="w-4 h-4" />
              </button>
            </li>
          </ul>
        </div>
      </template>

    </div>
  </div>
</template>
