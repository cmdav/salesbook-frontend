import { createRouter, createWebHistory } from 'vue-router'
import middleware from './Middleware/index.js'
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
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: [middleware.redirectDashboard]
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: [middleware.redirectDashboard]
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
      component: DashBoardVue,
      beforeEnter: [middleware.redirectLogin]
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: [middleware.deleteSession]
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
