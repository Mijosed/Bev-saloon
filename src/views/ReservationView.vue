<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, Scissors, Sparkles, Calendar, Clock, User, Phone, Mail, ChevronDown } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

function setType(type: 'coiffure' | 'ongles') {
  form.value.type = type
  router.replace({ query: { ...route.query, type } })
}

const hairServices = [
  'Coupe femme', 'Coupe homme', 'Brushing', 'Coloration complète',
  'Mèches / Balayage', 'Tresses / Locks', 'Défrisage', 'Soin capillaire',
]
const nailServices = [
  'Manucure simple', 'Pose gel', 'Pose acrylique', 'Nail art simple',
  'Nail art élaboré', 'Pédicure', 'Dépose gel/acrylique', 'French manucure',
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30',
]

const form = ref({
  name: '',
  email: '',
  phone: '',
  type: 'coiffure' as 'coiffure' | 'ongles',
  service: '',
  date: '',
  time: '',
  notes: '',
})

const submitted = ref(false)
const errors = ref<Record<string, string>>({})

const services = computed(() =>
  form.value.type === 'coiffure' ? hairServices : nailServices
)

const isHair = computed(() => form.value.type === 'coiffure')

const minDate = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

watch(() => form.value.type, () => { form.value.service = '' })

onMounted(() => {
  if (route.query.type === 'ongles') form.value.type = 'ongles'
  if (typeof route.query.service === 'string') form.value.service = route.query.service
})

function validate() {
  const e: Record<string, string> = {}
  if (!form.value.name.trim()) e.name = 'Requis'
  if (!form.value.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = 'Email invalide'
  if (!form.value.phone.trim()) e.phone = 'Requis'
  if (!form.value.service) e.service = 'Choisissez une prestation'
  if (!form.value.date) e.date = 'Choisissez une date'
  if (!form.value.time) e.time = 'Choisissez un horaire'
  errors.value = e
  return Object.keys(e).length === 0
}

function submit() {
  if (!validate()) return
  submitted.value = true
}
</script>

<template>
  <div class="min-h-screen py-12 px-4" :style="isHair ? 'background: #0d0502' : 'background: #fdf6f0'">
    <div class="max-w-2xl mx-auto">

      <!-- Success -->
      <div v-if="submitted" class="text-center py-20">
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          :style="isHair ? 'background: rgba(240,216,23,0.15)' : 'background: #fce7f3'"
        >
          <CheckCircle class="w-10 h-10" :style="isHair ? 'color: #f0d817' : 'color: #ec4899'" />
        </div>
        <h2 class="text-2xl font-bold mb-3" :class="isHair ? 'text-white' : 'text-[#9d174d]'">
          Demande envoyée !
        </h2>
        <p :class="isHair ? 'text-white/60' : 'text-pink-400'" class="mb-8">
          Nous confirmerons votre rendez-vous dans les 24h par email ou téléphone.
        </p>
        <button
          class="px-8 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
          :style="isHair ? 'background: #f0d817; color: #0d0502' : 'background: #ec4899; color: white'"
          @click="submitted = false; form.name = ''; form.email = ''; form.phone = ''; form.service = ''; form.date = ''; form.time = ''; form.notes = ''"
        >
          Nouvelle réservation
        </button>
      </div>

      <!-- Form -->
      <template v-else>
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="font-bold text-3xl mb-2" :class="isHair ? 'text-white' : 'text-[#9d174d]'"
            :style="isHair ? 'font-family: Montserrat, sans-serif' : 'font-family: Montserrat, sans-serif'">
            Réservation
          </h1>
          <p :class="isHair ? 'text-white/50' : 'text-pink-400'" class="text-sm">
            Remplissez le formulaire, nous vous rappelons pour confirmer.
          </p>
        </div>

        <!-- Type toggle -->
        <div
          class="flex rounded-2xl p-1 mb-8"
          :style="isHair ? 'background: rgba(255,255,255,0.06)' : 'background: #fce7f3'"
        >
          <button
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
            :style="isHair
              ? 'background: #f0d817; color: #0d0502'
              : 'background: transparent; color: #9d174d'"
            :class="!isHair ? 'opacity-50' : ''"
            @click="setType('coiffure')"
          >
            <Scissors class="w-4 h-4" />
            Coiffure
          </button>
          <button
            class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
            :style="!isHair
              ? 'background: #ec4899; color: white'
              : 'background: transparent; color: rgba(255,255,255,0.5)'"
            @click="setType('ongles')"
          >
            <Sparkles class="w-4 h-4" />
            Ongles
          </button>
        </div>

        <!-- Form fields -->
        <div
          class="rounded-3xl p-6 sm:p-8 space-y-5"
          :style="isHair
            ? 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)'
            : 'background: white; border: 1px solid #fce7f3; box-shadow: 0 4px 24px rgba(236,72,153,0.08)'"
        >
          <!-- Name -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">
              Prénom & Nom
            </label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
              <input
                v-model="form.name"
                type="text"
                placeholder="Ex: Marie Dupont"
                class="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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

          <!-- Email + Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                :class="isHair ? 'text-white/50' : 'text-pink-400'">Email</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="vous@email.com"
                  class="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                :class="isHair ? 'text-white/50' : 'text-pink-400'">Téléphone</label>
              <div class="relative">
                <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  class="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
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

          <!-- Service -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">Prestation</label>
            <div class="relative">
              <ChevronDown class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
              <select
                v-model="form.service"
                class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                :class="[
                  errors.service ? 'ring-2 ring-red-400' : '',
                  isHair
                    ? 'bg-white/10 text-white focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                    : 'bg-pink-50 text-gray-800 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                ]"
              >
                <option value="" disabled :style="isHair ? 'background: #1a0a03' : ''">Choisir une prestation...</option>
                <option v-for="s in services" :key="s" :value="s" :style="isHair ? 'background: #1a0a03' : ''">{{ s }}</option>
              </select>
            </div>
            <p v-if="errors.service" class="text-red-400 text-xs mt-1">{{ errors.service }}</p>
          </div>

          <!-- Date + Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                :class="isHair ? 'text-white/50' : 'text-pink-400'">Date</label>
              <div class="relative">
                <Calendar class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
                <input
                  v-model="form.date"
                  type="date"
                  :min="minDate"
                  class="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  :class="[
                    errors.date ? 'ring-2 ring-red-400' : '',
                    isHair
                      ? 'bg-white/10 text-white focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10 [color-scheme:dark]'
                      : 'bg-pink-50 text-gray-800 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                  ]"
                />
              </div>
              <p v-if="errors.date" class="text-red-400 text-xs mt-1">{{ errors.date }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
                :class="isHair ? 'text-white/50' : 'text-pink-400'">Horaire</label>
              <div class="relative">
                <Clock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" :class="isHair ? 'text-white/30' : 'text-pink-300'" />
                <select
                  v-model="form.time"
                  class="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                  :class="[
                    errors.time ? 'ring-2 ring-red-400' : '',
                    isHair
                      ? 'bg-white/10 text-white focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                      : 'bg-pink-50 text-gray-800 focus:ring-2 focus:ring-pink-300 border border-pink-100'
                  ]"
                >
                  <option value="" disabled :style="isHair ? 'background: #1a0a03' : ''">Choisir...</option>
                  <option v-for="t in timeSlots" :key="t" :value="t" :style="isHair ? 'background: #1a0a03' : ''">{{ t }}</option>
                </select>
              </div>
              <p v-if="errors.time" class="text-red-400 text-xs mt-1">{{ errors.time }}</p>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              :class="isHair ? 'text-white/50' : 'text-pink-400'">
              Notes (optionnel)
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Précisions sur votre souhait, allergies, etc."
              class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
              :class="isHair
                ? 'bg-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-[#f0d817]/50 border border-white/10'
                : 'bg-pink-50 text-gray-800 placeholder-pink-200 focus:ring-2 focus:ring-pink-300 border border-pink-100'"
            />
          </div>

          <!-- Submit -->
          <button
            class="w-full py-4 rounded-xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            :style="isHair
              ? 'background: linear-gradient(135deg, #e20d0d, #f0d817); color: #0d0502'
              : 'background: linear-gradient(135deg, #ec4899, #f9a8d4); color: white'"
            @click="submit"
          >
            Confirmer la réservation
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
