<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Scissors, Clock, ChevronRight, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const services = [
  { name: 'Tresses / Locks', duration: '3h+', price: 60 },
  { name: 'Retwist vanille', duration: '2h+', price: 55 },
  { name: 'Soin capillaire', duration: '30 min', price: 30 },
]

const reserve = (service: string) => {
  router.push({ path: '/reservation', query: { type: 'coiffure', service } })
}
</script>

<template>
  <div class="min-h-screen" style="background: #0d0502">

    <!-- Hero -->
    <section class="relative overflow-hidden pt-20 pb-16 px-4">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15" style="background: #e20d0d"></div>

      <div class="relative max-w-4xl mx-auto text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-8 transition-colors">
          <ArrowLeft class="w-4 h-4" />
          Retour à l'accueil
        </RouterLink>

        <h1 class="font-extrabold text-white mb-4" style="font-family: 'Montserrat', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem)">
          Coiffure
        </h1>

        <div class="flex justify-center gap-2 mb-6">
          <span class="h-1.5 w-12 rounded-full" style="background: #e20d0d"></span>
          <span class="h-1.5 w-12 rounded-full" style="background: #f0d817"></span>
          <span class="h-1.5 w-12 rounded-full" style="background: #3eb308"></span>
        </div>

        <p class="text-white/60 text-lg max-w-xl mx-auto">
          Des coupes sublimes, des colorations audacieuses et des soins capillaires professionnels.
        </p>
      </div>
    </section>

    <!-- Services grid -->
    <section class="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <h2 class="text-center font-bold text-sm uppercase tracking-widest mb-10" style="color: #f0d817">
        Nos prestations
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="service in services"
          :key="service.name"
          class="group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:border-[#f0d817]/40 hover:-translate-y-1"
          style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08)"
          @click="reserve(service.name)"
        >
          <!-- Left accent bar -->
          <div class="absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style="background: linear-gradient(to bottom, #e20d0d, #f0d817, #3eb308)">
          </div>

          <h3 class="font-bold text-white text-base mb-3 leading-snug">{{ service.name }}</h3>

          <div class="flex items-center gap-1.5 text-xs text-white/40 mb-4">
            <Clock class="w-3.5 h-3.5" />
            {{ service.duration }}
          </div>

          <div class="flex items-center justify-between">
            <span class="text-2xl font-extrabold" style="color: #f0d817">{{ service.price }}€</span>
            <span
              class="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
              style="background: #f0d817; color: #0d0502"
            >
              Réserver <ChevronRight class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <p class="text-white/40 text-sm mb-4">Vous avez une demande spéciale ?</p>
        <button
          class="px-10 py-4 rounded-full font-bold text-black text-base transition-all hover:scale-105 active:scale-95"
          style="background: linear-gradient(135deg, #e20d0d, #f0d817)"
          @click="router.push({ path: '/reservation', query: { type: 'coiffure' } })"
        >
          Prendre rendez-vous
        </button>
      </div>
    </section>

  </div>
</template>
