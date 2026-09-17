<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()

const isHome = computed(() => route.name === 'home')
const isAdmin = computed(() => route.name === 'admin')

const theme = computed<'hair' | 'nails'>(() => {
  if (route.name === 'nails') return 'nails'
  if (route.name === 'reservation' && route.query.type === 'ongles') return 'nails'
  return 'hair'
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppNavbar v-if="!isAdmin" :transparent="isHome" :theme="theme" />
    <main :class="isHome || isAdmin ? '' : 'pt-16'">
      <RouterView />
    </main>
    <AppFooter v-if="!isHome && !isAdmin" :theme="theme" />
  </div>
</template>
