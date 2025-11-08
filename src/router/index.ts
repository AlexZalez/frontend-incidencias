import type { App } from 'vue'
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router'

import {
  createRouter,
  createWebHistory,
} from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// store

async function isAuth (to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext) {
  const { token } = storeToRefs(useAuthStore())
  
  try {
    // Si está autenticado y está en login, redirigir al dashboard
    if (to.name === 'login') {
      if (token.value) {
        next({ name: 'dashboard' }).then(() => {
          router.go(0)
        })
        
        return
      } else {
        next()
      }
    }
  } catch {
    // Si hay error pero está intentando acceder a login, permitir acceso
    if (to.name === 'login') {
      next()
    } else {
      // Si hay error y no está en login, redirigir al login
      next({ name: 'login' })
    }
  }
}

async function requireAuth (to: RouteLocationNormalized,
  from: RouteLocationNormalized) {
    
  try {
    const { userWhoiamAction } = useAuthStore()
    userWhoiamAction()
  } catch(error) {
    console.log('Error en requireAuth:', error)
    return false
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
    name: 'app-login',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        beforeEnter: isAuth,
        component: () => import('@/pages/login.vue'),
      },
    ],
  },

  {
    path: '/home',
    redirect: '/home/dashboard',
    name: 'home',
    beforeEnter: [requireAuth],
    component: () => import('@/layouts/home.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/home/dashboard.vue'),
      },
      {
        path: 'report-incident',
        name: 'report-incident',
        component: () => import('@/pages/home/ReportIncident.vue'),
      },
      {
        path: 'incidents',
        name: 'incidents',
        component: () => import('@/pages/home/Incidents.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeResolve(async (to, from, next) => {
  next()
})

export { router }

export default function (app: App) {
  app.use(router)
}
