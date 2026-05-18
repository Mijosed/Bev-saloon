<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Phone, Mail, Clock, Instagram, Send, CheckCircle } from 'lucide-vue-next'

const msgSent = ref(false)
const form = ref({ name: '', email: '', message: '' })

function sendMessage() {
  if (!form.value.name || !form.value.email || !form.value.message) return
  msgSent.value = true
}

const hours = [
  { day: 'Lundi – Vendredi', time: '9h00 – 19h00' },
  { day: 'Samedi', time: '9h00 – 18h00' },
  { day: 'Dimanche', time: '10h00 – 17h00' },
]
</script>

<template>
  <div class="min-h-screen bg-white">

    <!-- Hero -->
    <section class="py-14 px-4 bg-gray-50 border-b border-gray-100">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="font-extrabold text-gray-900 text-4xl md:text-5xl mb-3" style="font-family: Montserrat, sans-serif">
          Contact
        </h1>
        <p class="text-gray-400">On a hâte de vous accueillir !</p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-6xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <!-- Info cards -->
        <div class="space-y-4">
          <h2 class="font-bold text-xl text-gray-800 mb-6">Nos informations</h2>

          <div class="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MapPin class="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p class="font-semibold text-gray-800 mb-0.5">Adresse</p>
              <p class="text-gray-500 text-sm">Paris, France</p>
              <p class="text-gray-400 text-xs mt-1">À remplir selon votre emplacement</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Phone class="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p class="font-semibold text-gray-800 mb-0.5">Téléphone</p>
              <a href="tel:+33600000000" class="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                +33 6 00 00 00 00
              </a>
              <p class="text-gray-400 text-xs mt-1">Lun–Sam, 9h–19h</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Mail class="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p class="font-semibold text-gray-800 mb-0.5">Email</p>
              <a href="mailto:mijosed@gmail.com" class="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                mijosed@gmail.com
              </a>
            </div>
          </div>

          <div class="p-5 rounded-2xl border border-gray-100 bg-gray-50">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Clock class="w-5 h-5 text-gray-500" />
              </div>
              <p class="font-semibold text-gray-800">Horaires d'ouverture</p>
            </div>
            <ul class="space-y-2">
              <li v-for="h in hours" :key="h.day" class="flex justify-between text-sm">
                <span class="text-gray-500">{{ h.day }}</span>
                <span class="font-semibold text-gray-800">{{ h.time }}</span>
              </li>
            </ul>
          </div>

          <div class="flex gap-3">
            <a
              href="#"
              class="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style="background: linear-gradient(135deg, #e1306c, #833ab4)"
            >
              <Instagram class="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>

        <!-- Contact form -->
        <div>
          <h2 class="font-bold text-xl text-gray-800 mb-6">Envoyer un message</h2>

          <div v-if="msgSent" class="text-center py-16">
            <CheckCircle class="w-14 h-14 mx-auto mb-4 text-gray-400" />
            <h3 class="font-bold text-xl text-gray-900 mb-2">Message envoyé !</h3>
            <p class="text-gray-400 text-sm mb-6">Nous vous répondrons dans les plus brefs délais.</p>
            <button
              class="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gray-900 transition-all hover:scale-105"
              @click="msgSent = false; form.name = ''; form.email = ''; form.message = ''"
            >
              Nouveau message
            </button>
          </div>

          <form v-else class="space-y-5" @submit.prevent="sendMessage">
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Prénom & Nom</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Marie Dupont"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="vous@email.com"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Message</label>
              <textarea
                v-model="form.message"
                required
                rows="5"
                placeholder="Votre message..."
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all bg-gray-50 resize-none"
              />
            </div>

            <button
              type="submit"
              class="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-gray-900 transition-all hover:bg-gray-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send class="w-4 h-4" />
              Envoyer le message
            </button>
          </form>
        </div>

      </div>
    </section>

  </div>
</template>
