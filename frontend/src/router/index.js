import { createRouter, createWebHistory } from 'vue-router'
import InvitationView from '../App.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminLoginView from '../views/AdminLoginView.vue'
import { getSession } from '../config/api'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'invitation',
      component: InvitationView,
      meta: { title: 'Lizbeth & Enrique · 09.01.2027' },
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { guestOnly: true, title: 'Acceso administrativo · L & E' },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAuth: true, title: 'Panel administrativo · L & E' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const session = getSession()

  if (to.meta.requiresAuth && !session?.token) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && session?.token) {
    return { name: 'admin' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'Lizbeth & Enrique'
})

export default router
