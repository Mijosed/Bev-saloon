<script setup lang="ts">
import { Phone, Mail, MapPin, Clock } from 'lucide-vue-next'

defineProps<{ theme: 'hair' | 'nails' | 'neutral' }>()
</script>

<template>
  <!-- ===== HAIR FOOTER ===== -->
  <footer v-if="theme === 'hair'" class="text-white" style="background: #0d0502">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <span class="font-bold text-lg block mb-4">
            BVL<span style="color: #f0d817"> Saloon</span>
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
            <li><RouterLink to="/contact" class="text-white/50 hover:text-white transition-colors">Contact</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4" style="color: #f0d817">Contact</h3>
          <ul class="space-y-3 text-sm text-white/50">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 shrink-0 mt-0.5" style="color: #e20d0d" />
              <span>Paris, France</span>
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 shrink-0" style="color: #e20d0d" />
              <a href="tel:+33600000000" class="hover:text-white transition-colors">+33 6 00 00 00 00</a>
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 shrink-0" style="color: #e20d0d" />
              <a href="mailto:mijosed@gmail.com" class="hover:text-white transition-colors">mijosed@gmail.com</a>
            </li>
            <li class="flex items-start gap-2">
              <Clock class="w-4 h-4 shrink-0 mt-0.5" style="color: #e20d0d" />
              <div><p>Lun–Sam : 9h – 19h</p><p>Dim : 10h – 17h</p></div>
            </li>
          </ul>
        </div>

      </div>
      <div class="border-t mt-10 pt-6 text-center text-xs" style="border-color: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3)">
        © {{ new Date().getFullYear() }} BVL Saloon — Tous droits réservés
      </div>
    </div>
  </footer>

  <!-- ===== NAILS FOOTER ===== -->
  <!-- ===== NEUTRAL FOOTER ===== -->
  <footer v-else-if="theme === 'neutral'" class="bg-white border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <span class="font-bold text-lg block mb-4 text-gray-900">BVL <span class="text-gray-500">Saloon</span></span>
          <p class="text-gray-400 text-sm leading-relaxed">Votre salon de beauté pour la coiffure et les soins des ongles.</p>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4 text-gray-400">Navigation</h3>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/" class="text-gray-400 hover:text-gray-800 transition-colors">Accueil</RouterLink></li>
            <li><RouterLink to="/coiffure" class="text-gray-400 hover:text-gray-800 transition-colors">Coiffure</RouterLink></li>
            <li><RouterLink to="/ongles" class="text-gray-400 hover:text-gray-800 transition-colors">Ongles</RouterLink></li>
            <li><RouterLink to="/reservation" class="text-gray-400 hover:text-gray-800 transition-colors">Réservation</RouterLink></li>
            <li><RouterLink to="/contact" class="text-gray-400 hover:text-gray-800 transition-colors">Contact</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4 text-gray-400">Contact</h3>
          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex items-start gap-2"><MapPin class="w-4 h-4 shrink-0 mt-0.5 text-gray-400" /><span>Paris, France</span></li>
            <li class="flex items-center gap-2"><Phone class="w-4 h-4 shrink-0 text-gray-400" /><a href="tel:+33600000000" class="hover:text-gray-700 transition-colors">+33 6 00 00 00 00</a></li>
            <li class="flex items-center gap-2"><Mail class="w-4 h-4 shrink-0 text-gray-400" /><a href="mailto:mijosed@gmail.com" class="hover:text-gray-700 transition-colors">mijosed@gmail.com</a></li>
            <li class="flex items-start gap-2"><Clock class="w-4 h-4 shrink-0 mt-0.5 text-gray-400" /><div><p>Lun–Sam : 9h – 19h</p><p>Dim : 10h – 17h</p></div></li>
          </ul>
        </div>

      </div>
      <div class="mt-10 pt-6 text-center text-xs text-gray-300 border-t border-gray-100">
        © {{ new Date().getFullYear() }} BVL Saloon — Tous droits réservés
      </div>
    </div>
  </footer>

  <!-- ===== NAILS FOOTER ===== -->
  <footer v-else style="background: #fdf6f0; border-top: 1px solid #fce7f3">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <span class="font-bold text-lg block mb-4" style="font-family: 'Montserrat', sans-serif; color: #9d174d">
            BVL<span style="color: #ec4899"> Saloon</span>
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
            <li><RouterLink to="/contact" class="transition-colors hover:text-[#ec4899]" style="color: #9d174d80">Contact</RouterLink></li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-xs uppercase tracking-widest mb-4" style="color: #ec4899">Contact</h3>
          <ul class="space-y-3 text-sm" style="color: #9d174d80">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 shrink-0 mt-0.5 text-[#ec4899]" />
              <span>Paris, France</span>
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 shrink-0 text-[#ec4899]" />
              <a href="tel:+33600000000" class="hover:text-[#ec4899] transition-colors">+33 6 00 00 00 00</a>
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 shrink-0 text-[#ec4899]" />
              <a href="mailto:mijosed@gmail.com" class="hover:text-[#ec4899] transition-colors">mijosed@gmail.com</a>
            </li>
            <li class="flex items-start gap-2">
              <Clock class="w-4 h-4 shrink-0 mt-0.5 text-[#ec4899]" />
              <div><p>Lun–Sam : 9h – 19h</p><p>Dim : 10h – 17h</p></div>
            </li>
          </ul>
        </div>

      </div>
      <div class="mt-10 pt-6 text-center text-xs" style="border-top: 1px solid #fce7f3; color: #9d174d50">
        © {{ new Date().getFullYear() }} BVL Saloon — Tous droits réservés
      </div>
    </div>
  </footer>
</template>
