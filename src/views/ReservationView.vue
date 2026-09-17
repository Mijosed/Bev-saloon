<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CheckCircle, Scissors, Sparkles, User, Phone, Mail, ChevronDown,
  Instagram, ShieldCheck, Loader2, AlertCircle, ArrowLeft,
} from 'lucide-vue-next'
import { servicesByType, serviceById } from '@/data/services'
import { fetchBusySlots, fetchExtraSlots, createBooking } from '@/lib/bookings'
import type { BusySlot, ExtraSlot } from '@/lib/bookings'
import { availableStarts, isDateOpen, toISODate, formatDateFR } from '@/lib/availability'

const route = useRoute()
const router = useRouter()

const step = ref<'form' | 'payment' | 'done'>('form')
const loading = ref(true)
const loadError = ref('')
const paying = ref(false)
const payError = ref('')

const busy = ref<BusySlot[]>([])
const extra = ref<ExtraSlot[]>([])

const form = ref({
  name: '',
  email: '',
  phone: '',
  type: 'coiffure' as 'coiffure' | 'ongles',
  serviceId: '',
  date: '',
  time: '',
  notes: '',
})

const errors = ref<Record<string, string>>({})

const isHair = computed(() => form.value.type === 'coiffure')
const options = computed(() => servicesByType(form.value.type))
const selected = computed(() => serviceById(form.value.serviceId))

const openDates = computed(() => {
  const out: string[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() + 1)
  for (let i = 0; i < 90; i++) {
    const iso = toISODate(cursor)
    if (isDateOpen(iso, extra.value)) out.push(iso)
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
})

/** Les jours complets pour la durée choisie disparaissent de la liste. */
const selectableDates = computed(() => {
  const service = selected.value
  if (!service) return openDates.value
  return openDates.value.filter(
    (d) => availableStarts(d, service.durationH, busy.value, extra.value).length > 0,
  )
})

const times = computed(() => {
  const service = selected.value
  if (!service || !form.value.date) return []
  return availableStarts(form.value.date, service.durationH, busy.value, extra.value)
})

function setType(type: 'coiffure' | 'ongles') {
  form.value.type = type
  router.replace({ query: { ...route.query, type } })
}

watch(() => form.value.type, () => {
  form.value.serviceId = ''
  form.value.date = ''
  form.value.time = ''
})
watch(() => form.value.serviceId, () => { form.value.time = '' })
watch(() => form.value.date, () => { form.value.time = '' })

async function loadAvailability() {
  loading.value = true
  loadError.value = ''
  try {
    const from = toISODate(new Date())
    const until = new Date()
    until.setDate(until.getDate() + 95)
    const [busySlots, extraSlots] = await Promise.all([
      fetchBusySlots(from, toISODate(until)),
      fetchExtraSlots(),
    ])
    busy.value = busySlots
    extra.value = extraSlots
  } catch {
    loadError.value = "Impossible de charger les disponibilités pour le moment."
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (route.query.type === 'ongles') form.value.type = 'ongles'
  await loadAvailability()
  const wanted = route.query.service
  if (typeof wanted === 'string' && serviceById(wanted)) form.value.serviceId = wanted
})

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.name.trim()) e.name = 'Requis'
  if (!form.value.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Email invalide'
  if (!form.value.phone.trim()) e.phone = 'Requis'
  if (!form.value.serviceId) e.service = 'Choisissez une prestation'
  if (!form.value.date) e.date = 'Choisissez une date'
  if (!form.value.time) e.time = 'Choisissez un horaire'
  errors.value = e
  return Object.keys(e).length === 0
}

function goToPayment() {
  if (!validate()) return
  payError.value = ''
  step.value = 'payment'
}

async function pay() {
  const service = selected.value
  if (!service) return
  paying.value = true
  payError.value = ''
  try {
    // Simulation du tunnel de paiement PayPal — aucun paiement réel.
    await new Promise((resolve) => setTimeout(resolve, 1600))
    await createBooking({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      phone: form.value.phone.trim(),
      type: form.value.type,
      service_id: service.id,
      service: service.name,
      date: form.value.date,
      time: form.value.time,
      duration_h: service.durationH,
      price: service.price,
      deposit: service.deposit,
      paid: true,
      notes: form.value.notes.trim(),
    })
    step.value = 'done'
  } catch {
    payError.value = "Ce créneau vient d'être pris ou une erreur est survenue. Merci de choisir un autre horaire."
    await loadAvailability()
  } finally {
    paying.value = false
  }
}

function reset() {
  form.value = {
    name: '', email: '', phone: '',
    type: form.value.type, serviceId: '', date: '', time: '', notes: '',
  }
  errors.value = {}
  step.value = 'form'
  loadAvailability()
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<template>
  <div class="min-h-screen py-12 px-4" :style="isHair ? 'background: #0d0502' : 'background: #fdf6f0'">
    <div class="max-w-2xl mx-auto">

      <!-- ===== Confirmation ===== -->
      <div v-if="step === 'done'" class="text-center py-20">
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          :style="isHair ? 'background: rgba(240,216,23,0.15)' : 'background: #fce7f3'"
        >
          <CheckCircle class="w-10 h-10" :style="isHair ? 'color: #f0d817' : 'color: #ec4899'" />
        </div>
        <h2 class="text-2xl font-bold mb-3" :class="isHair ? 'text-white' : 'text-[#9d174d]'">
          Rendez-vous confirmé !
        </h2>
        <p :class="isHair ? 'text-white/60' : 'text-pink-400'" class="mb-8">
          Votre créneau est réservé et votre acompte enregistré.
          Vous recevrez une confirmation par email.
        </p>
        <button
          class="px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
          :style="isHair ? 'background: #f0d817; color: #0d0502' : 'background: #ec4899; color: white'"
          @click="reset"
        >
          Nouvelle réservation
        </button>
      </div>

      <!-- ===== Paiement de l'acompte ===== -->
      <template v-else-if="step === 'payment'">
        <button
          class="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          :class="isHair ? 'text-white/50 hover:text-white' : 'text-pink-400 hover:text-pink-600'"
          @click="step = 'form'"
        >
          <ArrowLeft class="w-4 h-4" />
          Modifier ma réservation
        </button>

        <div class="text-center mb-8">
          <h1 class="font-bold text-3xl mb-2" :class="isHair ? 'text-white' : 'text-[#9d174d]'"
            style="font-family: Montserrat, sans-serif">
            Acompte
          </h1>
          <p :class="isHair ? 'text-white/50' : 'text-pink-400'" class="text-sm">
            Votre rendez-vous est confirmé une fois l'acompte réglé.
          </p>
        </div>

        <!-- Récapitulatif -->
        <div
          class="rounded-3xl p-6 sm:p-8 mb-5"
          :style="isHair
            ? 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)'
            : 'background: white; border: 1px solid #fce7f3; box-shadow: 0 4px 24px rgba(236,72,153,0.08)'"
        >
          <h2 class="font-bold text-xs uppercase tracking-widest mb-5"
            :style="isHair ? 'color: #f0d817' : 'color: #ec4899'">
            Récapitulatif
          </h2>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between gap-4">
              <dt :class="isHair ? 'text-white/50' : 'text-pink-400'">Prestation</dt>
              <dd class="font-semibold text-right" :class="isHair ? 'text-white' : 'text-[#9d174d]'">
                {{ selected?.name }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt :class="isHair ? 'text-white/50' : 'text-pink-400'">Date</dt>
              <dd class="font-semibold text-right" :class="isHair ? 'text-white' : 'text-[#9d174d]'">
                {{ capitalize(formatDateFR(form.date)) }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt :class="isHair ? 'text-white/50' : 'text-pink-400'">Heure</dt>
              <dd class="font-semibold text-right" :class="isHair ? 'text-white' : 'text-[#9d174d]'">
                {{ form.time }}
              </dd>
            </div>
            <div class="flex justify-between gap-4">
              <dt :class="isHair ? 'text-white/50' : 'text-pink-400'">Tarif de la prestation</dt>
              <dd class="font-semibold text-right" :class="isHair ? 'text-white' : 'text-[#9d174d]'">
                {{ selected?.price }}€
              </dd>
            </div>
            <div class="flex justify-between gap-4 pt-3 border-t"
              :style="isHair ? 'border-color: rgba(255,255,255,0.08)' : 'border-color: #fce7f3'">
              <dt class="font-bold" :class="isHair ? 'text-white' : 'text-[#9d174d]'">Acompte à régler</dt>
              <dd class="font-extrabold text-xl" :style="isHair ? 'color: #f0d817' : 'color: #ec4899'">
                {{ selected?.deposit }}€
              </dd>
            </div>
          </dl>
          <p class="text-xs mt-4" :class="isHair ? 'text-white/40' : 'text-pink-300'">
            Le reste ({{ (selected?.price ?? 0) - (selected?.deposit ?? 0) }}€) est à régler sur place.
            L'acompte n'est pas remboursable en cas d'annulation.
          </p>
        </div>

        <!-- PayPal (simulation) -->
        <div
          class="rounded-3xl p-6 sm:p-8"
          :style="isHair
            ? 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)'
            : 'background: white; border: 1px solid #fce7f3; box-shadow: 0 4px 24px rgba(236,72,153,0.08)'"
        >
          <div class="flex items-center justify-center gap-1 mb-1">
            <span class="font-extrabold text-xl" style="color: #003087">Pay</span><span
              class="font-extrabold text-xl" style="color: #009cde">Pal</span>
          </div>
          <p class="text-center text-xs mb-6" :class="isHair ? 'text-white/40' : 'text-pink-300'">
            Mode démonstration — aucun paiement réel n'est effectué.
          </p>

          <div v-if="payError"
            class="flex items-start gap-2 text-sm rounded-xl p-3 mb-4"
            style="background: rgba(248,113,113,0.12); color: #f87171">
            <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
            <span>{{ payError }}</span>
          </div>

          <button
            class="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            style="background: #ffc439; color: #003087"
            :disabled="paying"
            @click="pay"
          >
            <Loader2 v-if="paying" class="w-5 h-5 animate-spin" />
            {{ paying ? 'Paiement en cours…' : `Payer ${selected?.deposit}€ avec PayPal` }}
          </button>

          <p class="flex items-center justify-center gap-1.5 text-xs mt-4"
            :class="isHair ? 'text-white/40' : 'text-pink-300'">
            <ShieldCheck class="w-3.5 h-3.5" />
            Paiement sécurisé
          </p>
        </div>
      </template>

      <!-- ===== Formulaire ===== -->
      <template v-else>
        <div class="text-center mb-10">
          <h1 class="font-bold text-3xl mb-2" :class="isHair ? 'text-white' : 'text-[#9d174d]'"
            style="font-family: Montserrat, sans-serif">
            Réservation
          </h1>
          <p :class="isHair ? 'text-white/50' : 'text-pink-400'" class="text-sm">
            Choisissez votre créneau, puis réglez l'acompte pour confirmer.
          </p>
        </div>

        <!-- Type -->
        <div
          class="flex rounded-2xl p-1 mb-8"
          :style="isHair ? 'background: rgba(255,255,255,0.06)' : 'background: #fce7f3'"
        >
          <button
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
            :style="isHair ? 'background: #f0d817; color: #0d0502' : 'background: transparent; color: #9d174d'"
            :class="!isHair ? 'opacity-50' : ''"
            @click="setType('coiffure')"
          >
            <Scissors class="w-4 h-4" />
            Coiffure
          </button>
          <button
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
            :style="!isHair ? 'background: #ec4899; color: white' : 'background: transparent; color: rgba(255,255,255,0.5)'"
            @click="setType('ongles')"
          >
            <Sparkles class="w-4 h-4" />
            Ongles
          </button>
        </div>

        <div
          class="rounded-3xl p-6 sm:p-8 space-y-5"
          :style="isHair
            ? 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)'
            : 'background: white; border: 1px solid #fce7f3; box-shadow: 0 4px 24px rgba(236,72,153,0.08)'"
        >
          <!-- Nom -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">Prénom & Nom</label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
              <input
                v-model="form.name"
                type="text"
                placeholder="Ex: Marie Dupont"
                class="w-full min-w-0 pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                :class="[
                  errors.name ? 'ring-2 ring-red-400' : '',
                  isHair
                    ? 'bg-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                    : 'bg-pink-50 text-gray-800 placeholder-pink-200 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                ]"
              />
            </div>
            <p v-if="errors.name" class="text-red-400 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email + Téléphone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="min-w-0">
              <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                :class="isHair ? 'text-white/50' : 'text-pink-400'">Email</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="vous@email.com"
                  class="w-full min-w-0 pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  :class="[
                    errors.email ? 'ring-2 ring-red-400' : '',
                    isHair
                      ? 'bg-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                      : 'bg-pink-50 text-gray-800 placeholder-pink-200 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                  ]"
                />
              </div>
              <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <div class="min-w-0">
              <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                :class="isHair ? 'text-white/50' : 'text-pink-400'">Téléphone</label>
              <div class="relative">
                <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="06 00 00 00 00"
                  class="w-full min-w-0 pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  :class="[
                    errors.phone ? 'ring-2 ring-red-400' : '',
                    isHair
                      ? 'bg-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                      : 'bg-pink-50 text-gray-800 placeholder-pink-200 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                  ]"
                />
              </div>
              <p v-if="errors.phone" class="text-red-400 text-xs mt-1">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Prestation -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">Prestation</label>
            <div class="relative">
              <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
              <select
                v-model="form.serviceId"
                class="w-full min-w-0 px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                :class="[
                  errors.service ? 'ring-2 ring-red-400' : '',
                  isHair
                    ? 'bg-white/10 text-white focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                    : 'bg-pink-50 text-gray-800 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                ]"
              >
                <option value="" disabled :style="isHair ? 'background: #1a0a03' : ''">Choisir une prestation...</option>
                <option v-for="s in options" :key="s.id" :value="s.id" :style="isHair ? 'background: #1a0a03' : ''">
                  {{ s.name }} — {{ s.price }}€
                </option>
              </select>
            </div>
            <p v-if="errors.service" class="text-red-400 text-xs mt-1">{{ errors.service }}</p>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">Date</label>

            <p v-if="loading" class="text-sm" :class="isHair ? 'text-white/40' : 'text-pink-300'">
              Chargement des disponibilités…
            </p>
            <p v-else-if="loadError" class="text-sm text-red-400">{{ loadError }}</p>
            <p v-else-if="!form.serviceId" class="text-sm" :class="isHair ? 'text-white/40' : 'text-pink-300'">
              Choisissez d'abord une prestation.
            </p>
            <p v-else-if="!selectableDates.length" class="text-sm" :class="isHair ? 'text-white/40' : 'text-pink-300'">
              Aucune date disponible pour cette prestation. Contactez-moi sur Instagram.
            </p>
            <div v-else class="relative">
              <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
              <select
                v-model="form.date"
                class="w-full min-w-0 px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                :class="[
                  errors.date ? 'ring-2 ring-red-400' : '',
                  isHair
                    ? 'bg-white/10 text-white focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                    : 'bg-pink-50 text-gray-800 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                ]"
              >
                <option value="" disabled :style="isHair ? 'background: #1a0a03' : ''">Choisir une date...</option>
                <option v-for="d in selectableDates" :key="d" :value="d" :style="isHair ? 'background: #1a0a03' : ''">
                  {{ capitalize(formatDateFR(d)) }}
                </option>
              </select>
            </div>
            <p v-if="errors.date" class="text-red-400 text-xs mt-1">{{ errors.date }}</p>
          </div>

          <!-- Horaire -->
          <div v-if="form.date">
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">Horaire</label>
            <div v-if="times.length" class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                v-for="t in times"
                :key="t"
                class="py-2.5 rounded-xl text-sm font-semibold border transition-all"
                :style="form.time === t
                  ? (isHair
                    ? 'background: #f0d817; color: #0d0502; border-color: #f0d817'
                    : 'background: #ec4899; color: white; border-color: #ec4899')
                  : (isHair
                    ? 'background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); border-color: rgba(255,255,255,0.1)'
                    : 'background: #fdf2f8; color: #9d174d; border-color: #fce7f3')"
                @click="form.time = t"
              >
                {{ t }}
              </button>
            </div>
            <p v-else class="text-sm" :class="isHair ? 'text-white/40' : 'text-pink-300'">
              Plus aucun horaire libre ce jour-là.
            </p>
            <p v-if="errors.time" class="text-red-400 text-xs mt-1">{{ errors.time }}</p>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">Notes (optionnel)</label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Précisions sur votre souhait, allergies, etc."
              class="w-full min-w-0 px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
              :class="isHair
                ? 'bg-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                : 'bg-pink-50 text-gray-800 placeholder-pink-200 focus:ring-2 focus:ring-pink-300 border border-pink-100'"
            />
          </div>

          <button
            class="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            :style="isHair
              ? 'background: linear-gradient(135deg, #e20d0d, #f0d817); color: #0d0502'
              : 'background: linear-gradient(135deg, #ec4899, #f9a8d4); color: white'"
            @click="goToPayment"
          >
            Continuer vers l'acompte
          </button>
        </div>

        <div class="flex items-center gap-3 my-8">
          <span class="flex-1 h-px" :style="isHair ? 'background: rgba(255,255,255,0.1)' : 'background: #fce7f3'"></span>
          <span class="text-xs font-semibold uppercase tracking-wide" :class="isHair ? 'text-white/40' : 'text-pink-300'">ou</span>
          <span class="flex-1 h-px" :style="isHair ? 'background: rgba(255,255,255,0.1)' : 'background: #fce7f3'"></span>
        </div>

        <a
          href="https://www.instagram.com/bev.aesthetic_"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          :style="isHair
            ? 'background: transparent; border: 1px solid rgba(255,255,255,0.2); color: white'
            : 'background: white; border: 1px solid #fce7f3; color: #ec4899'"
        >
          <Instagram class="w-4 h-4" />
          Me contacter directement sur Instagram
        </a>
      </template>
    </div>
  </div>
</template>
