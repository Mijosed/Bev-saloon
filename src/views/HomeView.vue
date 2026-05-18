<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="h-screen flex flex-col md:flex-row overflow-hidden">

    <!-- === HAIR SIDE === -->
    <div
      class="group relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-700 ease-in-out md:hover:flex-[1.35]"
      style="background: #0d0502"
      @click="router.push('/coiffure')"
    >
      <!-- Background image -->
      <img src="/images/locks_1.jpg" alt="" class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" style="opacity: 0.55" />
      <!-- Dark overlay -->
      <div class="absolute inset-0 pointer-events-none" style="background: rgba(0,0,0,0.52)"></div>
      <!-- Edge fade -->
      <div class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse 90% 90% at center, transparent 55%, #0d0502 100%)">
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-8 py-12 flex flex-col items-center">
        <h2 class="font-bold text-white mb-3 leading-none" style="font-family: 'Montserrat', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem)">
          Coiffure
        </h2>

        <div class="flex gap-1.5 mb-5">
          <span class="h-1 w-10 rounded-full" style="background: #e20d0d"></span>
          <span class="h-1 w-10 rounded-full" style="background: #f0d817"></span>
          <span class="h-1 w-10 rounded-full" style="background: #3eb308"></span>
        </div>

        <p class="text-white/60 text-sm md:text-base mb-8 max-w-xs">
          Coupes, colorations, tresses, locks & soins capillaires
        </p>

        <button
          class="group/btn flex items-center gap-2 px-8 py-3 rounded-full font-bold text-black text-sm transition-all duration-300 hover:gap-3 hover:px-9"
          style="background: #f0d817"
        >
          Découvrir
          <ChevronRight class="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      <div class="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span class="text-white/40 text-xs">Cliquez pour voir nos prestations</span>
      </div>
    </div>

    <!-- === CENTER DIVIDER === -->
    <div class="hidden md:block w-px shrink-0 relative z-20"
      style="background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.15), transparent)">
    </div>

    <!-- === NAILS SIDE === -->
    <div
      class="group relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-700 ease-in-out md:hover:flex-[1.35]"
      style="background: #fdf6f0"
      @click="router.push('/ongles')"
    >
      <!-- Background image -->
      <img src="/images/nails_1.jpg" alt="" class="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" style="opacity: 0.55; " />
      <!-- Edge fade -->
      <div class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse 90% 90% at center, transparent 55%, #fdf6f0 100%)">
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-8 py-12 flex flex-col items-center">
        <h2 class="font-bold mb-3 leading-none text-white" style="font-family: 'Montserrat', sans-serif; font-size: clamp(2.5rem, 6vw, 4rem)">
          Ongles
        </h2>

        <div class="flex gap-1.5 mb-5">
          <span class="h-1 w-10 rounded-full" style="background: #ec4899"></span>
          <span class="h-1 w-10 rounded-full" style="background: #f9a8d4"></span>
          <span class="h-1 w-10 rounded-full bg-white/40"></span>
        </div>

        <p class="text-white/70 text-sm md:text-base mb-8 max-w-xs font-medium">
          Manucure, gel, acrylique, nail art & pédicure
        </p>

        <button
          class="group/btn flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white text-sm transition-all duration-300 hover:gap-3 hover:px-9 shadow-lg shadow-pink-500/50"
          style="background: #ec4899"
        >
          Découvrir
          <ChevronRight class="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>

      <div class="absolute bottom-6 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span class="text-pink-400 text-xs">Cliquez pour voir nos prestations</span>
      </div>
    </div>


  </div>
</template>
