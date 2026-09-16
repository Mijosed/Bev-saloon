<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight, ArrowLeft } from 'lucide-vue-next'
import ConditionsCard from '@/components/ConditionsCard.vue'

const router = useRouter()

const services = [
  { name: 'Manucure simple', subtitle: 'VSP / French — Taille S, M ou L', price: 30, popular: false },
  { name: 'Manucure Nail Art', subtitle: 'Pose avec décorations personnalisées', price: 50, popular: true },
  { name: 'Dépose', subtitle: '', price: 10, popular: false },
  { name: 'Dépose extérieure', subtitle: '(pas de résine)', price: 15, popular: false },
]

const conditionsItems = [
  {
    title: 'Acompte de 10€',
    text: "L'acompte versé est NON REMBOURSABLE en cas d'annulation de votre part.\nMerci de noter que 1 acompte = 1 rendez-vous. L'acompte ne pourra donc pas être transféré à un autre rendez-vous.",
  },
  {
    title: 'Accompagnateurs',
    text: 'Les accompagnateurs ne sont pas autorisés.',
  },
  {
    title: 'Heure du rendez-vous',
    text: "Merci d'arriver à l'heure, afin de respecter l'organisation des rendez-vous.",
  },
  {
    title: 'À votre arrivée',
    text: "Merci de m'envoyer simplement un message lorsque vous êtes arrivée. Je viendrai vous ouvrir.\nMerci de ne pas sonner.",
  },
  {
    title: 'Remplissages',
    text: 'Les remplissages doivent être effectués dans un délai maximum de 3 semaines. Au-delà de ce délai, une dépose ainsi que le tarif complet d\'une nouvelle pose seront facturés.\nUn remplissage retire 5€ sur le tarif de la prestation de base.',
  },
  {
    title: 'Dépose obligatoire',
    text: 'Pour des raisons de sécurité et afin de préserver vos ongles (hors gainage), vous pourrez effectuer 2 remplissages consécutifs maximum. Une dépose sera ensuite obligatoire avant une nouvelle pose.',
  },
  {
    title: 'Questions & devis',
    text: 'Pour toute question ou demande de devis, je reste disponible en DM Instagram.',
  },
]

const reserve = (service: string) => {
  router.push({ path: '/reservation', query: { type: 'ongles', service } })
}
</script>

<template>
  <div class="min-h-screen" style="background: #fdf6f0">

    <!-- Hero -->
    <section class="relative overflow-hidden pt-20 pb-16 px-4" style="background: linear-gradient(135deg, #fdf6f0, #fce7f3)">
      <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30" style="background: #fce7f3"></div>
      <div class="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-20" style="background: #f9a8d4"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style="background: #ec4899"></div>

      <div class="relative max-w-4xl mx-auto text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-pink-500 hover:text-pink-700 text-sm mb-8 transition-colors">
          <ArrowLeft class="w-4 h-4" />
          Retour à l'accueil
        </RouterLink>

        <h1 class="font-bold mb-4 leading-none" style="font-family: 'Montserrat', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem); color: #831843">
          Ongles
        </h1>

        <div class="flex justify-center gap-2 mb-6">
          <span class="h-1.5 w-12 rounded-full" style="background: #ec4899"></span>
          <span class="h-1.5 w-12 rounded-full" style="background: #f9a8d4"></span>
          <span class="h-1.5 w-12 rounded-full bg-gray-200"></span>
        </div>

        <p class="text-pink-700 text-lg max-w-xl mx-auto">
          Des ongles parfaits pour chaque occasion — manucure simple et nail art sur mesure.
        </p>
      </div>
    </section>

    <!-- Services grid -->
    <section class="max-w-5xl mx-auto px-4 pt-10 pb-20">
      <h2 class="text-center font-bold text-sm uppercase tracking-widest mb-10" style="color: #ec4899">
        Nos prestations
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="service in services"
          :key="service.name"
          class="group relative rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:-translate-y-1"
          :class="service.popular
            ? 'border-pink-200 bg-white shadow-md shadow-pink-100'
            : 'border-pink-100 bg-white/70 hover:bg-white hover:border-pink-200'"
          @click="reserve(service.name)"
        >
          <!-- Popular badge -->
          <span
            v-if="service.popular"
            class="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style="background: #ec4899"
          >
            ★ Populaire
          </span>

          <!-- Left accent bar -->
          <div class="absolute left-0 top-6 bottom-6 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style="background: linear-gradient(to bottom, #ec4899, #f9a8d4)">
          </div>

          <h3 class="font-bold text-base mb-3 leading-snug pr-16" style="color: #9d174d">{{ service.name }}</h3>

          <div v-if="service.subtitle" class="text-xs text-pink-300 mb-4">
            {{ service.subtitle }}
          </div>
          <div v-else class="mb-4"></div>

          <div class="flex items-center justify-between">
            <span class="text-2xl font-extrabold" style="color: #ec4899">{{ service.price }}€</span>
            <span
              class="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
              style="background: #ec4899"
            >
              Réserver <ChevronRight class="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12">
        <p class="text-pink-300 text-sm mb-4">Une idée de nail art particulière ?</p>
        <button
          class="px-10 py-4 rounded-full font-bold text-white text-base transition-all hover:scale-105 active:scale-95 shadow-lg shadow-pink-200"
          style="background: linear-gradient(135deg, #ec4899, #f9a8d4)"
          @click="router.push({ path: '/reservation', query: { type: 'ongles' } })"
        >
          Prendre rendez-vous
        </button>
      </div>
    </section>

    <ConditionsCard :dark="false" accent="#ec4899" :items="conditionsItems" />

  </div>
</template>
