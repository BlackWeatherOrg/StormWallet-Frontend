import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import AuthView from '@/views/AuthView.vue'
import ProfileView from '@/views/ProfileView.vue'
import StatView from '@/views/StatView.vue'
import WorkView from '@/views/WorkView.vue'
import { useUserStore } from '@/stores/UserStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }, 
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresAuth: false }, 
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { requiresAuth: false }, 
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }, 
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatView,
      meta: { requiresAuth: true }, 
    },
    {
      path: '/work',
      name: 'work',
      component: WorkView,
      meta: { requiresAuth: true }, 
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isAuth) {
    next('/auth') 
  }
  else if (to.name === 'auth' && userStore.isAuth) {
    next('/') 
  }
  else {
    next()
  }
})

export default router
