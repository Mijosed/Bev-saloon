<script setup lang="ts">
defineProps<{
  dark: boolean
  accent: string
  items: { title: string; text: string }[]
}>()
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 pb-20">
    <h2 class="text-center font-bold text-sm uppercase tracking-widest mb-2" :style="{ color: accent }">
      Informations & conditions de rendez-vous
    </h2>
    <p class="text-center text-xs mb-10" :class="dark ? 'text-white/40' : 'text-pink-300'">
      À lire avant votre venue
    </p>

    <div class="space-y-3">
      <div
        v-for="item in items"
        :key="item.title"
        class="p-5 rounded-2xl border"
        :style="dark
          ? 'background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08)'
          : 'background: white; border-color: #fce7f3'"
      >
        <p class="font-bold mb-1" :class="dark ? 'text-white' : 'text-[#9d174d]'">{{ item.title }}</p>
        <p class="text-sm whitespace-pre-line" :class="dark ? 'text-white/60' : 'text-pink-400'">{{ item.text }}</p>
      </div>
    </div>

    <p class="text-center text-sm mt-8 font-medium" :class="dark ? 'text-white/70' : 'text-pink-500'">
      Merci de votre compréhension et du respect de ces conditions
    </p>
  </section>
</template>
