<script setup lang="ts">
import { Phone, Mail, MapPin, Clock } from 'lucide-vue-next'

defineProps<{ theme: 'hair' | 'nails' }>()
</script>

<template>
  <!-- ===== HAIR FOOTER ===== -->
  <footer v-if="theme === 'hair'" class="text-white" style="background: #0d0502">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <span class="font-bold text-lg block mb-4">
            BEV<span style="color: #f0d817"> Aesthetic</span>
          </span>
          <p class="text-white/50 text-sm leading-relaxed">
            Votre salon de beauté pour la coiffure et les soins des ongles.
          </p>
          <div class="flex gap-2 mt-4">
            <span class="h-1 w-6 rounded-full" style="background: #e20d0d"></span>
            <span class="h-1 w-6 rounded-full" style="background: #f0d817"></span>
            <span class="h-1 w-6 rounded-full" style="background: #3eb308"></span>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4" style="color: #f0d817">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/" class="text-white/50 hover:text-white transition-colors">Accueil</RouterLink></li>
            <li><RouterLink to="/coiffure" class="text-white/50 hover:text-white transition-colors">Coiffure</RouterLink></li>
            <li><RouterLink to="/ongles" class="text-white/50 hover:text-white transition-colors">Ongles</RouterLink></li>
            <li><RouterLink to="/reservation" class="text-white/50 hover:text-white transition-colors">Réservation</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4" style="color: #f0d817">Contact</h3>
          <ul class="space-y-3 text-sm text-white/50">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 shrink-0 mt-0.5" style="color: #e20d0d" />
              <span>Saint Ouen L'aumone, France</span>
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 shrink-0" style="color: #e20d0d" />
              <a href="tel:+33600000000" class="hover:text-white transition-colors">+33 6 50 54 85 34</a>
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 shrink-0" style="color: #e20d0d" />
              <a href="mailto:beverlykobehi@outlook.com" class="hover:text-white transition-colors">beverlykobehi@outlook.com</a>
            </li>
          </ul>
        </div>

      </div>
      <div class="border-t mt-10 pt-6 text-center text-xs" style="border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3)">
        © {{ new Date().getFullYear() }} BEV Aesthetic — Tous droits réservés
      </div>
    </div>
  </footer>

  <!-- ===== NAILS FOOTER ===== -->
  <footer v-else style="background: #fdf6f0; border-top: 1px solid #fce7f3">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <span class="font-bold text-lg block mb-4" style="font-family: 'Montserrat', sans-serif; color: #9d174d">
            BEV<span style="color: #ec4899"> Aesthetic</span>
          </span>
          <p class="text-sm leading-relaxed" style="color: #9d174d80">
            Votre salon de beauté pour la coiffure et les soins des ongles.
          </p>
          <div class="flex gap-2 mt-4">
            <span class="h-1 w-6 rounded-full" style="background: #ec4899"></span>
            <span class="h-1 w-6 rounded-full" style="background: #f9a8d4"></span>
            <span class="h-1 w-6 rounded-full bg-gray-200"></span>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4" style="color: #ec4899">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/" class="transition-colors hover:text-[#ec4899]" style="color: #9d174d80">Accueil</RouterLink></li>
            <li><RouterLink to="/coiffure" class="transition-colors hover:text-[#ec4899]" style="color: #9d174d80">Coiffure</RouterLink></li>
            <li><RouterLink to="/ongles" class="transition-colors hover:text-[#ec4899]" style="color: #9d174d80">Ongles</RouterLink></li>
            <li><RouterLink to="/reservation" class="transition-colors hover:text-[#ec4899]" style="color: #9d174d80">Réservation</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4" style="color: #ec4899">Contact</h3>
          <ul class="space-y-3 text-sm" style="color: #9d174d80">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 shrink-0 mt-0.5 text-[#ec4899]" />
              <span>Saint Ouen L'aumone, France</span>
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 shrink-0 text-[#ec4899]" />
              <a href="tel:+33600000000" class="hover:text-[#ec4899] transition-colors">+33 6 50 54 85 34</a>
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 shrink-0 text-[#ec4899]" />
              <a href="mailto:beverlykobehi@outlook.com" class="hover:text-[#ec4899] transition-colors">beverlykobehi@outlook.com</a>
            </li>
          </ul>
        </div>

      </div>
      <div class="mt-10 pt-6 text-center text-xs" style="border-top: 1px solid #fce7f3; color: #9d174d50">
        © {{ new Date().getFullYear() }} BEV Aesthetic — Tous droits réservés
      </div>
    </div>
  </footer>
</template>
