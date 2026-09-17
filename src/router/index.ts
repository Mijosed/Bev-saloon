import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/coiffure', name: 'hair', component: () => import('@/views/HairView.vue') },
    { path: '/ongles', name: 'nails', component: () => import('@/views/NailsView.vue') },
    { path: '/reservation', name: 'reservation', component: () => import('@/views/ReservationView.vue') },
    { path: '/admin', name: 'admin', component: () => import('@/views/AdminView.vue') },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
