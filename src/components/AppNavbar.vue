<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'

const props = defineProps<{ transparent?: boolean; theme: 'hair' | 'nails' | 'neutral' }>()

const route = useRoute()
const menuOpen = ref(false)

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Coiffure', to: '/coiffure' },
  { label: 'Ongles', to: '/ongles' },
  { label: 'Réservation', to: '/reservation' },
  { label: 'Contact', to: '/contact' },
]

const isActive = (path: string) => route.path === path
</script>

<template>

  <!-- ===== HAIR / HOME navbar ===== -->
  <header
    v-if="transparent || theme === 'hair'"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="transparent ? 'bg-black/20 backdrop-blur-sm' : 'bg-[#0d0502] shadow-lg'"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/" class="shrink-0" @click="menuOpen = false">
        <span class="font-bold text-white text-lg">
          BVL<span :style="transparent ? '' : 'color: #f0d817'"> Saloon</span>
        </span>
      </RouterLink>

      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(link.to) ? 'font-semibold' : 'text-white/70 hover:text-white'"
            :style="isActive(link.to) ? (transparent ? 'color: white' : 'color: #f0d817') : ''"
          >{{ link.label }}</RouterLink>
        </li>
        <li>
          <RouterLink
            to="/reservation"
            class="ml-3 px-5 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95"
            :class="transparent ? 'text-white border border-white/40 bg-white/10' : 'text-[#0d0502]'"
            :style="transparent ? '' : 'background: #f0d817'"
          >Réserver</RouterLink>
        </li>
      </ul>

      <button class="md:hidden text-white p-2 rounded-md" @click="menuOpen = !menuOpen" aria-label="Menu">
        <X v-if="menuOpen" class="w-6 h-6" /><Menu v-else class="w-6 h-6" />
      </button>
    </nav>

    <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="menuOpen" class="md:hidden bg-[#0d0502] border-t border-white/10 pb-4">
        <ul class="flex flex-col px-4 pt-2 gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink :to="link.to" class="block px-3 py-3 text-sm font-medium border-b border-white/5" :class="isActive(link.to) ? 'text-[#f0d817]' : 'text-white/70'" @click="menuOpen = false">{{ link.label }}</RouterLink>
          </li>
          <li class="mt-2">
            <RouterLink to="/reservation" class="block text-center px-5 py-3 rounded-full text-sm font-bold text-[#0d0502]" style="background: #f0d817" @click="menuOpen = false">Réserver maintenant</RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>

  <!-- ===== NEUTRAL navbar (Contact) ===== -->
  <header
    v-else-if="theme === 'neutral'"
    class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100 transition-all duration-300"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/" class="shrink-0" @click="menuOpen = false">
        <span class="font-bold text-gray-900 text-lg">BVL <span class="text-gray-500">Saloon</span></span>
      </RouterLink>

      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(link.to) ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-800'"
          >{{ link.label }}</RouterLink>
        </li>
        <li>
          <RouterLink
            to="/reservation"
            class="ml-3 px-5 py-2 rounded-full text-sm font-bold text-white bg-gray-900 transition-transform hover:scale-105 active:scale-95"
          >Réserver</RouterLink>
        </li>
      </ul>

      <button class="md:hidden p-2 rounded-md text-gray-600" @click="menuOpen = !menuOpen" aria-label="Menu">
        <X v-if="menuOpen" class="w-6 h-6" /><Menu v-else class="w-6 h-6" />
      </button>
    </nav>

    <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="menuOpen" class="md:hidden bg-white border-t border-gray-100 pb-4">
        <ul class="flex flex-col px-4 pt-2 gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink :to="link.to" class="block px-3 py-3 text-sm font-medium border-b border-gray-100" :class="isActive(link.to) ? 'text-gray-900 font-semibold' : 'text-gray-500'" @click="menuOpen = false">{{ link.label }}</RouterLink>
          </li>
          <li class="mt-2">
            <RouterLink to="/reservation" class="block text-center px-5 py-3 rounded-full text-sm font-bold text-white bg-gray-900" @click="menuOpen = false">Réserver maintenant</RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>

  <!-- ===== NAILS navbar ===== -->
  <header
    v-else
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm"
    style="background: #fdf6f0; border-bottom: 1px solid #fce7f3"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/" class="shrink-0" @click="menuOpen = false">
        <span class="font-bold text-lg" style="color: #9d174d">BVL<span style="color: #ec4899"> Saloon</span></span>
      </RouterLink>

      <ul class="hidden md:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <RouterLink
            :to="link.to"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="isActive(link.to) ? 'font-semibold' : 'hover:text-[#ec4899]'"
            :style="isActive(link.to) ? 'color: #ec4899' : 'color: #9d174d99'"
          >{{ link.label }}</RouterLink>
        </li>
        <li>
          <RouterLink to="/reservation?type=ongles" class="ml-3 px-5 py-2 rounded-full text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95" style="background: #ec4899">Réserver</RouterLink>
        </li>
      </ul>

      <button class="md:hidden p-2 rounded-md" style="color: #9d174d" @click="menuOpen = !menuOpen" aria-label="Menu">
        <X v-if="menuOpen" class="w-6 h-6" /><Menu v-else class="w-6 h-6" />
      </button>
    </nav>

    <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="menuOpen" class="md:hidden pb-4" style="background: #fdf6f0; border-top: 1px solid #fce7f3">
        <ul class="flex flex-col px-4 pt-2 gap-1">
          <li v-for="link in navLinks" :key="link.to">
            <RouterLink :to="link.to" class="block px-3 py-3 text-sm font-medium" :style="isActive(link.to) ? 'color: #ec4899; border-bottom: 1px solid #fce7f3' : 'color: #9d174d99; border-bottom: 1px solid #fce7f3'" @click="menuOpen = false">{{ link.label }}</RouterLink>
          </li>
          <li class="mt-2">
            <RouterLink to="/reservation?type=ongles" class="block text-center px-5 py-3 rounded-full text-sm font-bold text-white" style="background: #ec4899" @click="menuOpen = false">Réserver maintenant</RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>

</template>
