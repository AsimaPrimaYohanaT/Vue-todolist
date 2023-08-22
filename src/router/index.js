import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { d$auth } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestView.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      redirect: { name: 'Login' },
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/views/Profile/LoginView.vue')
        },
        {
          path: 'detail/:id?',
          name: 'Authenticated',
          component: () => import('@/views/Profile/AuthenticatedView.vue'),
          meta: { auth: true }
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('@/views/Profile/RegisterView.vue')
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Match All',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})


router.beforeEach((to, from, next) => {
  const loggedIn = d$auth().isLoggedIn
  if (to.meta.auth && !loggedIn) {
    next({ name: 'Login' })
  } else if (to.path === '/profile' && loggedIn) {
    next({ name: 'Authenticated', params: { id: d$auth().g$user.id } })
  } else {
    next()
  }
})

export default router