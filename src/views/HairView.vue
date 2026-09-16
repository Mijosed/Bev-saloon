<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight, ArrowLeft } from 'lucide-vue-next'
import ConditionsCard from '@/components/ConditionsCard.vue'

const router = useRouter()

const installations = [
  { name: 'Cheveux courts', price: 300 },
  { name: 'Cheveux mi-longs', price: 400 },
  { name: 'Cheveux longs', price: 500 },
  { name: 'Cheveux très longs', price: 800 },
]

const resserrages = [
  { name: 'De 200 à 300 locks', price: 80 },
  { name: 'De 300 à 500 locks', price: 100 },
  { name: 'De 500 à 600 locks', price: 200 },
]

const conditionsItems = [
  {
    title: 'Acompte',
    text: "Acompte de 80€ pour les installations et de 20€ pour les resserrages.\nL'acompte versé est NON REMBOURSABLE en cas d'annulation de votre part.\nMerci de noter que 1 acompte = 1 rendez-vous. L'acompte ne pourra donc pas être transféré à un autre rendez-vous.",
  },
  {
    title: 'Accompagnateurs',
    text: 'Les accompagnateurs ne sont pas autorisés.',
  },
  {
    title: 'Heure du rendez-vous',
    text: "Merci d'arriver à l'heure afin de respecter l'organisation des rendez-vous.",
  },
  {
    title: 'À votre arrivée',
    text: "Merci de m'envoyer simplement un message lorsque vous êtes arrivée. Je viendrai vous ouvrir.\nMerci de ne pas sonner.",
  },
  {
    title: 'Questions & devis',
    text: 'Pour toute question ou demande de devis, je reste disponible en DM Instagram.',
  },
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
          Spécialiste des microlocks, des départs en vanilles et en nattes.
        </p>
      </div>
    </section>

    <!-- Intro -->
    <section class="max-w-3xl mx-auto px-4 pt-6 pb-4 text-center">
      <p class="text-white/50 text-sm leading-relaxed">
        Les installations de microlocks se font entre 300€ et 800€, kit d'entretien inclus 🌱.
        Les resserrages s'effectuent généralement toutes les 6 à 8 semaines et débutent à 80€.
      </p>
    </section>

    <!-- Installations -->
    <section class="max-w-5xl mx-auto px-4 pt-10 pb-4">
      <h2 class="text-center font-bold text-sm uppercase tracking-widest mb-10" style="color: #f0d817">
        Installations microlocks
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="service in installations"
          :key="service.name"
          class="group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:border-[#f0d817]/40 hover:-translate-y-1"
          style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08)"
          @click="reserve(service.name)"
        >
          <!-- Left accent bar -->
          <div class="absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style="background: linear-gradient(to bottom, #e20d0d, #f0d817, #3eb308)">
          </div>

          <h3 class="font-bold text-white text-base mb-6 leading-snug">{{ service.name }}</h3>

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
    </section>

    <!-- Resserrages -->
    <section class="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <h2 class="text-center font-bold text-sm uppercase tracking-widest mb-2" style="color: #f0d817">
        Resserrages microlocks
      </h2>
      <p class="text-center text-white/40 text-xs mb-10">Tous les resserrages débutent à 80€</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="service in resserrages"
          :key="service.name"
          class="group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:border-[#f0d817]/40 hover:-translate-y-1"
          style="background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08)"
          @click="reserve(service.name)"
        >
          <!-- Left accent bar -->
          <div class="absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style="background: linear-gradient(to bottom, #e20d0d, #f0d817, #3eb308)">
          </div>

          <h3 class="font-bold text-white text-base mb-6 leading-snug">{{ service.name }}</h3>

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

    <ConditionsCard :dark="true" accent="#f0d817" :items="conditionsItems" />

  </div>
</template>
