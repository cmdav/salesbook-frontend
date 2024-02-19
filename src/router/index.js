import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/Login.vue'
import DashBoardVue from '@/views/Dashboard/DashBoard.vue'
import Register from '@/views/Auth/Register.vue'
import ForgottenPasswordVue from '@/views/Auth/ForgottenPassword.vue'
import VerifyPage from '@/views/Auth/VerifyPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/forgotten-password',
      name: 'forgotten-password',
      component: ForgottenPasswordVue
    },
    {
      path: '/verify/:email',
      name: 'verify',
      component: VerifyPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashBoardVue
    },
    {
      path: '/:catchAll(.*)',
      component: Login
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
