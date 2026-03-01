import { createRouter, createWebHistory } from 'vue-router'

import RegistrationView from '../views/RegistrationView.vue'
import ConfirmationView from '../views/ConfirmationView.vue'
import LegalView from '../views/LegalView.vue'

// REQ: FA-09 separate Bestaetigungsansicht per Route; QA-03 konsistente Navigationstitel und Seitenstruktur; QA-10 klar getrennte Routing-Logik
const routes = [
  {
    path: '/',
    name: 'registration',
    component: RegistrationView,
    meta: { title: 'Registrierung' },
  },
  {
    path: '/bestaetigung',
    name: 'confirmation',
    component: ConfirmationView,
    meta: { title: 'Bestätigung' },
  },
  {
    path: '/impressum',
    name: 'imprint',
    component: LegalView,
    props: { pageKey: 'imprint' },
    meta: { title: 'Impressum' },
  },
  {
    path: '/datenschutz',
    name: 'privacy',
    component: LegalView,
    props: { pageKey: 'privacy' },
    meta: { title: 'Datenschutz' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const pageTitle = to.meta?.title
    ? `${to.meta.title} | Kleiderspendenportal`
    : 'Kleiderspendenportal'
  document.title = pageTitle
})

export default router
